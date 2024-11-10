import os
import platform
import psutil
import requests
from datetime import datetime
from flask import request, jsonify
from recommendation import find_best_devices
from helper import get_mac_address, create_mysql_connection
from scan_network import scan_network
import io

UPLOAD_FOLDER = 'uploads'  # Directory to store received files
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Updated chunk size to 7 MB
SMALL_CHUNK_SIZE = 7 * 1024 * 1024  # 7 MB

def split_file_into_small_chunks(file, chunk_size=SMALL_CHUNK_SIZE):
    """Split a file into smaller chunks of a given size."""
    file.stream.seek(0)
    while True:
        chunk = file.read(chunk_size)
        if not chunk:
            break
        yield chunk

def get_my_ip():
    os_type = platform.system()
    wifi_keywords = ["Wi-Fi", "wlan"]

    if os_type == "Windows":
        wifi_keywords.append("Wi-Fi")
    elif os_type == "Darwin": 
        wifi_keywords.append("en0")
    elif os_type == "Linux":
        wifi_keywords.extend(["wlan0", "wl"])  # Common Linux wireless prefixes

    for interface, addrs in psutil.net_if_addrs().items():
        if any(keyword in interface for keyword in wifi_keywords):
            for addr in addrs:
                if addr.family == 2:  # AF_INET (IPv4)
                    ip_split = addr.address.split('.')
                    # Return IP range based on the Wi-Fi adapter
                    ip_address = f"{ip_split[0]}.{ip_split[1]}.{ip_split[2]}.{ip_split[3]}"
                    return ip_address
    return None

# Endpoint to send a file to the device(s) with the highest storage
def send():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "File is required"}), 400
    
    receivers = None

    # Get available devices on the network and their storage info
    devices = scan_network()

    if not devices:
        return jsonify({"error": "No devices found on the network"}), 404

    # Sort devices by available storage in descending order
    devices.sort(key=lambda d: d.get("storage", 0), reverse=True)
    total_available_storage = sum(d['storage'] for d in devices)

    # Get the file size
    file.stream.seek(0, os.SEEK_END)
    file_size = file.stream.tell()
    file.stream.seek(0)  # Reset stream position after getting size
    # Check if there's enough storage across all devices
    if file_size > total_available_storage:
        return jsonify({"error": "Not enough storage across devices"}), 507

    # Get sender's MAC address and start time
    sender_mac = get_mac_address()
    start_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # If file can't fit in one device, split and distribute it across devices in smaller chunks
    remaining_size = file_size
    chunk_index = 0
    my_ip = get_my_ip()

    for device in devices:
        if remaining_size <= 0:
            break
        if device['ip'] == my_ip:
            continue

        receivers = device['mac'].lower()

        # Send smaller chunks up to the storage limit of each device
        device_storage = device['storage']
        device_used = 0

        for chunk in split_file_into_small_chunks(file):
            if device_used + len(chunk) > device_storage:
                break  # Move to the next device if storage limit is reached

            # Prepare chunk as a file-like object for sending
            chunk_stream = io.BytesIO(chunk)

            # Send chunk to device with "part" in the filename
            target_url = f"http://{device['ip']}:5000/receive"
            try:
                response = requests.post(
                    target_url,
                    files={'file': (f"{file.filename}", chunk_stream)},
                    data={'sender_mac': sender_mac, 'chunk_index': chunk_index, 'total_chunks': None},
                    timeout=50
                )
                if response.status_code == 200:
                    # Update remaining file size, device usage, and chunk index
                    remaining_size -= len(chunk)
                    device_used += len(chunk)
                    chunk_index += 1
                else:
                    return jsonify({"error": f"Failed to send chunk {chunk_index} to {device['ip']}"}), response.status_code
            except requests.exceptions.RequestException as e:
                return jsonify({"error": f"Exception occurred: {e}"}), 500

    # Log the transfer details for this chunk in the database
    conn = create_mysql_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO file_transfers (sender_mac, receiver_mac, file_name, file_size, start_time)
        VALUES (%s, %s, %s, %s, %s)
    ''', (sender_mac.lower(), receivers, f"{file.filename}", file_size, start_time))
    conn.commit()
    conn.close()

    return jsonify({"message": "File sent successfully in parts"}), 200

# Endpoint to receive a file part and store it
def receive():
    file = request.files.get('file')
    sender_mac = request.form.get('sender_mac')
    chunk_index = request.form.get('chunk_index') or "complete"

    if not file or not sender_mac:
        return jsonify({"error": "File, sender's MAC address, and chunk index are required"}), 400

    # Create directory for the sender's MAC address if it doesn't exist
    mac_folder = os.path.join(UPLOAD_FOLDER, sender_mac)
    os.makedirs(mac_folder, exist_ok=True)

    # Save the file part in the sender's MAC address folder
    file_path = os.path.join(mac_folder, file.filename)
    file.save(file_path)

    return jsonify({"message": f"File part {chunk_index} received successfully"}), 200

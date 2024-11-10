import os
import shutil
from flask import jsonify
from collections import defaultdict
from helper import get_mac_address, create_mysql_connection, devices
from scan_network import scan_network, get_storage_info
import time

UPLOAD_FOLDER = 'uploads'


def get_files_from_client():
    client_mac = get_mac_address().lower()

    # Step 1: Query the file_transfers table for records from the specific client
    conn = create_mysql_connection()

    # Check if the connection was successful
    if not conn:
        return jsonify({"message": "Error connecting to MySQL database"}), 500

    cursor = conn.cursor()
    cursor.execute('''
        SELECT receiver_mac, file_name, start_time, end_time, file_size 
        FROM file_transfers 
        WHERE sender_mac = %s AND end_time IS NULL
    ''', (client_mac,))
    transfers = cursor.fetchall()

    # Fetch server information for each receiver_mac
    server_info = []
    for receiver_mac in set(transfer[0] for transfer in transfers):  # unique receiver_macs
        # Fetch username associated with receiver_mac from users table
        cursor.execute("SELECT username FROM users WHERE mac_address = %s", (receiver_mac,))
        username_result = cursor.fetchone()
        username = username_result[0] if username_result else "Unknown"

        # Fetch storage details from file_transfers
        cursor.execute('''
            SELECT SUM(file_size) AS total_storage,
                   MAX(file_size) AS max_file_size,
                   MAX(start_time) AS latest_file_date
            FROM file_transfers
            WHERE sender_mac = %s AND receiver_mac = %s
        ''', (client_mac, receiver_mac))
        storage_result = cursor.fetchone()
        total_storage = storage_result[0] if storage_result else 0
        max_file_size = storage_result[1] if storage_result else 0
        latest_file_date = storage_result[2] if storage_result else None

        server_info.append({
            "server_mac": receiver_mac,
            "username": username,
            "total_storage_bytes": total_storage,
            "max_file_size_bytes": max_file_size,
            "latest_file_date": latest_file_date
        })

    conn.close()


    # Step 3: Map transfer records to the files found and retrieve receiver IPs
    files_info = []
    for transfer in transfers:
        receiver_mac, file_name, start_time, end_time, file_size = transfer

        # Find the IP address of the receiver_mac in the scanned network devices
        receiver_ip = None
        for device in devices:
            if device['mac'].lower() == receiver_mac.lower():
                receiver_ip = device['ip']
                break

        # Include receiver details only if IP is found
        if receiver_ip:
            file_info = {
                "file_name": file_name,
                "start_time": start_time,
                "end_time": end_time,
                "size": file_size,
                "receiver_ip": receiver_ip
            }
            files_info.append(file_info)

    # If no files are found or IP addresses are missing, return an appropriate message
    if not files_info:
        return jsonify({"message": "No active file transfers found or receiver IPs not available"}), 404

    # Return both file and server information
    return jsonify({"files_info": files_info, "servers_info": server_info}), 200


def get_clients_storage_usage():
    clients_storage = defaultdict(int)

    # Step 1: Traverse the uploads directory
    if not os.path.exists(UPLOAD_FOLDER):
        return jsonify({"message": "No client data found"}), 404
    
    total_storage_for_clients = 0
    total, used, free = shutil.disk_usage("/")
    total_available_space = free

    # Step 2: Iterate through each client folder
    for client_mac in os.listdir(UPLOAD_FOLDER):
        client_folder = os.path.join(UPLOAD_FOLDER, client_mac)

        # Check if the path is a directory
        if os.path.isdir(client_folder):
            total_size = 0

            # Step 3: Calculate total size of files in the folder
            for file_name in os.listdir(client_folder):
                file_path = os.path.join(client_folder, file_name)
                if os.path.isfile(file_path):
                    total_size += os.path.getsize(file_path)

            # Step 4: Store the total size for each client
            clients_storage[client_mac] = total_size
            total_storage_for_clients += total_size

    # Step 5: Retrieve additional details from the database
    conn = create_mysql_connection()
    cursor = conn.cursor()

    result = []
    for client_mac, storage_usage in clients_storage.items():
        # Fetch the username from users table
        cursor.execute("SELECT username FROM users WHERE mac_address = %s", (client_mac,))
        user_result = cursor.fetchone()
        username = user_result[0] if user_result else "Unknown"

        # Fetch the latest and oldest start_time from file_transfers table
        cursor.execute('''
            SELECT 
                MAX(start_time) AS latest_start_time, 
                MIN(start_time) AS oldest_start_time 
            FROM file_transfers 
            WHERE sender_mac = %s AND end_time IS NULL
        ''', (client_mac,))
        time_result = cursor.fetchone()
        latest_start_time, oldest_start_time = time_result if time_result else (None, None)

        if storage_usage < 1e9:
            storage_usage = str(round(storage_usage / 1e6, 2)) + " MB"
        elif storage_usage < 1e15:
            storage_usage = str(round(storage_usage / 1e9, 2)) + " GB"
        else:
            storage_usage = str(round(storage_usage / 1e12, 2)) + " TB"

        latest_start_time = latest_start_time.strftime("%Y-%m-%d %H:%M:%S") if latest_start_time else None
        oldest_start_time = oldest_start_time.strftime("%Y-%m-%d %H:%M:%S") if oldest_start_time else None

        # Append the collected information to the result
        client_info = {
            "client_mac": client_mac,
            "username": username,
            "storage_usage_bytes": storage_usage,
            "latest_file_start_date": latest_start_time,
            "oldest_file_start_date": oldest_start_time
        }
        result.append(client_info)

    conn.close()

    storage_details = {
        "total_storage": total_storage_for_clients,
        "total_available_space": total_available_space
    }

    if total_storage_for_clients < 1e9:
            total_storage_for_clients = str(round(total_storage_for_clients / 1e6, 2)) + " MB"
    elif total_storage_for_clients < 1e15:
        total_storage_for_clients = str(round(total_storage_for_clients / 1e9, 2)) + " GB"
    else:
        total_storage_for_clients = str(round(total_storage_for_clients / 1e12, 2)) + " TB"

    if total_available_space < 1e9:
        total_available_space = str(round(total_available_space / 1e6, 2)) + " MB"
    elif total_available_space < 1e15:
        total_available_space = str(round(total_available_space / 1e9, 2)) + " GB"
    else:
        total_available_space = str(round(total_available_space / 1e12, 2)) + " TB"

    storage_details["total_storage_text"] = total_storage_for_clients
    storage_details["total_available_space_text"] = total_available_space


    return jsonify({"clients_storage_usage": result, "storage_details": storage_details}), 200

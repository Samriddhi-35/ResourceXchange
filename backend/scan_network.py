import shutil
from flask import jsonify
from concurrent.futures import ThreadPoolExecutor, as_completed
from system_info import get_device_ram
import scapy.all as scapy
import requests
import platform
import psutil

def get_storage_info():
    total, used, free = shutil.disk_usage("/")  # Get disk usage details
    return jsonify({"total_space": total, "used_space": used, "free_space": free})

# Query the storage of a device via its IP
def get_device_storage(ip):
    try:
        response = requests.get(f"http://{ip}:5000/storage", timeout=2)  # Assuming Flask API is on port 5000
        if response.status_code == 200:
            data = response.json()
            return {"storage": data["free_space"], "ip": ip}  # Return available storage and IP if successful
    except requests.exceptions.RequestException:
        pass
    return {"storage": 0, "ip": ip}

def get_wifi_ip():
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
                    return f"{ip_split[0]}.{ip_split[1]}.{ip_split[2]}.0/24"
    return None

# Perform ARP scan and gather storage info of each device
def scan_network():
    # Get the Wi-Fi IP address range to scan
    ip_range = get_wifi_ip()  # Assuming get_wifi_ip() function returns IP range like '192.168.0.0/24'
    if not ip_range:
        return []

    # Step 1: Perform ARP scan to identify devices on the network
    answered_list, unanswered_list = scapy.arping(ip_range, verbose=0)
    devices = [{"ip": received.psrc, "mac": (received.hwsrc).replace(":", "-")} for sent, received in answered_list]

    # Step 2: Concurrently retrieve storage information for each device
    with ThreadPoolExecutor() as executor:
        future_to_device = {
            executor.submit(get_device_storage, device["ip"]): device for device in devices
        }
        future_to_ram = {
            executor.submit(get_device_ram, device["ip"]): device for device in devices
        }

        for future in as_completed(future_to_device):
            device = future_to_device[future]
            try:
                storage_info = future.result()
                if storage_info:
                    device["storage"] = storage_info["storage"]  # Add storage info if available
                else:
                    device["storage"] = 0  # Assign 0 if no storage info was retrieved
            except Exception:
                device["storage"] = 0  # Default storage to 0 if an error occurred

        for future in as_completed(future_to_ram):
            device = future_to_ram[future]
            try:
                ram_info = future.result()
                if ram_info:
                    device["total_ram"] = ram_info["total_ram"]
                    device["available_ram"] = ram_info["available_ram"]
            except Exception:
                device["total_ram"] = -1
                device["available_ram"] = -1
    return devices

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
                    return jsonify({"ip_address": ip_address}), 200
    return jsonify({"error": "Failed to get IP address"}), 500


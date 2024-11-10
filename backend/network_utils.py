import platform
import scapy.all as scapy
import psutil
import requests

from helper import get_mac_address
from file_management import my_ip

# Function to get the Wi-Fi IP address range
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

# Perform ARP scan and store results in a list
def scan_network(ip_range):
    answered_list, unanswered_list = scapy.arping(ip_range, verbose=0)

    # Store the details of connected devices
    devices = []
    for sent, received in answered_list:
        device_info = {
            "ip": received.psrc,   # Source IP address of the response
            "mac": received.hwsrc  # MAC address of the device
        }
        device_info["mac"] = device_info["mac"].replace(":", "-")
        devices.append(device_info)

    device_info = {
        "ip" : my_ip(),
        "mac" : get_mac_address()
    }
    if device_info not in devices:
        devices.append(device_info)

    return devices

# Query the storage of a device via its IP
def get_device_storage(ip):
    try:
        response = requests.get(f"http://{ip}:5000/storage", timeout=2)  # Assuming the Flask API is running on port 5000
        if response.status_code == 200:
            data = response.json()
            return data
    except requests.exceptions.RequestException:
        return None
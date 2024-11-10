from flask import jsonify
import psutil
import requests

def get_ram_info():
    memory_info = psutil.virtual_memory()
    return jsonify({
        "total_ram": memory_info.total,
        "available_ram": memory_info.available
    })

def get_device_ram(ip):
    try:
        response = requests.get(f"http://{ip}:5000/ram", timeout=2)
        if response.status_code == 200:
            return response.json()  # Expected output: {'total_ram': ..., 'available_ram': ...}
    except requests.exceptions.RequestException as e:
        pass
    return {"total_ram": 0 , "available_ram": 0}

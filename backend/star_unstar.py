from flask import jsonify, request
from scan_network import get_my_ip
from helper import add_to_starred_files, unstar_file, get_starred_files, devices
from file_management import UPLOAD_FOLDER
from scan_network import get_wifi_ip, scan_network
import os

def endpoint_star_file():
    file_name = request.json.get('file_name')
    ip_address = request.json.get('ip_address')

    client_mac = None
    for device in devices:
        if device['ip'].lower() == ip_address:
            client_mac = device['mac'].lower()
            break

    if not client_mac:
        return jsonify({"message": "Client MAC not found for the specified IP address"}), 404

    if not file_name:
        return jsonify({"error": "File path is required"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, client_mac, file_name)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    add_to_starred_files(client_mac, file_name, os.path.getsize(file_path))

    return jsonify({"message": "File starred successfully"}), 200


def endpoint_unstar_file():
    file_name = request.json.get('file_name')
    ip_address = request.json.get('ip_address')

    client_mac = None
    for device in devices:
        if device['ip'].lower() == ip_address:  
            client_mac = device['mac'].lower()
            break

    if not client_mac:
        return jsonify({"message": "Client MAC not found for the specified IP address"}), 404

    if not file_name:
        return jsonify({"error": "File path is required"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, client_mac, file_name)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    unstar_file(client_mac, file_name)

    return jsonify({"message": "File unstarred successfully"}), 200

def endpoint_get_starred_files():
    ip_address = get_my_ip()
    client_mac = None
    for device in devices:
        if device['ip'].lower() == ip_address:
            client_mac = device['mac'].lower()
            break

    if not client_mac:
        return jsonify({"message": "Client MAC not found for the specified IP address"}), 404

    starred_files = get_starred_files(client_mac)

    return jsonify({"starred_files": starred_files}), 200

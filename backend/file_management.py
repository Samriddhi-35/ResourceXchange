import os
from flask import request, jsonify , send_file
from scan_network import get_wifi_ip, scan_network
from helper import remove_from_starred_files ,was_file_starred , add_to_starred_files, create_mysql_connection, devices

UPLOAD_FOLDER = 'uploads'
TRASH_FOLDER = 'TRASH'

def move_to_trash(file_path, mac_address):
    if not os.path.exists(file_path):
        return False, "File not found"

    # Ensure TRASH/{MAC_addr} directory exists
    trash_dir = os.path.join(TRASH_FOLDER, mac_address)
    os.makedirs(trash_dir, exist_ok=True)

    # Move the file to Trash
    file_name = os.path.basename(file_path)
    trash_path = os.path.join(trash_dir, file_name)

    try:
        os.rename(file_path, trash_path)
        update_end_time_in_db(file_name, mac_address)
        file_was_starred = was_file_starred(mac_address, file_name)  # Check if it was starred before deletion
        if file_was_starred:
            remove_from_starred_files(mac_address, file_name)
        return True, f"File moved to Trash: {trash_path}"
    except Exception as e:
        return False, f"Failed to move file to Trash: {str(e)}"

def update_end_time_in_db(file_name, mac_address):
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"

    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE file_transfers
        SET end_time = NOW()
        WHERE file_name = %s AND sender_mac = %s
    ''', (file_name, mac_address))

    conn.commit()
    conn.close()

def delete_file():
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

    success, message = move_to_trash(file_path, client_mac)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 500
    
def restore_file():
    file_name = request.json.get('file_name')
    ip_address = request.json.get('ip_address')

    client_mac = None
    for device in devices:
        if device['ip'].lower() == ip_address:
            client_mac = device['mac'].lower()
            break

    if not client_mac:
        return jsonify({"message": "Client MAC not found for the specified IP address"}), 404

    trash_path = os.path.join(TRASH_FOLDER, client_mac, file_name)
    original_path = os.path.join(UPLOAD_FOLDER, client_mac, file_name)

    if not os.path.exists(trash_path):
        return jsonify({"error": "File not found in Trash"}), 404

    os.makedirs(os.path.dirname(original_path), exist_ok=True)

    try:
        os.rename(trash_path, original_path)
        reset_end_time_in_db(file_name, client_mac)
        if was_file_starred(client_mac, file_name):
            file_size = os.path.getsize(original_path)
            add_to_starred_files(client_mac, file_name, file_size)
          
        return jsonify({"message": f"File restored: {original_path}"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to restore file: {str(e)}"}), 500

def reset_end_time_in_db(file_name, mac_address):
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"

    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE file_transfers
        SET end_time = NULL
        WHERE file_name = %s AND sender_mac = %s
    ''', (file_name, mac_address))

    conn.commit()
    conn.close()

def delete_from_trash():
    file_name = request.json.get('file_name')
    ip_address = request.json.get('ip_address')

    client_mac = None
    for device in devices:
        if device['ip'].lower() == ip_address:
            client_mac = device['mac'].lower()
            break

    if not client_mac:
        return jsonify({"message": "Client MAC not found for the specified IP address"}), 404

    trash_path = os.path.join(TRASH_FOLDER, client_mac, file_name)

    if not os.path.exists(trash_path):
        return jsonify({"error": "File not found in Trash"}), 404

    try:
        os.remove(trash_path)
        return jsonify({"message": f"File permanently deleted: {trash_path}"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete file from Trash: {str(e)}"}), 500

def download_file():
    file_name = request.json.get('file_name')
    ip_address = request.json.get('ip_address')

    client_mac = None
    for device in devices:
        if device['ip'].lower() == ip_address:
            client_mac = device['mac'].lower()
            break

    if not client_mac:
        return jsonify({"message": "Client MAC not found for the specified IP address"}), 404
    
    file_path = os.path.join(UPLOAD_FOLDER, client_mac, file_name)

    if not file_path:
        return jsonify({"error": "File path is required"}), 400
    if not file_path.startswith(UPLOAD_FOLDER):
        return jsonify({"error": "Invalid file path"}), 403
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    try:
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        return jsonify({"error": f"Failed to download file: {str(e)}"}), 500
    
def view_file():
    file_name = request.json.get('file_name')
    ip_address = request.json.get('ip_address')

    client_mac = None
    for device in devices:
        if device['ip'].lower() == ip_address:
            client_mac = device['mac'].lower()
            break

    if not client_mac:
        return jsonify({"message": "Client MAC not found for the specified IP address"}), 404
    
    file_path = os.path.join(UPLOAD_FOLDER, client_mac, file_name)

    if not file_path:
        return jsonify({"error": "File path is required"}), 400
    if not file_path.startswith(UPLOAD_FOLDER):
        return jsonify({"error": "Invalid file path"}), 403
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    try:
        return send_file(file_path, as_attachment=False)
    except Exception as e:
        return jsonify({"error": f"Failed to view file: {str(e)}"}), 500
    
def rename_file():
    current_file_name = request.json.get('file_name')
    new_file_name = request.json.get('new_file_name')
    ip_address = request.json.get('ip_address')

    client_mac = None
    for device in devices:
        if device['ip'].lower() == ip_address:
            client_mac = device['mac'].lower()
            break

    if not client_mac:
        return jsonify({"message": "Client MAC not found for the specified IP address"}), 404
    
    current_file_path = os.path.join(UPLOAD_FOLDER, client_mac, current_file_name)

    if not current_file_path or not new_file_name:
        return jsonify({"error": "Current file name and new file name are required"}), 400

    current_full_path = os.path.abspath(os.path.join(UPLOAD_FOLDER, client_mac, os.path.basename(current_file_path)))
    new_full_path = os.path.abspath(os.path.join(UPLOAD_FOLDER, client_mac, new_file_name))

    if not os.path.exists(current_full_path):
        return jsonify({"error": "Current file not found"}), 404

    if os.path.exists(new_full_path):
        return jsonify({"error": "A file with the new name already exists"}), 409

    try:
        # Rename the file on the server
        os.rename(current_full_path, new_full_path)

        # Update the database
        update_file_name_in_db(os.path.basename(current_file_path), new_file_name, client_mac)

        return jsonify({"message": f"File renamed to '{new_file_name}' successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to rename file: {str(e)}"}), 500

def update_file_name_in_db(old_file_name, new_file_name, mac_address):
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"

    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE file_transfers
        SET file_name = %s
        WHERE file_name = %s AND sender_mac = %s
    ''', (new_file_name, old_file_name, mac_address))

    conn.commit()
    conn.close()
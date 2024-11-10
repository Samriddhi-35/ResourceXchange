import mysql.connector
import psutil
import platform
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

def create_mysql_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("host"),
            user=os.getenv("user"),
            password=os.getenv("password"),
            database=os.getenv("database"),
            port=os.getenv("port")
        )
        if conn.is_connected():
            return conn
    except Error as e:
        print(f"Error: {e}")
        return None


DATABASE = 'database.db'

# Database setup
def initialize_database():
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"
    
    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            mac_address VARCHAR(255) NOT NULL
        )
    ''')

    # Create file_transfers table with a composite index
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS file_transfers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sender_mac VARCHAR(255) NOT NULL,
            receiver_mac VARCHAR(255) NOT NULL,
            file_name VARCHAR(255) NOT NULL,
            file_size INT NOT NULL,
            start_time DATETIME NOT NULL,
            end_time DATETIME,
            was_starred BOOLEAN DEFAULT FALSE
        )
    ''')

    # Create starred_files table with foreign key constraint
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS starred_files (
            id INT AUTO_INCREMENT PRIMARY KEY,
            mac_address VARCHAR(255) NOT NULL,
            file_name VARCHAR(255) NOT NULL,
            file_size INT NOT NULL,
            date_starred DATETIME NOT NULL
        )
    ''')

    # Commit the transaction and close the connection
    conn.commit()
    conn.close()

    print("Database initialized with users, file_transfers, and starred_files tables.")


# Retrieve the MAC address of the active network adapter
def get_mac_address(interface_name="Wi-Fi"):
    os_type = platform.system()
    
    # Set default interface names based on the OS
    if os_type == "Darwin":  # macOS
        interface_names = ["en0", "Wi-Fi"]
    elif os_type == "Windows":
        interface_names = ["Wi-Fi"]
    elif os_type == "Linux":
        interface_names = ["wlan0", "wl"]
    else:
        # Fallback to provided interface_name if OS is unknown
        interface_names = [interface_name]

    for interface, addrs in psutil.net_if_addrs().items():
        if any(name.lower() in interface.lower() for name in interface_names):
            for addr in addrs:
                if addr.family == psutil.AF_LINK:  # MAC address family
                    mac = addr.address.replace(":", "-")
                    return mac
    return "MAC Address Not Found"

devices = [{"ip": "192.168.190.79", "mac": "14-7f-ce-a2-ef-5d"}, {"ip": "192.168.190.226", "mac": "d0-ab-ba-d5-7f-59"}, {"ip": "192.168.190.24", "mac": "34-6f-24-d0-d6-ab"}]

def add_to_starred_files(mac_address, file_name, file_size):
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"
    
    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    cursor.execute('''
        SELECT id FROM starred_files WHERE mac_address = %s AND file_name = %s
    ''', (mac_address, file_name))
    
    if cursor.fetchone():
        conn.close()
        print(f"File '{file_name}' is already starred.")
        return {"message": f"File '{file_name}' is already starred."}
    
    cursor.execute('''
        INSERT INTO starred_files (mac_address, file_name, file_size, date_starred)
        VALUES (%s, %s, %s, NOW())
    ''', (mac_address, file_name, file_size))

    cursor.execute('''
        UPDATE file_transfers
        SET was_starred = TRUE
        WHERE file_name = %s AND sender_mac = %s
    ''', (file_name, mac_address))
    
    conn.commit()
    conn.close()
    print(f"File '{file_name}' starred successfully.")

def get_starred_files(mac_address):
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"
    
    # Create a cursor object to interact with the database
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT sf.file_name, sf.file_size, sf.date_starred
        FROM starred_files sf
        JOIN file_transfers ft ON sf.mac_address = ft.sender_mac AND sf.file_name = ft.file_name
        WHERE sf.mac_address = %s AND ft.end_time IS NULL
    ''', (mac_address,))
    
    starred_files = cursor.fetchall()
    conn.close()

    # Format the result for easy viewing
    starred_files_info = [{"file_name": file[0], "file_size": file[1], "date_starred": file[2]} for file in starred_files]
    return starred_files_info

def remove_starred_file_entry(mac_address, file_name):
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"
    
    # Create a cursor object to interact with the database
    cursor = conn.cursor()
    
    cursor.execute('''
        DELETE FROM starred_files WHERE mac_address = %s AND file_name = %s
    ''', (mac_address, file_name))
    
    conn.commit()
    conn.close()


def remove_from_starred_files(mac_address, file_name):
    remove_starred_file_entry(mac_address, file_name)
    
    # Update file_transfers table to set was_starred to FALSE
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"
    
    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE file_transfers
        SET was_starred = FALSE
        WHERE sender_mac = %s AND file_name = %s
    ''', (mac_address, file_name))

    conn.commit()
    conn.close()
    print(f"File '{file_name}' removed from starred files and was_starred updated to FALSE.")


def unstar_file(mac_address, file_name):
    remove_starred_file_entry(mac_address, file_name)

    # Update file_transfers table to set was_starred to FALSE
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"
    
    # Create a cursor object to interact with the database
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE file_transfers
        SET was_starred = FALSE
        WHERE sender_mac = %s AND file_name = %s
    ''', (mac_address, file_name))
    
    conn.commit()
    conn.close()
    print(f"File '{file_name}' manually unstarred and was_starred updated to FALSE.")

def was_file_starred(mac_address, file_name):
    conn = create_mysql_connection()

    if not conn:
        return "Error connecting to MySQL database"
    
    # Create a cursor object to interact with the database
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT was_starred FROM file_transfers WHERE sender_mac = %s AND file_name = %s
    ''', (mac_address, file_name))
    
    result = cursor.fetchone()
    conn.close()
    
    # Return True if was_starred is found and set to True
    return result is not None and result[0] == 1
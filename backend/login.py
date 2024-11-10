from helper import get_mac_address, create_mysql_connection
from flask import request, jsonify
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

# Registration endpoint
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    # Check if username, password, and email are provided
    if not username or not password or not email:
        return jsonify({"error": "Username, password, and email are required"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Get MAC address from server
    mac_address = get_mac_address()
    mac_address = mac_address.lower()

    try:
        # Store the user in the database
        conn = create_mysql_connection()

        if not conn:
            return jsonify({"error": "Error connecting to MySQL database"}), 500

        # Create a cursor object to interact with the database
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO users (username, password, email, mac_address)
            VALUES (%s, %s, %s, %s)
        ''', (username, hashed_password, email, mac_address))
        conn.commit()
        conn.close()

        return jsonify({"message": "User registered successfully", "username": username, "email": email}), 201
    except Exception as e:
        return jsonify({"error": "Username or email already exists"}), 400


# Login endpoint
def login():
    data = request.json
    username_or_email = data.get('username')
    password = data.get('password')

    if not username_or_email or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Fetch user data from the database
    conn = create_mysql_connection()

    if not conn:
        return jsonify({"error": "Error connecting to MySQL database"}), 500

    # Create a cursor object to interact with the database
    cursor = conn.cursor()
    cursor.execute('''
        SELECT username, password, email FROM users WHERE username = %s OR email = %s
    ''', (username_or_email, username_or_email))
    result = cursor.fetchone()
    conn.close()

    if result and bcrypt.check_password_hash(result[1], password):
        username = result[0]
        email = result[2]
        return jsonify({"message": "Login successful", "username": username, "email": email}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


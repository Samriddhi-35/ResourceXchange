#Problem Statement: High-performance RAM resources are dominated by a few major cloud
providers, making them costly and inaccessible for smaller users, while
vast amounts of idle RAM in personal devices remain underutilized.

Presentation Link: https://drive.google.com/drive/folders/1rxTdrRBpWnHXdGhDAk2wytKelvJ26Gto?usp=sharing

Solution: We are building a decentralized computing platform for individuals, small businesses, and developers that enables affordable, flexible
access to shared computing resources (RAM, GPU, storage) within a network .
Value Proposition : Our platform empowers users to share and monetize idle resources, providing a scalable and affordable alternative to
traditional cloud services. It uniquely supports RAM pooling, allowing highmemory tasks to be split across devices and run in parallel.



# Project Setup: Virtual Environments and Dependencies

This project utilizes virtual environments to manage dependencies and ensure a clean development environment. Here's how to set up and run your project:

**1. Creating a Virtual Environment**

We'll use Python's built-in `venv` module to create a virtual environment.

**Steps:**

1. Open a terminal window.
2. Navigate to your project directory using `cd`.
3. Run the following command to create a virtual environment named `my_env`:

```
python -m venv my_env
```

This creates a directory named `my_env` within your project, containing a self-contained Python installation and package management system.

**2. Activating the Virtual Environment**

**Windows:**

- **Command Prompt:**
   ```
   my_env\Scripts\activate.bat
   ```
- **PowerShell:**
   ```powershell
   .\my_env\Scripts\Activate.ps1
   ```

**Linux/macOS:**
   ```bash
   source my_env/bin/activate
   ```

Your terminal prompt will change to indicate the active virtual environment (e.g., `(my_env)your_username@your_machine:~/project_directory$`).

**3. Installing Dependencies from `requirements.txt`**

Inside the activated virtual environment, run the following command to install all packages listed in `requirements.txt`:

```
pip install -r requirements.txt
```

This downloads and installs all listed packages within your virtual environment.



# Database Initialization and Application Startup

This project requires two Python scripts to be executed in a specific order:

1. **first_run.py:**
   - Initializes the database schema, creating the `users` , `file_transfers` and `starred_files` table with the following structure:
     ```sql
     users (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       username TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL,
       mac_address TEXT NOT NULL
     )
     ```

     ```sql
     file_transfers (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         sender_mac TEXT NOT NULL,
         receiver_mac TEXT NOT NULL,
         file_name TEXT NOT NULL,
         file_size INTEGER NOT NULL,
         start_time TEXT NOT NULL,
         end_time TEXT,
         was_starred BOOLEAN
      )
      ```

       ```sql
     starred_files (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         mac_address TEXT NOT NULL,
         file_name TEXT NOT NULL,
         file_size INTEGER NOT NULL,
         date_starred TEXT NOT NULL,
         FOREIGN KEY (mac_address, file_name) REFERENCES file_transfers(sender_mac, file_name)
  
      )
      ```

   - Execute this script only once on the first run of your application.

2. **main.py:**
   - Starts the main application, containing logic for user registration and login right now.
   - This script should be run after successful database initialization using `first_run.py`.

**Running the Application:**

1. Open a terminal window in the project directory.
2. Execute `python first_run.py` to create the initial database structure.
3. Once completed (no errors), run `python main.py` to start the application.

**Note:**

- Registration and login functionality (/register and /login endpoints) are implemented in `login.py`. Both are POST requests with:

HIT POINT: "http://host_ip:5000/login", "http://host_ip:5000/register"

   ```json
   {
      "username": "your_username", 
      "password": "your_password"
   }
   ```
- Sending and Receiving file are implemented in `send_receive.py`. Both are POST requests with:

HIT POINT: "http://host_ip:5000/send"

   ```json
   {
      "file": "file" // Original file need to be sent from the frontend, remaining fields will be handled by backend itself. 
   }
   ```
- The `/files_from_client` endpoint allows retrieval of all files stored by a specific client via a GET request. HIT POINT: "http://host_ip:5000/files_from_client"

- The `/clients_storage_usage` endpoint provides the total storage used by all clients on the server via a GET request. HIT POINT: "http://host_ip:5000/files_from_client"

- The `/storage` endpoint provides the total free space in a computer via a GET request. HIT POINT: "http://host_ip:5000/files_from_client"

- The `/delete_file` endpoint moves a file in a server from UPLOADS directory to TRASH directory which takes the file path via POST request.

HIT POINT: "http://target_ip:5000/delete_file" -> target_ip: Server which contains the file.

   ```json
   {
      "file_name": "target_file_name", 
      "ip_address": "host_ip"
   }
   ```

- The `/restore_file` endpoint moves a file in a server from TRASH directory to UPLOADS directory which takes the file path via POST request.

HIT POINT: "http://target_ip:5000/restore_file" -> target_ip: Server which contains the file.

   ```json
   {
      "file_name": "target_file_name", 
      "ip_address": "host_ip"
   }
   ```


- The `/delete_from_trash` endpoint removes a file permanently from the server which takes the file path via POST request.

HIT POINT: "http://target_ip:5000/delete_from_trash" -> target_ip: Server which contains the file.

   ```json
   {
      "file_name": "target_file_name", 
      "ip_address": "host_ip"
   }
   ```


- The `/rename_file` endpoint changes the file name which takes the current file path and filename via POST request.

HIT POINT: "http://target_ip:5000/rename_file" -> target_ip: Server which contains the file.

   ```json
   {
      "file_name": "target_file_name", 
      "new_file_name": "target_new_file_name",
      "ip_address": "host_ip"
   }
   ```


- The `/download_file` endpoint downloads a file and it requires the file path and file will be sent as blob via a POST request.

HIT POINT: "http://target_ip:5000/download_file" -> target_ip: Server which contains the file.

   ```json
   {
      "file_name": "target_file_name", 
      "ip_address": "host_ip"
   }
   ```

- The `/view_file` endpoint sends a file and it requires the file path and file will be sent as blob via a POST request.

HIT POINT: "http://target_ip:5000/view_file" -> target_ip: Server which contains the file.

   ```json
   {
      "file_name": "target_file_name", 
      "ip_address": "host_ip"
   }
   ```

- The `/get_my_ip` endpoint returns the IP address of the machine via GET request.

- The `/ram` endpoint returns the RAM details of the machine via GET request.

- The `/star_file` endpoint stars a file.

HIT POINT: "http://target_ip:5000/star_file" -> target_ip: Server which contains the file.

   ```json
   {
      "file_name": "target_file_name", 
      "ip_address": "host_ip"
   }
   ```

- The `/unstar_file` endpoint unstars a file.

HIT POINT: "http://target_ip:5000/unstar_file" -> target_ip: Server which contains the file.

   ```json
   {
      "file_name": "target_file_name", 
      "ip_address": "host_ip"
   }
   ```

- The `/get_starred_files` endpoint returns all starred files via a GET request. HIT POINT: "http://host_ip:5000/get_starred_files"

- The `/gen_llm` endpoint returns the text generated by Gemini via a POST request.

HIT POINT: "http://host_ip:5000/gen_llm"

   ```json
   {
      "prompt": "your_prompt"
   }
   ``` 

 - The `/run_code` endpoint takes file name and returns the output of the executed file via a POST request.

   ```json
      {
         "file_name": "file_name.py"
      }
      ``` 

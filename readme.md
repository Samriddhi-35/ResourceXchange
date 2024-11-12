
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


  

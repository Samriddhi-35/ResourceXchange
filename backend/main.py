from flask import Flask
from flask_bcrypt import Bcrypt
from retrieve_info import get_files_from_client, get_clients_storage_usage
from system_info import get_ram_info
# from shared_execute import execute_function, run_code
from llm_gen import generate_output
from flask_cors import CORS
import login
# import send_receive
import scan_network
import file_management
# import star_unstar

app = Flask(__name__)
bcrypt = Bcrypt(app)

CORS(app)

app.add_url_rule('/files_from_client', view_func=get_files_from_client, methods=["GET"])
app.add_url_rule('/clients_storage_usage', view_func=get_clients_storage_usage, methods=["GET"])
app.add_url_rule('/register', view_func=login.register, methods=["POST"])
app.add_url_rule('/login', view_func=login.login, methods=["POST"])
# app.add_url_rule('/send', view_func=send_receive.send, methods=["POST"])
# app.add_url_rule('/receive', view_func=send_receive.receive, methods=["POST"])
app.add_url_rule('/storage', view_func=scan_network.get_storage_info, methods=["GET"])
app.add_url_rule('/delete_file', view_func=file_management.delete_file, methods=["POST"])
app.add_url_rule('/restore_file', view_func=file_management.restore_file, methods=["POST"])
app.add_url_rule('/delete_from_trash', view_func=file_management.delete_from_trash, methods=["POST"])
app.add_url_rule('/download_file', view_func=file_management.download_file, methods=["POST"])
app.add_url_rule('/view_file', view_func=file_management.view_file, methods=["POST"])
app.add_url_rule('/rename_file', view_func=file_management.rename_file, methods=["POST"])
# app.add_url_rule('/star_file', view_func=star_unstar.endpoint_star_file, methods=["POST"])
# app.add_url_rule('/unstar_file', view_func=star_unstar.endpoint_unstar_file, methods=["POST"])
# app.add_url_rule('/get_starred_files', view_func=star_unstar.endpoint_get_starred_files, methods=["GET"])
app.add_url_rule('/get_my_ip', view_func=scan_network.get_my_ip, methods=["GET"])
app.add_url_rule('/ram', view_func=get_ram_info, methods=["GET"])
# app.add_url_rule('/execute_function', view_func=execute_function, methods=["POST"])
app.add_url_rule('/gen_llm', view_func=generate_output, methods=["POST"])
# app.add_url_rule('/run_code', view_func=run_code, methods=["POST"])

app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=True)
import base64
import os
import subprocess
import pickle
import dill
from flask import jsonify, request
import numpy as np

local_cache = {}
def execute_function():
    data = request.get_json()
    func_code = data.get('func')
    inputs = data.get('inputs')
    use_cache = data.get('use_cache', False)

    if data.get('matrix') is not None:
        inputs = [np.array(mat) for mat in inputs]
    
    # Deserialize function and execute
    func = dill.loads(base64.b64decode(func_code))
     # If cache is enabled, check for cached intermediate results
    if use_cache:
        # Use 'n' as a key for functions like Fibonacci where inputs are numbers
        n = tuple(inputs) if isinstance(inputs, list) else inputs.get('n')
        if n in local_cache:
            return jsonify({"result": local_cache[n]})

    # Execute the function with provided inputs
    result = func(inputs)
     # Update local cache if caching is enabled and result is not None
    if use_cache and result is not None:
        local_cache[n] = result  # Store the result in cache


    if data.get('matrix') is not None:
        return jsonify({"result": result.tolist()})
    
    return jsonify({"result": result})

def run_code():
    file_name = request.json.get('file_name')

    if not file_name:
        return jsonify({"error": "File path is required"}), 400
    
    path = os.path.abspath(os.path.join("..", "content", file_name))
    path = path.replace("\\", "\\\\")
    
    try:
        result = subprocess.run(["python3.10", path], capture_output=True, text=True, check=True, shell=True)
        output = result.stdout
        return jsonify({"status": "success", "output": output})
    
    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "output": e.output, "error": str(e)}), 500
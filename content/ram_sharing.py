import base64
from concurrent.futures import ThreadPoolExecutor, as_completed
import dill
import requests
import pickle
from scan_network import scan_network
import math
import numpy as np
import time
from threading import Lock

class RAMSharing:
    def __init__(self, port=5000, endpoint="/execute_function", max_retries=3):
        self.default_port = port
        self.endpoint = endpoint
        self.shared_cache = {}  # Cache to store intermediate results
        self.cache_lock = Lock()  # Lock to manage access to shared cache
        self.max_retries = max_retries  # Maximum number of retries for error handling
   

    def get_available_devices(self, ip_list=None , ram_min=1, check_server=True, max_devices=100):
        """
        Discover available devices in the network with required RAM and optional Flask availability. 
        Returns a list of available devices' IP addresses.
        """
        available_devices = []
        if ip_list is None:
            devices = scan_network()
            for device in devices:
                if len(available_devices) > max_devices:
                    break
                if device['available_ram'] >= ram_min*1024*1024*1024 and device['ip']!="192.168.190.79":
                    if check_server and self._check_flask_server(device['ip']):
                        available_devices.append(device['ip'])
                    elif not check_server:
                        available_devices.append(device['ip'])

        else:
            for ip in ip_list:
                if len(available_devices) > max_devices:
                    break
                if self._check_ram(ip) >= ram_min*1024*1024*1024 and ip!="192.168.190.79":
                    if check_server and self._check_flask_server(ip):
                        available_devices.append(ip)
                    elif not check_server:
                        available_devices.append(ip)

        return available_devices

    def run_distributed(self, func, inputs, devices, endpoint=None, np_matrix=False, partial_parallel=False):
        """
        Run a distributed function across multiple devices in parallel.
        The function is executed on a partitioned input subset for each device, and
        the results are returned. The developer can then combine these results as required.
        """
        endpoint = endpoint or self.endpoint
        serialized_func = self._serialize_function(func)
        results = []

        input_splits = None
        a_splits = None
        b_splits = None

        # Split matrix A and B into submatrices based on the number of devices
        if np_matrix:
            matrix_a = inputs[0]
            matrix_b = inputs[1]
            a_splits, b_splits = self._split_matrices(matrix_a, matrix_b, len(devices))
        else:
            # Split the input data based on the number of devices
            input_splits = self._split_input(inputs, len(devices))

        # Use ThreadPoolExecutor to send tasks to devices in parallel
        with ThreadPoolExecutor() as executor:
            futures = []
            
            # Determine which input data to use based on the presence of input_splits
            if input_splits is not None:
                # If input_splits is provided, use it for each device
                for device, split in zip(devices, input_splits):
                    futures.append(
                        executor.submit(self._send_task_to_device, device, serialized_func, split, endpoint, np_matrix)
                    )
            else:
                # Otherwise, use (a_splits, b_splits) for each device
                for device, (a_split, b_split) in zip(devices, zip(a_splits, b_splits)):
                    futures.append(
                        executor.submit(self._send_task_to_device, device, serialized_func, (a_split, b_split), endpoint, np_matrix)
                    )

            # Gather results as each task completes
            for future in as_completed(futures):
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    print(f"Task failed: {e}")

        return results

    def _split_input(self, inputs, num_splits):
        """
        Split the input data based on the number of splits (usually the number of devices).
        Supports lists, sets, and dictionaries.
        """
        if isinstance(inputs, list):
            # Split list into even chunks
            chunk_size = math.ceil(len(inputs) / num_splits)
            return [inputs[i:i + chunk_size] for i in range(0, len(inputs), chunk_size)]
        
        elif isinstance(inputs, set):
            # Convert to list, split, and convert chunks back to sets
            input_list = list(inputs)
            chunk_size = math.ceil(len(input_list) / num_splits)
            return [set(input_list[i:i + chunk_size]) for i in range(0, len(input_list), chunk_size)]
        
        elif isinstance(inputs, dict):
            # Split dictionary items into even chunks
            items = list(inputs.items())
            chunk_size = math.ceil(len(items) / num_splits)
            return [dict(items[i:i + chunk_size]) for i in range(0, len(items), chunk_size)]
        
    def _split_matrices(self, matrix_a, matrix_b, num_splits):
        """
        Split matrix A and B into submatrices for distribution across devices.
        """
        split_size = len(matrix_a) // int(math.sqrt(num_splits))  # assume num_splits is a perfect square
        a_splits = [matrix_a[i:i + split_size, j:j + split_size]
                    for i in range(0, len(matrix_a), split_size)
                    for j in range(0, len(matrix_a), split_size)]
        b_splits = [matrix_b[i:i + split_size, j:j + split_size]
                    for i in range(0, len(matrix_b), split_size)
                    for j in range(0, len(matrix_b), split_size)]
        return a_splits, b_splits

    def _combine_results(self, results, size):
        """
        Combine submatrix results into the final matrix.
        """
        split_size = int(size / math.sqrt(len(results)))
        final_matrix = np.zeros((size, size))
        idx = 0
        for i in range(0, size, split_size):
            for j in range(0, size, split_size):
                final_matrix[i:i + split_size, j:j + split_size] = results[idx]
                idx += 1
        return final_matrix

    def _send_task_to_device(self, device, serialized_func, inputs, endpoint, np_matrix):
        """
        Helper function to send task to a single device and return the result.
        """
        for attempt in range(self.max_retries):
         if np_matrix:
            # Convert matrices to lists for JSON serialization
             input_lists = [mat.tolist() if isinstance(mat, np.ndarray) else mat for mat in inputs]
            
             response = requests.post(
                f"http://{device}:{self.default_port}{endpoint}",
                json={"func": serialized_func, "inputs": input_lists, "matrix": True,"use_cache": True}
             )
             response.raise_for_status()

            # Convert the result back to ndarray
             result_list = response.json().get("result")
             return np.array(result_list) if result_list else None
        
         response = requests.post(
            f"http://{device}:{self.default_port}{endpoint}",
            json={"func": serialized_func, "inputs": inputs}
        )
         response.raise_for_status()
         return response.json().get("result")

    def _check_flask_server(self, ip):
        """
        Check if Flask server is running on the device.
        """
        try:
            response = requests.get(f"http://{ip}:{self.default_port}/ram")
            return response.status_code == 200
        except requests.RequestException:
            return False

    def _check_ram(self, ip):
        """
        Checking the RAM on a device.
        """
        try:
            response = requests.get(f"http://{ip}:5000/ram", timeout=2)
            if response.status_code == 200:
                result = response.json()  # Expected output: {'total_ram': ..., 'available_ram': ...}
                return result['available_ram']
        except requests.exceptions.RequestException as e:
            pass
        return 0

    def _serialize_function(self, func):
        """
        Serialize the function to be sent over the network.
        """
        serialized_data = dill.dumps(func)  # Serialize with dill
        return base64.b64encode(serialized_data).decode('utf-8') 


    def _update_cache(self, key, value):
        with self.cache_lock:
            self.shared_cache[key] = value

    def get_cached_value(self, key):
        with self.cache_lock:
            return self.shared_cache.get(key)

   

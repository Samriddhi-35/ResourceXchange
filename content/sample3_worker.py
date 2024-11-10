import socket
import pickle
import cloudpickle

def worker_fibonacci_server(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("0.0.0.0", port))
        s.listen()
        print(f"Worker listening on port {port}")

        while True:
            conn, addr = s.accept()
            with conn:
                print(f"Connected by {addr}")
                
                data = conn.recv(4096)
                func, args = pickle.loads(data)
                
                result = func(*args)
                conn.sendall(pickle.dumps(result))

if __name__ == "__main__":
    worker_fibonacci_server(port=5001)  # Adjust port for each device

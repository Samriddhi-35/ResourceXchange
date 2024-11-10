import ram_sharing as RS
import hashlib

ram_sharing = RS.RAMSharing()

devices = ram_sharing.get_available_devices(
    ram_min=1,
    check_server=True,
    max_devices=10
)

print("Available devices:", devices)

# Define the function to hash a data chunk
def hash_chunk(data_chunks):
    hashed_chunks = []
    for data_chunk in data_chunks:
        hashed_chunks.append(hashlib.sha256(data_chunk.encode()).hexdigest())
    return hashed_chunks

# Define a function to compute Merkle root hash
def compute_merkle_root_hash(data_chunks):
    # Base case for a single chunk
    if not data_chunks:
     return None

    if len(data_chunks) == 1:
        return data_chunks[0]  # Final root hash

    # Compute intermediate hashes in pairs
    intermediate_hashes = []
    for i in range(0, len(data_chunks), 2):
        left = data_chunks[i]
        right = data_chunks[i + 1] if i + 1 < len(data_chunks) else data_chunks[i]  # Handle odd number of chunks
        combined = left + right
        intermediate_hashes.append(hash_chunk(combined))

    # Recursively compute the Merkle root hash on the intermediate hashes
    return compute_merkle_root_hash(intermediate_hashes)

data_chunks = ["data_part_1", "data_part_2", "data_part_3", "data_part_4"]

# Distribute hashing tasks across devices
chunk_hashes = ram_sharing.run_distributed(
    func=hash_chunk,
    inputs=data_chunks,
    devices=devices,
    partial_parallel=True
)

merkle_root_hash = compute_merkle_root_hash(chunk_hashes)

if merkle_root_hash:
    print("Merkle Root Hash:", merkle_root_hash)
else:
    print("No data chunks to process.")
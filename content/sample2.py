# Partial parallelism -> Matrix multiplication

import numpy as np
import ram_sharing as RS

ram_sharing = RS.RAMSharing()

# Get available devices
devices = ram_sharing.get_available_devices(
    ram_min=1, 
    check_server=True,
    max_devices=10
    )

print("Available devices:", devices)

def matrix_multiply(mat):
    mat1 = mat[0]
    mat2 = mat[1]
    return np.dot(mat1, mat2)

# Define two matrices to multiply
matrix_a = np.array([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
])
matrix_b = np.array([
    [17, 18, 19, 20],
    [21, 22, 23, 24],
    [25, 26, 27, 28],
    [29, 30, 31, 32]
])

inputs = [matrix_a, matrix_b]

# Run the distributed matrix multiplication
result = ram_sharing.run_distributed(
    func=matrix_multiply, 
    inputs=inputs, 
    devices=devices, 
    np_matrix=True, 
    partial_parallel=True
    )

# Print the resultant matrix
print("Resultant Matrix after distributed multiplication:\n", result)

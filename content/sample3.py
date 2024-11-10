# Partial parallelism -> FB series

import ram_sharing as RS
from sample3_shared import distributed_fibonacci

ram_sharing = RS.RAMSharing()

# Discover available devices on the network
devices = ram_sharing.get_available_devices(
    ram_min=1,
    check_server=True,
    max_devices=10
)

print("Available devices:", devices)

# Define a function to calculate Fibonacci using shared cache and memoization
def calculate_fibonacci_partial(n):
    cached_result = ram_sharing.get_cached_value(n)
    if cached_result is not None:
        return cached_result
    if n <= 1:
        ram_sharing._update_cache(n, n)
        return n

    # Calculate Fibonacci with partial cache updates
    result = distributed_fibonacci(n-1) + distributed_fibonacci(n-2)
    ram_sharing._update_cache(n, result)
    return result

# Fibonacci term to calculate
n = 10  # Example term; 
inputs = {"n": n}

# Run the distributed computation
result = ram_sharing.run_distributed(
    func=calculate_fibonacci_partial,
    inputs=inputs,
    devices=devices,
    partial_parallel=True
)

print(f"Fibonacci({n}) = {result[0]}")

# Complete parallelism -> Calculating the sum of squares

import ram_sharing as RS

ram_sharing = RS.RAMSharing()

devices = ram_sharing.get_available_devices(
    ram_min=0, 
    check_server=True,
    max_devices=10
    )

print(devices)

# Define a sample function to execute
def calculate_square_sum(numbers):
    return sum(x**2 for x in numbers)

# Run the distributed function
results = ram_sharing.run_distributed(
    func=calculate_square_sum,
    inputs=[i for i in range(1, 10001)],
    devices=devices,
    partial_parallel=False
)

print("Final result:", sum(results))
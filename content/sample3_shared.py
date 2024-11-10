import cloudpickle

def distributed_fibonacci(n, partial_results):
    if n in partial_results:
        return partial_results[n]
    if n <= 1:
        partial_results[n] = n
        return n
    partial_results[n] = distributed_fibonacci(n-1, partial_results) + distributed_fibonacci(n-2, partial_results)
    return partial_results[n]

def serialize_fibonacci():
    return cloudpickle.dumps(distributed_fibonacci).hex()

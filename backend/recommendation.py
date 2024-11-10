import random
from datetime import timedelta, date
import pandas as pd
from scan_network import scan_network

def introduce_variation(uptime_pattern):

    varied_pattern = uptime_pattern.copy()

    for _ in range(random.randint(1, 2)):
        hour_to_change = random.randint(0, 23)
        varied_pattern[hour_to_change] = 1 - varied_pattern[hour_to_change]
    return varied_pattern

def create_dataset(devices, start_date, consistent_patterns):
    data = []
    entries_per_server = 1
    server_id = 0

    for device in devices:
        server_id += 1
        server_mac = device["mac"]
        storage_capacity = device["storage"]


        base_reliability_score = round(random.uniform(0.6, 1.0), 2)
        base_response_time = random.randint(1, 100)

        for entry in range(entries_per_server):

            reliability_score = round(
                base_reliability_score + random.uniform(-0.05, 0.05), 2
            )
            reliability_score = max(0.6, min(1.0, reliability_score))

            avg_response_time = base_response_time + random.randint(-10, 10)
            avg_response_time = max(1, avg_response_time)

            energy_efficiency_rating = round(random.uniform(0.1, 1.0), 2)
            date_entry = start_date + timedelta(days=entry)

            if server_id <= 5:
                uptime_pattern = introduce_variation(consistent_patterns[server_id - 1])
            else:
                uptime_pattern = [random.choice([0, 1]) for _ in range(24)]

            data.append({
                "Date": date_entry,
                "Server_ID": f"Server_{server_id}",
                "MAC_Address": server_mac,
                "IP_Address": device["ip"],
                "Storage_Capacity (GB)": storage_capacity,
                "Server_Reliability_Score": reliability_score,
                "Avg_Response_Time (ms)": avg_response_time,
                "Energy_Efficiency_Rating": energy_efficiency_rating,
                "Uptime": uptime_pattern
            })

    df = pd.DataFrame(data)


    uptime_expanded = pd.DataFrame(df['Uptime'].tolist(), columns=[f'Hour_{i}' for i in range(24)])
    df = df.drop(columns=['Uptime']).join(uptime_expanded)

    return df

def normalize_column(series):
    """Normalizes a pandas Series to the range 0-1."""
    return (series - series.min()) / (series.max() - series.min())

def calculate_peak_consistency(df):
    hourly_columns = [col for col in df.columns if col.startswith("Hour_")]
    hourly_means = df.groupby("Server_ID")[hourly_columns].mean()
    peak_consistency = hourly_means.mean(axis=1)
    return peak_consistency

def normalize_column(column):
    if column.max() == column.min():
        return column
    return (column - column.min()) / (column.max() - column.min())

def calculate_priority_score(df, weights):
    df_mean = df.groupby('Server_ID').agg({
        'Server_Reliability_Score': 'mean',
        'Avg_Response_Time (ms)': 'mean',
        'Energy_Efficiency_Rating': 'mean'
    }).reset_index()


    df = df.merge(df_mean, on='Server_ID', suffixes=('', '_Mean'))

    df['Normalized_Peak_Consistency'] = normalize_column(df['Peak_Consistency_Score'])
    df['Normalized_Reliability'] = normalize_column(df['Server_Reliability_Score_Mean'])
    df['Normalized_Response_Time'] = normalize_column(df['Avg_Response_Time (ms)_Mean'])
    df['Normalized_Energy_Efficiency'] = normalize_column(df['Energy_Efficiency_Rating_Mean'])


    df['Priority_Score'] = (
        (df['Normalized_Peak_Consistency'] * weights['Peak_Consistency']) +
        (df['Normalized_Reliability'] * weights['Reliability']) +
        (df['Normalized_Response_Time'] * weights['Response_Time']) +
        (df['Normalized_Energy_Efficiency'] * weights['Energy_Efficiency'])
    )

    return df

def allocate_storage(file_size, time_window, server_storage, df, weights, k=1):

    available_nodes = df.copy()
    for hour in time_window:
        available_nodes = available_nodes[available_nodes[f"Hour_{hour}"] == 1]


    available_nodes['Current_Available_Storage (GB)'] = available_nodes['MAC_Address'].map(server_storage)


    available_nodes = available_nodes.drop_duplicates(subset=["Server_ID", "MAC_Address"])
    available_nodes = calculate_priority_score(available_nodes, weights)


    available_nodes = available_nodes.sort_values(by="Priority_Score", ascending=False)


    single_nodes = available_nodes[available_nodes["Current_Available_Storage (GB)"] >= file_size]
    if not single_nodes.empty:

        return single_nodes.head(k)[["MAC_Address", "Current_Available_Storage (GB)", "IP_Address"]]

    #
    total_allocated_storage = 0
    selected_servers = []
    chunk_allocation = []

    for _, row in available_nodes.iterrows():
        if total_allocated_storage >= file_size:
            break


        max_chunk_size = row["Current_Available_Storage (GB)"]
        chunk_size = min(file_size - total_allocated_storage, max_chunk_size)


        chunk_allocation.append({
            'mac': row['MAC_Address'],
            'Allocated_Chunk_Size (GB)': chunk_size,
            'ip': row['IP_Address'],
            'storage': row['Current_Available_Storage (GB)']
        })


        total_allocated_storage += chunk_size
        selected_servers.append(row["Server_ID"])

    if total_allocated_storage >= file_size:

        return pd.DataFrame(chunk_allocation)

    #
    return "Not enough storage available to allocate the file, even when distributed across multiple servers."

def find_best_devices(devices, file_size, time_window=[9,10,11]):
    start_date = date.today()
    consistent_patterns = [
        [1 if 9 <= hour < 17 else 0 for hour in range(24)],  # 9 AM - 5 PM
        [1 if 12 <= hour < 20 else 0 for hour in range(24)], # 12 PM - 8 PM
        [1 if 6 <= hour < 14 else 0 for hour in range(24)],  # 6 AM - 2 PM
        [1 if 8 <= hour < 16 else 0 for hour in range(24)],  # 8 AM - 4 PM
        [1 if 10 <= hour < 18 else 0 for hour in range(24)], # 10 AM - 6 PM
        [1 if 11 <= hour < 19 else 0 for hour in range(24)], # 11 AM - 7 PM
        [1 if 7 <= hour < 15 else 0 for hour in range(24)],  # 7 AM - 3 PM
    ]

    df = create_dataset(devices, start_date, consistent_patterns) 

    df["Peak_Consistency_Score"] = df["Server_ID"].map(calculate_peak_consistency(df))

    weights = {
            'Peak_Consistency': 0.4,
            'Reliability': 0.3,
            'Response_Time': 0.2,
            'Energy_Efficiency': 0.1,
        }

    server_storage = {}
    for device in devices:
        server_storage[device["mac"]] = device["storage"]

    allocation_result = allocate_storage(file_size, time_window, server_storage, df, weights)
    return allocation_result.to_dict(orient="records")
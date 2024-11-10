from helper import create_mysql_connection

# Connect to the MySQL database
conn = create_mysql_connection()
cursor = conn.cursor()

# Retrieve the names of all tables
cursor.execute("SHOW TABLES;")
tables = cursor.fetchall()

# Iterate over each table and print all rows
for table_name in tables:
    table = table_name[0]
    print(f"\nTable: {table}")
    
    # Retrieve all rows from the table
    cursor.execute(f"SELECT * FROM {table}")
    rows = cursor.fetchall()
    
    # Print each row
    for row in rows:
        print(row)

# Close the connection
conn.close()


# Deleting all rows
# cursor = conn.cursor()

# # Retrieve the names of all tables
# cursor.execute("SHOW TABLES;")
# tables = cursor.fetchall()

# # Iterate over each table and delete all rows
# for table_name in tables:
#     table = table_name[0]
#     print(f"Deleting all rows in table: {table}")
    
#     # Delete all rows from the table
#     cursor.execute(f"DELETE FROM {table}")
#     conn.commit()  # Commit after each deletion to apply changes

# print("All rows have been deleted from all tables.")

# # Close the connection
# conn.close()

import json
import os

# Get file path safely
def get_file_path(filename):
    return os.path.join("data", filename)

# Read JSON file
def read_json(filename):
    try:
        with open(get_file_path(filename), "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

# Write JSON file
def write_json(filename, data):
    with open(get_file_path(filename), "w") as file:
        json.dump(data, file, indent=4)
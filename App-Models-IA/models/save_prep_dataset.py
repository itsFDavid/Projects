import os
import json
from model_linear import parse_index
from parse_email import parse_email
DATASET_PROCESSED_PATH = "data_prep/"

def save_prep_dataset(index_path, n_elements):
    """Procesa los correos electrónicos y los guarda en archivos JSON."""
    if not os.path.exists(DATASET_PROCESSED_PATH):
        os.makedirs(DATASET_PROCESSED_PATH)

    indexes = parse_index(index_path, n_elements)

    for i in range(n_elements):

        file_name = f"email_{i}.json"
        file_path = os.path.join(DATASET_PROCESSED_PATH, file_name)

        if os.path.exists(file_path):
            continue

        mail, label = parse_email(indexes[i])
        email_data = {
            'subject': mail['subject'],
            'body': mail['body'],
            'label': label
        }

        with open(file_path, 'w') as email_file:
            json.dump(email_data, email_file)
    return True

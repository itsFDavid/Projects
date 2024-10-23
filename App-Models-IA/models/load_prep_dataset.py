import os
import json
DATASET_PROCESSED_PATH = "data_prep/"

def load_preprocessed_emails(n_elements):
    """Carga los correos electrónicos preprocesados."""
    X_pre = []
    y_pre = []
    files = os.listdir(DATASET_PROCESSED_PATH)

    n_elements = min(n_elements, len(files))

    for i in range(n_elements):
        file_path = os.path.join(DATASET_PROCESSED_PATH, files[i])

        with open(file_path, 'r') as email_file:
            email_data = json.load(email_file)

            mail_text = " ".join(email_data['subject']) + " " + " ".join(email_data['body'])
            X_pre.append(mail_text)
            y_pre.append(email_data['label'])

    return X_pre, y_pre
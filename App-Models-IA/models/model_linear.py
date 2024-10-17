import os
from parse_email import parse_email
DATASET_PATH = "data/"



def parse_index(path_to_index, n_elements):
    """Parse the index file."""
    ret_indexes = []
    index = open(path_to_index).readlines()
    for i in range(n_elements):
        mail = index[i].split(" ../")
        label = mail[0]
        path = mail[1][:-1]
        ret_indexes.append({
            "label": label,
            "email_path": os.path.join(DATASET_PATH, path)
        })
    return ret_indexes



def create_prep_dataset(index_path, n_elements):
    """Create the dataset."""
    X = []
    y = []
    indexes = parse_index(index_path, n_elements)
    for i in range(n_elements):
        mail, label = parse_email(indexes[i])
        X.append(" ".join(mail['subject']) + " ".join(mail['body']))
        y.append(label)
    return X,y
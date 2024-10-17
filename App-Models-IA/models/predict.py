from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer
from model_linear import create_prep_dataset
PATH="data/full/index"


def prediccion(n_elements, n_train, n_test):
    """Predict the accuracy of the model."""
    
    X, y = create_prep_dataset(PATH, n_elements)
    
    X_train, y_train = X[:n_train], y[:n_train]
    X_test, y_test = X[n_test:], y[n_test:]
    
    vectorizer = CountVectorizer()
    X_train = vectorizer.fit_transform(X_train)

    clf = LogisticRegression()
    clf.fit(X_train, y_train)
    
    X_test = vectorizer.transform(X_test)
    
    y_pred = clf.predict(X_test)
    
    return accuracy_score(y_test, y_pred)
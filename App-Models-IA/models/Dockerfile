FROM python:3.9.1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN python -m nltk.downloader stopwords

COPY . .

EXPOSE 4000

ENV FLASK_ENV=production

CMD ["flask", "run", "--host=0.0.0.0"]
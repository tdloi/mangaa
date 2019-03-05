# grpcio failed on python:3.6-alpine
FROM python:3.6

WORKDIR /src
COPY requirements/base.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir uwsgi

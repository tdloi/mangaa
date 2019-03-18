# grpcio failed on python:3.6-alpine
FROM python:3.6

WORKDIR /src
COPY requirements/base.txt requirements.txt

RUN pip install --no-cache-dir \
                -r requirements.txt \
                pytest \
                uwsgi

RUN apt-get update && apt-get upgrade -y \
    && wget -P /tmp https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.0.2.tar.gz \
    && tar xvfz /tmp/libwebp-1.0.2.tar.gz -C /tmp \
    && cd /tmp/libwebp-1.0.2 \
    && ./configure \
    && make \
    && make install \
    && rm -rf /tmp/libwebp*

ENV LD_LIBRARY_PATH=/usr/local/lib

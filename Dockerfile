FROM python:3.6

RUN pip install flask_sqlalchemy
RUN pip install flask_socketio
# RUN pip install psycopg2
RUN pip install psycopg2-binary
RUN pip install gevent-websocket
RUN pip install bcrypt
RUN pip install requests

RUN apt-get update && apt-get install -y supervisor \
&& rm -rf /var/lib/apt/lists/*
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY ./app /app

CMD ["/usr/bin/supervisord"]

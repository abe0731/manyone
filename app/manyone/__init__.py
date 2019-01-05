from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

__all__ = ['APP','SOK','DB']

APP = Flask(__name__, instance_relative_config=True)
APP.config.from_pyfile('config.py')

DB  = SQLAlchemy(APP)

SOK = SocketIO(logger=True)
SOK.init_app(app=APP)

import manyone.controller
import manyone.api



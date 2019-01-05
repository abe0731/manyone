from os import urandom
SECRET_KEY                     = urandom(24)
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_DATABASE_URI        = 'postgresql://postgres:postgres@172.18.0.2/manyone'
DEBUG                          = False


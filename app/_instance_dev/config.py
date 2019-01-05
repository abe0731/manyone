from os import urandom
SECRET_KEY                     = urandom(24)
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_DATABASE_URI        = 'postgresql://USER01:admin@localhost/test_db2'
DEBUG                          = True


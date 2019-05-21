from os import urandom
SECRET_KEY                     = urandom(24)
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_DATABASE_URI        = 'postgresql://awsuser:administrator@postgres-instance.crxexoahifxw.ap-northeast-1.rds.amazonaws.com/aprdbm'
DEBUG                          = False


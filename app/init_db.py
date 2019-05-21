from manyone import DB

if __name__ == '__main__':
    # アクセス中処理とまる
    # DB.reflect()
    # DB.drop_all()
    DB.create_all()
    DB.session.commit()

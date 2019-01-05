from flask import *
from sqlalchemy import and_
from manyone import *
from manyone.classes import *

__all__ = ['_app_start_ini','_create_access_log','_create_region_log','_is_org_valid','_is_user_valid','_is_admin_valid']

def _app_start_ini():
    """
    # 処理： アプリケーションサーバ起動時初期化処理
    # 概要：
    # 備考：
    """
    rst = DB.session.query(m_user).all()
    DB.session.query(t_user_status).delete()
    for r in rst:
        # 状況情報
        status = t_user_status(org_id=r.org_id
                              ,user_id=r.user_id
                              ,status='OFFLINE'
                              ,upd_dtm='2000/01/01'
                              )
        DB.session.add(status)
        DB.session.commit()

        # お知らせ情報
        org_rst  = DB.session.query(m_user
                        ).filter(m_user.org_id == r.org_id
                        ).all()
        for r_o in org_rst:
            org_chk  = DB.session.query(t_user_info
                                       ).filter(
                                            and_(t_user_info.org_id == r.org_id
                                                ,t_user_info.user_id == r.user_id
                                                ,t_user_info.target_org_id == r_o.org_id
                                                ,t_user_info.target_user_id == r_o.user_id
                                                )
                                       ).first()
            if org_chk is None:
                info = t_user_info(org_id=r.org_id
                                  ,user_id=r.user_id
                                  ,target_org_id=r_o.org_id
                                  ,target_user_id=r_o.user_id
                                  ,target_voice_cnt=0
                                  ,target_talk_cnt=0
                                  ,target_video_cnt=0
                                  )
                DB.session.add(info)
                DB.session.commit()

def _create_access_log(url):
    """
    # 処理： アクセスログ作成処理
    # 概要：
    # 備考：
    """
    ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
    log = t_sys_access_log(org_id=session.get('orgid')
                          ,user_id=session.get('userid')
                          ,ip=ip
                          ,url=url
                          )
    DB.session.add(log)
    DB.session.commit()

def _create_region_log(response):
    """
    # 処理： 地域ログ作成処理
    # 概要：
    # 備考：
    """
    log = t_sys_region_log(ip=session.get('ip_addr')
                          ,geoplugin_place              = response['geoplugin_place']
                          ,geoplugin_countryCode        = response['geoplugin_countryCode']
                          ,geoplugin_region             = response['geoplugin_region']
                          ,geoplugin_regionAbbreviated  = response['geoplugin_regionAbbreviated']
                          ,geoplugin_latitude           = response['geoplugin_latitude']
                          ,geoplugin_longitude          = response['geoplugin_longitude']
                          ,geoplugin_distanceMiles      = response['geoplugin_distanceMiles']
                          ,geoplugin_distanceKilometers = response['geoplugin_distanceKilometers']
                          )
    DB.session.add(log)
    DB.session.commit()

    region  = DB.session.query(m_region
                       ).filter(m_region.region == response['geoplugin_region']
                       ).first()
    if region is None:
        m_region = m_region(ip=response['geoplugin_region'])
        DB.session.add(m_region)
        DB.session.commit()

def _is_org_valid():
    orgid    = request.form.get('orgid')
    org_rst  = DB.session.query(m_org
                    ).filter(
                        and_(m_org.org_id == orgid
                            ,m_org.stop_flg == 0
                            ,m_org.del_flg == 0
                            )
                    ).first()
    if org_rst is not None:
        session['orgid']   = orgid
        session['orgnm']   = org_rst.org_nm
        session['orgimg']  = org_rst.profile_img_file
        return True
    else:
        return False

def _is_user_valid():
    """
    # 処理： ログイン認証処理
    # 概要：
    # 備考：
    """
    # todo: passにID+固定文字列結合 + 一方向暗号化

    import bcrypt
    salt     = bcrypt.gensalt(rounds=10, prefix=b'2a')
    userid   = request.form.get('userid')
    password = request.form.get('password')
    password = password.encode('utf-8')

    user_rst = DB.session.query(m_user
                    ).filter(
                        and_(m_user.org_id == session.get('orgid')
                            ,m_user.user_id == userid
                            ,m_user.stop_flg == 0
                            )
                    ).first()
    if user_rst is not None:
        # 初回以外
        if user_rst.user_pass_bcrypt is not None:
            if bcrypt.checkpw(password, user_rst.user_pass_bcrypt) == True:
                session['userid'] = user_rst.user_id
                session['usernm'] = user_rst.user_nm
                return True
            else:
                return False
        # 初期設定の場合(NULLはDB登録意外ありえない)
        else:
            # 入力パスワードがユーザーIDと一致
            if userid == user_rst.user_id:
                userid_utf8               = userid.encode('utf-8')
                bcrypt_password           = bcrypt.hashpw(userid_utf8, salt)
                user_rst.user_pass_bcrypt = bcrypt_password
                DB.session.commit()
                session['userid'] = user_rst.user_id
                session['usernm'] = user_rst.user_nm
                return True
            else:
                return False
    else:
        return False

def _is_admin_valid():
    # todo
    user_rst = DB.session.query(m_user
                    ).filter(
                        and_(m_user.org_id == session.get('orgid')
                            ,m_user.user_id == session.get('userid')
                            )
                    ).first()
    user_auth_rst = DB.session.query(m_user_auth
                    ).filter(m_user_auth.user_auth_cd == user_rst.user_auth_cd
                    ).first()
    if user_auth_rst.sysadm_access_flg == 1:
        return True
    else:
        return False

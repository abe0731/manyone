from flask import *
from sqlalchemy import and_
from datetime import datetime
from manyone import *
from manyone.classes import *
from manyone.functions import *

_manyone_protocol  = 'https://'
_manyone_domein    = 'chat-manyone.com'
# _manyone_protocol      = 'http://'
# _manyone_domein        = 'localhost'
_manyone_url_index     = _manyone_protocol + _manyone_domein
_manyone_url_auth      = _manyone_protocol + _manyone_domein + '/auth'
_manyone_url_login     = _manyone_protocol + _manyone_domein + '/login'
_manyone_url_admin     = _manyone_protocol + _manyone_domein + '/admin'
_manyone_url_cost_calc = _manyone_protocol + _manyone_domein + '/cost_calc'

import os
_cwd_path       = os.getcwd()
# _img_user_path  = _cwd_path + "\\manyone\\static\\img\\user\\"
# _img_grp_path   = _cwd_path + "\\manyone\\static\\img\\grp\\"
_img_user_path  = "/app/manyone/static/img/user/"
_img_grp_path  = "/app/manyone/static/img/grp/"
_list_img_user  = os.listdir(_img_user_path)
_list_img_grp   = os.listdir(_img_grp_path)

@APP.before_request
def before_request():
    # ログイン認証済み
    if session.get('orgid') is not None and session.get('userid') is not None:
        # システム管理画面の場合
        if request.url == _manyone_url_admin.replace('https://', 'http://', 1):
            # システム管理者の認証を行う
            if _is_admin_valid():
                # OKの場合、システム管理画面へ
                return
            else:
                # NGの場合、トップ画面へ
                return redirect(_manyone_url_index)
        # システム管理画面以外の場合
        else:
            return

    # 組織ID認証済み
    if session.get('orgid') is not None:
        if request.url == _manyone_url_login.replace('https://', 'http://', 1):
            return

    # 未認証でも通すパス
    if request.url == _manyone_url_auth.replace('https://', 'http://', 1):
        return
    # 未認証でも通すパス
    if request.url == _manyone_url_cost_calc.replace('https://', 'http://', 1):
        return
    # 未認証でも通すパス
    if request.url == _manyone_url_index.replace('https://', 'http://', 1) + '/static/img/manyone_icon.ico':
        return
    # 未認証でも通すパス
    if request.url == _manyone_url_index.replace('https://', 'http://', 1) + '/static/img/manyone_logo.png':
        return
    # 未認証でも通すパス
    if request.url == _manyone_url_index.replace('https://', 'http://', 1) + '/static/css/AdminLTE.min.css':
        return

    # それ以外は組織ID認証画面へ
    return redirect(_manyone_url_auth)

@APP.route('/auth', methods=['GET', 'POST'])
def auth():
    _create_access_log('/auth')
    if request.method == 'POST':
        if _is_org_valid():
            return redirect(_manyone_url_login)
        else:
            session.pop('orgid', None)
            session.pop('orgnm', None)
            session.pop('orgimg', None)
            return render_template('auth.html', errmsg="組織ID認証に失敗しました")
    return render_template('auth.html')

@APP.route('/login', methods=['GET', 'POST'])
def login():
    _create_access_log('/login')
    if request.method == 'POST':
        if _is_user_valid():
            return redirect(_manyone_url_index)
        else:
            session.pop('orgid', None)
            session.pop('orgnm', None)
            session.pop('orgimg', None)
            return render_template('login.html', errmsg="ユーザー認証に失敗しました")
    return render_template('login.html')
                          # セキュリティの関係でログイン画面に組織の情報を表示させない
                          # ,orgid=session.get('orgid')
                          # ,orgimg=session.get('orgimg')


@APP.route('/logout')
def logout():
    _create_access_log('/logout')

    rst_status = DB.session.query(t_user_status
                         ).filter(
                             and_(t_user_status.org_id == session.get('orgid')
                                 ,t_user_status.user_id == session.get('userid')
                                 )
                         ).first()
    rst_status.status = 'OFFLINE'
    rst_status.socket_id = None
    rst_status.peer_id = None
    DB.session.commit()


    session.pop('orgid', None)
    session.pop('orgnm', None)
    session.pop('orgimg', None)
    session.pop('userid', None)
    session.pop('usernm', None)
    return redirect(_manyone_url_auth)

@APP.route('/')
def index():
    _create_access_log('/index')

    rst_login_org = DB.session.query(m_org
                        ).filter(m_org.org_id == session.get('orgid')
                        ).first()

    rst_login_user = DB.session.query(m_user
                        ).filter(
                            and_(m_user.org_id == session.get('orgid')
                                ,m_user.user_id == session.get('userid')
                                )
                        ).first()
    rst_login_user_auth = DB.session.query(m_user_auth
                        ).filter(m_user_auth.user_auth_cd == rst_login_user.user_auth_cd
                        ).first()

    # ユーザーBOX
    sql_m_user = """
        select distinct 
           a.org_id
              ,c.org_nm
              ,a.user_id
              ,a.user_nm
              ,a.user_auth_cd
              ,a.profile_work
              ,a.profile_msg
              ,a.profile_img_file
              ,b.status
              ,b.upd_dtm
              ,coalesce((select target_voice_cnt
                  from t_user_info x
                 where x.org_id         = '@LOGIN_ORG_ID@'
                   and x.user_id        = '@LOGIN_USER_ID@'
                   and x.target_org_id  = a.org_id
                   and x.target_user_id = a.user_id
                limit 1
               ),0) as target_voice_cnt
              ,coalesce((select target_talk_cnt
                  from t_user_info y
                 where y.org_id         = '@LOGIN_ORG_ID@'
                   and y.user_id        = '@LOGIN_USER_ID@'
                   and y.target_org_id  = a.org_id
                   and y.target_user_id = a.user_id
                limit 1
               ),0) as target_talk_cnt
              ,coalesce((select target_video_cnt
                  from t_user_info z
                 where z.org_id         = '@LOGIN_ORG_ID@'
                   and z.user_id        = '@LOGIN_USER_ID@'
                   and z.target_org_id  = a.org_id
                   and z.target_user_id = a.user_id
                limit 1
               ),0) as target_video_cnt
          from m_user a left join t_user_status b on (a.org_id = b.org_id and a.user_id   = b.user_id)
             , m_org c
         where (a.org_id, a.user_id) not in (
            select d.org_id, d.user_id
              from m_user d
             where d.org_id  = '@LOGIN_ORG_ID@'
               and d.user_id = '@LOGIN_USER_ID@'
            )
           and a.org_id = c.org_id
           and a.stop_flg = 0
           and a.del_flg  = 0
           and a.org_id = '@LOGIN_ORG_ID@'
         order by a.org_id, a.user_id
    """
    sql_m_user = sql_m_user.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_m_user = sql_m_user.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_m_user = DB.session.execute(sql_m_user)
    rst_m_user = list(rst_m_user)


    # グループBOX
    sql_m_grp = """
        select a.grp_id
              ,a.grp_nm
              ,(select to_char(c.grp_talk_dtm,'yyyy-mm-dd hh24:mi')
                  from t_grp_talk c
                 where c.grp_id = a.grp_id
                 order by c.grp_talk_id desc
                limit 1
               ) as last_dtm
          from m_grp a
             , m_grp_user b
         where a.grp_id = b.grp_id
           and a.stop_flg = 0
           and a.del_flg  = 0
           and b.stop_flg = 0
           and b.del_flg  = 0
           and b.org_id   = '@LOGIN_ORG_ID@'
           and b.user_id  = '@LOGIN_USER_ID@'
         order by a.grp_id

    """
    sql_m_grp = sql_m_grp.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_m_grp = sql_m_grp.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_m_grp = DB.session.execute(sql_m_grp)
    rst_m_grp = list(rst_m_grp)

    return render_template('index.html'
                          ,rst_m_user=rst_m_user
                          ,rst_login_org=rst_login_org
                          ,rst_login_user=rst_login_user
                          ,rst_login_user_auth=rst_login_user_auth
                          ,now_dtm=datetime.now().strftime("%Y-%m-%d %H:%M")
                          ,list_img_user=_list_img_user
                          ,rst_m_grp=rst_m_grp
                          )

@APP.route('/admin')
def admin():
    _create_access_log('/admin')
    rst_login_org = DB.session.query(m_org
                            ).filter(m_org.org_id == session.get('orgid')
                            ).first()

    rst_login_user = DB.session.query(m_user
                        ).filter(
                            and_(m_user.org_id == session.get('orgid')
                                ,m_user.user_id == session.get('userid')
                                )
                        ).first()
    rst_login_user_auth = DB.session.query(m_user_auth
                        ).filter(m_user_auth.user_auth_cd == rst_login_user.user_auth_cd
                        ).first()

    rst_user_auth = DB.session.query(m_user_auth).order_by(m_user_auth.user_auth_cd).all()

    # 個別分析-分析するユーザー & ユーザー管理-編集するユーザー
    # 削除済みは含まない 停止済みは含む
    sql_m_user = """
        select c.org_id
              ,c.org_nm
              ,a.user_id
              ,a.user_nm
          from m_user a
             , m_org c
         where a.org_id = c.org_id
           and a.org_id = '@LOGIN_ORG_ID@'
           and a.del_flg = 0
         order by a.org_id, a.user_id
    """
    sql_m_user = sql_m_user.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_m_user = DB.session.execute(sql_m_user)
    rst_m_user = list(rst_m_user)

    # ユーザー管理 - 削除
    # 停止中のみ(削除済みは含まない)
    sql_stop_m_user = """
        select c.org_id
              ,c.org_nm
              ,a.user_id
              ,a.user_nm
          from m_user a
             , m_org c
         where a.org_id = c.org_id
           and a.org_id = '@LOGIN_ORG_ID@'
           and a.stop_flg = 1
           and a.del_flg = 0
         order by a.org_id, a.user_id
    """
    sql_stop_m_user = sql_stop_m_user.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_stop_m_user = DB.session.execute(sql_stop_m_user)
    rst_stop_m_user = list(rst_stop_m_user)

    sql_m_grp = """
        select a.grp_id
              ,a.grp_nm
              ,a.stop_flg
          from m_grp a
         where a.upd_org_id = '@LOGIN_ORG_ID@'
           and a.del_flg = 0
         order by a.grp_id
    """
    sql_m_grp = sql_m_grp.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_m_grp = DB.session.execute(sql_m_grp)
    rst_m_grp = list(rst_m_grp)

    sql_bipartite = """
        select coalesce(left((select user_nm from m_user where user_id = a.send_user_id),'6'),'NA') as send_user_nm
              ,coalesce(left((select user_nm from m_user where user_id = a.resv_user_id),'6'),'NA') as resv_user_nm
              ,count(*)
              ,(
                select count(*)
                  from t_user_video b
                 where call_org_id = a.send_org_id
                   and call_user_id = a.send_user_id
                   and resv_org_id = a.resv_org_id
                   and resv_user_id = a.resv_user_id
                 group by call_org_id, call_user_id, resv_org_id, resv_user_id
               )
          from t_user_talk a
         where send_org_id = '@LOGIN_ORG_ID@'
           and resv_org_id = '@LOGIN_ORG_ID@'
         group by send_org_id, send_user_id, resv_org_id, resv_user_id
         order by send_org_id, send_user_id
    """
    sql_bipartite = sql_bipartite.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_bipartite = DB.session.execute(sql_bipartite)
    rst_bipartite = list(rst_bipartite)

    # import os
    # cwd_path       = os.getcwd()
    # img_user_path  = cwd_path + "\\manyone\\static\\img\\user\\"
    # img_user_path  = "/app/manyone/static/img/user/"
    # list_img_user  = os.listdir(img_user_path)

    return render_template('admin.html'
                          ,rst_m_user=rst_m_user
                          ,rst_m_grp=rst_m_grp
                          ,rst_stop_m_user=rst_stop_m_user
                          ,rst_login_org=rst_login_org
                          ,rst_login_user =rst_login_user
                          ,rst_login_user_auth=rst_login_user_auth
                          ,rst_user_auth=rst_user_auth
                          ,list_img_user=_list_img_user
                          ,list_img_grp=_list_img_grp
                          ,rst_bipartite=rst_bipartite
                          )

@APP.route('/cost_calc')
def cost_calc():
    _create_access_log('/cost_calc')
    # アクセスできるの組織IDmanyoneだけ
    if session.get('orgid') != 'manyone':
        from flask import abort
        abort(404)
    else:
        """
        停止中ユーザーのデータ削除
        コスト計算

        引数で受け取る 対象年 月
        コントローラ用意する
        予定 → 確定 → 支払済

        ログローテート
            1年分くらい？
            アクセスログ　
            ユーザー訪問

        """
        # ------------------ DBログ  ------------------ #
        batch_log = t_sys_batch_log(pg=__file__
                                   ,proc='MONTHRY_PROC'
                                   ,msg='START'
                                   )
        DB.session.add(batch_log)
        DB.session.commit()

        # 全組織対象
        rst_target_org = DB.session.query(m_org
                              ).filter(m_org.stop_flg == 0
                              ).all()
        for r_org in rst_target_org:
            w_org_id = r_org.org_id

            # ------------------ DBログ  ------------------ #
            batch_log = t_sys_batch_log(pg=__file__
                                       ,proc='DELETE_DATA'
                                       ,msg='START'
                                       ,msg_detail=w_org_id
                                       )
            DB.session.add(batch_log)
            DB.session.commit()

            rst_del_user = DB.session.query(m_user
                                  ).filter(
                                      and_(m_user.stop_flg == 1
                                          ,m_user.del_flg == 0
                                          ,m_user.org_id == w_org_id
                                          )
                                  ).all()
            # 停止中かつ未削除のユーザーのデータを削除する
            for r_user in rst_del_user:
                w_user_id = r_user.user_id

                # ------------------ DBログ  ------------------ #
                batch_log = t_sys_batch_log(pg=__file__
                                           ,proc='DELETE_DATA'
                                           ,msg='TARGET'
                                           ,msg_detail=w_org_id+'/'+w_user_id
                                           )
                DB.session.add(batch_log)

                # m_user 論理削除して他を更新する　名前など
                ins_m_user = DB.session.query(m_user
                                     ).filter(
                                         and_(m_user.org_id == w_org_id
                                             ,m_user.user_id == w_user_id
                                             )
                                     ).first()
                ins_m_user.user_nm          = "(削除されたユーザー)"
                ins_m_user.user_pass_bcrypt = None
                ins_m_user.user_auth_cd     = None
                ins_m_user.profile_work     = None
                ins_m_user.profile_msg      = None
                ins_m_user.profile_img_file = None
                ins_m_user.stop_flg         = 1
                ins_m_user.del_flg          = 1
                ins_m_user.upd_org_id       = 'SYSTEM'
                ins_m_user.upd_user_id      = 'SYSTEM'
                ins_m_user.upd_dtm          = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                # t_user_talk
                sql_del_user_talk_1 = """
                    delete from t_user_talk
                     where send_org_id = '@TARGET_ORG_ID@' and send_user_id = '@TARGET_USER_ID@'
                       and (resv_org_id, resv_user_id) in (select org_id, user_id from m_user where del_flg = 1)
                """
                sql_del_user_talk_2 = """
                    delete from t_user_talk
                     where resv_org_id = '@TARGET_ORG_ID@' and resv_user_id = '@TARGET_USER_ID@'
                       and (send_org_id, send_user_id) in (select org_id, user_id from m_user where del_flg = 1)
                """
                sql_del_user_talk_1 = sql_del_user_talk_1.replace("@TARGET_ORG_ID@" ,w_org_id)
                sql_del_user_talk_1 = sql_del_user_talk_1.replace("@TARGET_USER_ID@",w_user_id)
                sql_del_user_talk_2 = sql_del_user_talk_2.replace("@TARGET_ORG_ID@" ,w_org_id)
                sql_del_user_talk_2 = sql_del_user_talk_2.replace("@TARGET_USER_ID@",w_user_id)
                DB.session.execute(sql_del_user_talk_1)
                DB.session.execute(sql_del_user_talk_2)

                # t_user_voice
                DB.session.query(t_user_voice
                        ).filter(
                            and_(t_user_voice.org_id == w_org_id
                                ,t_user_voice.user_id == w_user_id
                                )
                        ).delete()

                # t_user_video
                sql_del_user_video_1 = """
                    delete from t_user_video
                     where call_org_id = '@TARGET_ORG_ID@' and call_user_id = '@TARGET_USER_ID@'
                       and (resv_org_id, resv_user_id) in (select org_id, user_id from m_user where del_flg = 1)
                """
                sql_del_user_video_2 = """
                    delete from t_user_video
                     where resv_org_id = '@TARGET_ORG_ID@' and resv_user_id = '@TARGET_USER_ID@'
                       and (call_org_id, call_user_id) in (select org_id, user_id from m_user where del_flg = 1)
                """
                sql_del_user_video_1 = sql_del_user_video_1.replace("@TARGET_ORG_ID@" ,w_org_id)
                sql_del_user_video_1 = sql_del_user_video_1.replace("@TARGET_USER_ID@",w_user_id)
                sql_del_user_video_2 = sql_del_user_video_2.replace("@TARGET_ORG_ID@" ,w_org_id)
                sql_del_user_video_2 = sql_del_user_video_2.replace("@TARGET_USER_ID@",w_user_id)
                DB.session.execute(sql_del_user_video_1)
                DB.session.execute(sql_del_user_video_2)

                # t_user_status
                DB.session.query(t_user_status
                        ).filter(
                            and_(t_user_status.org_id == w_org_id
                                ,t_user_status.user_id == w_user_id
                                )
                        ).delete()
                # t_user_info
                DB.session.query(t_user_info
                        ).filter(
                            and_(t_user_info.org_id == w_org_id
                                ,t_user_info.user_id == w_user_id
                                )
                        ).delete()
                DB.session.query(t_user_info
                        ).filter(
                            and_(t_user_info.target_org_id == w_org_id
                                ,t_user_info.target_user_id == w_user_id
                                )
                        ).delete()

                # 削除したユーザーを記録する
                del_user_ins = t_org_del_user(del_org_id=w_org_id
                                             ,del_user_id=w_user_id
                                             ,upd_org_id='SYSTEM'
                                             ,upd_user_id='SYSTEM'
                                             )
                DB.session.add(del_user_ins)
                # データ削除 コミット
                DB.session.commit()

            # ------------------ DBログ  ------------------ #
            batch_log = t_sys_batch_log(pg=__file__
                                       ,proc='DELETE_DATA'
                                       ,msg='END'
                                       ,msg_detail=w_org_id
                                       )
            DB.session.add(batch_log)
            DB.session.commit()

            # ------------------ DBログ  ------------------ #
            batch_log = t_sys_batch_log(pg=__file__
                                       ,proc='CALC_COST'
                                       ,msg='START'
                                       ,msg_detail=w_org_id
                                       )
            DB.session.add(batch_log)
            DB.session.commit()

            # 停止中ユーザーを削除してから計算する
            # プログラムを動かした月のコスト計算する
            target_y   = datetime.now().strftime("%Y")
            target_m   = datetime.now().strftime("%m")
            rst_last_dtm = DB.session.query(t_org_cost
                                      ).filter(t_org_cost.org_id == w_org_id
                                      ).order_by("upd_dtm desc"
                                      ).first()
            if rst_last_dtm is not None:
                # 前回コスト計算日時～現在日時
                target_ymd = str(rst_last_dtm.upd_dtm)
            else:
                # コスト計算が初めての場合
                target_ymd = '1999-01-01 00:00:00.000000'

            rst_target_cost = DB.session.query(t_org_cost
                                      ).filter(
                                          and_(t_org_cost.org_id == w_org_id
                                              ,t_org_cost.year   == target_y
                                              ,t_org_cost.month  == target_m
                                              )
                                      ).first()
            # 未計算の場合
            if rst_target_cost is None:
                sql_cost_add_user = """
                    select count(*) as count_add_user
                        ,count(*) * @ADD_USER_COST@ as cost_add_user
                      from t_org_add_user
                     where add_org_id = '@TARGET_ORG_ID@'
                       and upd_dtm between to_timestamp('@TARGET_YMD@' ,'yyyy-mm-dd hh24:mi:ss.us')
                                       and current_timestamp
                """
                sql_cost_add_user = sql_cost_add_user.replace("@TARGET_ORG_ID@" ,w_org_id)
                sql_cost_add_user = sql_cost_add_user.replace("@TARGET_YMD@",target_ymd)
                sql_cost_add_user = sql_cost_add_user.replace("@ADD_USER_COST@",'300')
                rst_cost_add_user = DB.session.execute(sql_cost_add_user)

                w_cost_add_user = 0
                w_count_add_user = 0
                for r in rst_cost_add_user:
                    w_cost_add_user  = r.cost_add_user
                    w_count_add_user = r.count_add_user

                sql_cost_active_user = """
                    select count(*) as count_active_user
                          ,count(*) * @ACTIVE_USER_COST@ as cost_active_user
                      from m_user
                     where org_id   = '@TARGET_ORG_ID@'
                       and stop_flg = 0
                """
                sql_cost_active_user = sql_cost_active_user.replace("@TARGET_ORG_ID@", w_org_id)
                sql_cost_active_user = sql_cost_active_user.replace("@ACTIVE_USER_COST@",'300')
                rst_cost_active_user = DB.session.execute(sql_cost_active_user)

                w_cost_active_user  = 0
                w_count_active_user = 0
                for r in rst_cost_active_user:
                    w_cost_active_user  = r.cost_active_user
                    w_count_active_user = r.count_active_user

                w_cost_total = w_cost_add_user + w_cost_active_user

                cost_ins = t_org_cost(org_id=w_org_id
                                     ,year=target_y
                                     ,month=target_m
                                     ,cost_total=w_cost_total
                                     ,cost_detail_active_user=w_cost_active_user
                                     ,cost_detail_add_user=w_cost_add_user
                                     ,status="CONFIRM"
                                     ,upd_org_id='SYSTEM'
                                     ,upd_user_id='SYSTEM'
                                     )
                DB.session.add(cost_ins)
                DB.session.commit()
                # ------------------ DBログ  ------------------ #
                batch_log = t_sys_batch_log(pg=__file__
                                           ,proc='CALC_COST'
                                           ,msg='EXEC_CALC'
                                           ,msg_detail=w_org_id
                                           )
                DB.session.add(batch_log)
                DB.session.commit()
            # 計算済の場合
            else:
                # ------------------ DBログ  ------------------ #
                batch_log = t_sys_batch_log(pg=__file__
                                           ,proc='CALC_COST'
                                           ,msg='NO_CALC'
                                           ,msg_detail=w_org_id
                                           )
                DB.session.add(batch_log)
                DB.session.commit()
            # ------------------ DBログ  ------------------ #
            batch_log = t_sys_batch_log(pg=__file__
                                       ,proc='CALC_COST'
                                       ,msg='END'
                                       ,msg_detail=w_org_id
                                       )
            DB.session.add(batch_log)
            DB.session.commit()
        # ------------------ DBログ  ------------------ #
        batch_log = t_sys_batch_log(pg=__file__
                                   ,proc='MONTHRY_PROC'
                                   ,msg='END'
                                   )
        DB.session.add(batch_log)
        DB.session.commit()

        return redirect(_manyone_url_index)


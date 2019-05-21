from flask import *
from flask_socketio import *
# from flask import url_for, session, render_template, request, redirect
# from flask_socketio import emit
from sqlalchemy import and_
from datetime import datetime
from manyone import *
from manyone.functions import *
from manyone.classes import *

@SOK.on('sok_srv_user_visit', namespace='/sok')
def sok_srv_user_visit(message):
    import urllib.parse
    visit_org_id = message['visit_org_id']
    visit_user_id = message['visit_user_id']

    # ユーザー訪問情報を更新する
    DB.session.query(t_user_info
            ).filter(
                and_(t_user_info.org_id == session.get('orgid')
                    ,t_user_info.user_id == session.get('userid')
                    ,t_user_info.target_org_id == visit_org_id
                    ,t_user_info.target_user_id == visit_user_id
                    )
            ).delete()
    info_ins = t_user_info(org_id=session.get('orgid')
                          ,user_id=session.get('userid')
                          ,target_org_id=visit_org_id
                          ,target_user_id=visit_user_id
                          ,target_voice_cnt=0
                          ,target_talk_cnt=0
                          ,target_video_cnt=0
                          )
    DB.session.add(info_ins)
    DB.session.commit()


@SOK.on('sok_srv_add_talk', namespace='/sok')
def sok_srv_add_talk(message):

    import urllib.parse
    talk           = message['talk']
    target_org_id  = message['target_org_id']
    target_user_id = message['target_user_id']

    talk = urllib.parse.unquote(talk)

    talk_ins = t_user_talk(talk=talk
                          ,send_org_id=session.get('orgid')
                          ,send_user_id=session.get('userid')
                          ,resv_org_id=target_org_id
                          ,resv_user_id=target_user_id
                          ,hide_flg=0
                          )
    DB.session.add(talk_ins)
    DB.session.commit()

    # 送信者の情報
    send_user = DB.session.query(m_user
                ).filter(
                    and_(m_user.org_id == session.get('orgid')
                        ,m_user.user_id == session.get('userid')
                        )
                ).first()

    # 同じ組織でログイン中のユーザーを指定
    rst_user_status = DB.session.query(t_user_status
                          ).filter(
                              and_(t_user_status.org_id == session.get('orgid')
                                  ,t_user_status.socket_id != None
                                  )
                          ).all()
    for r in rst_user_status:
        emit('sok_cli_add_talk'
            , {
                 'talk'          : talk
                ,'now_dtm'       : datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                ,'send_org_id'   : session.get('orgid')
                ,'send_user_id'  : session.get('userid')
                ,'send_user_nm'  : send_user.user_nm
                ,'send_user_img' : send_user.profile_img_file
                ,'resv_org_id'   : target_org_id
                ,'resv_user_id'  : target_user_id
              }
              ,room=r.socket_id
          )

    # お知らせ情報を更新
    rst_info = DB.session.query(t_user_info
            ).filter(
                and_(t_user_info.org_id == target_org_id
                    ,t_user_info.user_id == target_user_id
                    ,t_user_info.target_org_id == session.get('orgid')
                    ,t_user_info.target_user_id == session.get('userid')
                    )
            ).first()
    if rst_info is None:
        info_ins = t_user_info(org_id=target_org_id
                              ,user_id=target_user_id
                              ,target_org_id=session.get('orgid')
                              ,target_user_id=session.get('userid')
                              ,target_voice_cnt=0
                              ,target_talk_cnt=1
                              ,target_video_cnt=0
                              )
        DB.session.add(info_ins)
        DB.session.commit()
    else:
        rst_info.target_talk_cnt = rst_info.target_talk_cnt + 1
        rst_info.upd_dtm         = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        DB.session.commit()

@SOK.on('sok_srv_add_grp_talk', namespace='/sok')
def sok_srv_add_grp_talk(message):

    import urllib.parse
    grp_talk      = message['grp_talk']
    target_grp_id = message['target_grp_id']

    # サポートセンター用
    if target_grp_id == 'manyone':
        target_grp_id = session.get('orgid') + '-support-grp'

    grp_talk = urllib.parse.unquote(grp_talk)

    grp_talk_ins = t_grp_talk(grp_talk=grp_talk
                             ,grp_id=target_grp_id
                             ,org_id=session.get('orgid')
                             ,user_id=session.get('userid')
                             ,hide_flg=0
                             )
    DB.session.add(grp_talk_ins)
    DB.session.commit()

    # 送信者の情報
    send_user = DB.session.query(m_user
                ).filter(
                    and_(m_user.org_id == session.get('orgid')
                        ,m_user.user_id == session.get('userid')
                        )
                ).first()

    # 同じ組織でログイン中のユーザーを指定
    rst_user_status = DB.session.query(t_user_status
                          ).filter(
                              and_(t_user_status.org_id == session.get('orgid')
                                  ,t_user_status.socket_id != None
                                  )
                          ).all()
    for r in rst_user_status:
        emit('sok_cli_add_grp_talk'
            , {
                 'grp_talk'      : grp_talk
                ,'now_dtm'       : datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                ,'org_id'        : session.get('orgid')
                ,'user_id'       : session.get('userid')
                ,'user_nm'       : send_user.user_nm
                ,'user_img'      : send_user.profile_img_file
                ,'grp_id'        : target_grp_id
              }
              ,room=r.socket_id
          )

    # お知らせ情報を更新
    """
    rst_info = DB.session.query(t_user_info
            ).filter(
                and_(t_user_info.org_id == target_org_id
                    ,t_user_info.user_id == target_user_id
                    ,t_user_info.target_org_id == session.get('orgid')
                    ,t_user_info.target_user_id == session.get('userid')
                    )
            ).first()
    if rst_info is None:
        info_ins = t_user_info(org_id=target_org_id
                              ,user_id=target_user_id
                              ,target_org_id=session.get('orgid')
                              ,target_user_id=session.get('userid')
                              ,target_voice_cnt=0
                              ,target_talk_cnt=1
                              ,target_video_cnt=0
                              )
        DB.session.add(info_ins)
        DB.session.commit()
    else:
        rst_info.target_talk_cnt = rst_info.target_talk_cnt + 1
        rst_info.upd_dtm         = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        DB.session.commit()
    """


@SOK.on('sok_cli_admin_cost_data_get', namespace='/sok')
def sok_cli_admin_cost_data_get(message):

    sql_prev_cost = """
        select status
              ,year
              ,month
              ,cost_total
              ,cost_detail_active_user
              ,cost_detail_add_user
          from t_org_cost
         where org_id = '@LOGIN_ORG_ID@'
         order by year desc, month desc
         limit 12
    """
    sql_prev_cost = sql_prev_cost.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_prev_cost = DB.session.execute(sql_prev_cost)

    w_cost_add_user = 0
    w_count_add_user = 0
    for r in rst_prev_cost:
        w_status                  = r.status
        w_year                    = r.year
        w_month                   = r.month
        w_cost_total              = r.cost_total
        w_cost_detail_active_user = r.cost_detail_active_user
        w_cost_detail_add_user    = r.cost_detail_add_user

        emit('sok_srv_admin_cost_data_get_prev'
            , {
               'status'                  : w_status
              ,'year'                    : w_year
              ,'month'                   : w_month
              ,'cost_total'              : w_cost_total
              ,'cost_detail_add_user'    : w_cost_detail_add_user
              ,'cost_detail_active_user' : w_cost_detail_active_user
              }
            )


    # rst_last_dtm = DB.session.query(t_org_cost
    #                           ).filter(t_org_cost.org_id == session.get('orgid')
    #                           ).order_by("upd_dtm desc"
    #                           ).first()
    # if rst_last_dtm is not None:
    #     # 前回コスト計算日時～現在日時
    #     target_ymd = str(rst_last_dtm.upd_dtm)
    # else:
    #     # コスト計算が初めての場合
    #     target_ymd = '1999-01-01 00:00:00.000000'
# 
    # sql_cost_add_user = """
    #     select count(*) as count_add_user
    #           ,count(*) * @ADD_USER_COST@ as cost_add_user
    #       from t_org_add_user
    #      where add_org_id = '@LOGIN_ORG_ID@'
    #        and upd_dtm between to_timestamp('@TARGET_YMD@' ,'yyyy-mm-dd hh24:mi:ss.us')
    #                        and current_timestamp
    # """
    # sql_cost_add_user = sql_cost_add_user.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    # sql_cost_add_user = sql_cost_add_user.replace("@TARGET_YMD@",target_ymd)
    # sql_cost_add_user = sql_cost_add_user.replace("@ADD_USER_COST@",'300')
    # rst_cost_add_user = DB.session.execute(sql_cost_add_user)
# 
    # w_cost_add_user = 0
    # w_count_add_user = 0
    # for r in rst_cost_add_user:
    #     w_cost_add_user  = r.cost_add_user
    #     w_count_add_user = r.count_add_user
# 
    # sql_cost_active_user = """
    #     select count(*) as count_active_user
    #           ,count(*) * @ACTIVE_USER_COST@ as cost_active_user
    #       from m_user
    #      where org_id   = '@LOGIN_ORG_ID@'
    #        and stop_flg = 0
    # """
    # sql_cost_active_user = sql_cost_active_user.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    # sql_cost_active_user = sql_cost_active_user.replace("@ACTIVE_USER_COST@",'300')
    # rst_cost_active_user = DB.session.execute(sql_cost_active_user)
# 
    # w_cost_active_user  = 0
    # w_count_active_user = 0
    # for r in rst_cost_active_user:
    #     w_cost_active_user  = r.cost_active_user
    #     w_count_active_user = r.count_active_user
# 
    # w_cost_total = w_cost_add_user + w_cost_active_user
# 
    # emit('sok_srv_admin_cost_data_get_this'
    #     , {
    #        'cost_total'      : w_cost_total
    #       ,'cost_add_user'   : w_cost_add_user
    #       ,'count_add_user'   : w_count_add_user
    #       ,'cost_active_user': w_cost_active_user
    #       ,'count_active_user': w_count_active_user
    #       }
    #     )



@SOK.on('sok_cli_admin_all_voice_tatal_get', namespace='/sok')
def sok_cli_admin_all_voice_tatal_get(message):

    sql_all_voice_tatal = """
        select 'voice' as type
              ,date_part('year' ,voice_dtm) as year
              ,date_part('month',voice_dtm) as month
              ,count(voice)                 as count
          from t_user_voice
         where org_id  = '@LOGIN_ORG_ID@'
         group by year,month
       union all
        select 'comment' as type
              ,date_part('year' ,voice_comment_dtm) as year
              ,date_part('month',voice_comment_dtm) as month
              ,count(voice_comment)                 as count
          from t_user_voice_comment
         where org_id  = '@LOGIN_ORG_ID@'
         group by year,month
         order by year desc,month desc
         limit 6
    """
    sql_all_voice_tatal = sql_all_voice_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_voice_tatal = DB.session.execute(sql_all_voice_tatal)
    cnt = 0
    w_last_flg = 0
    for r in rst_all_voice_tatal:
        cnt += 1
        if rst_all_voice_tatal.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        w_type  = r.type
        w_year  = r.year
        w_month = r.month
        w_count = r.count

        emit('sok_srv_admin_all_voice_tatal_get'
            , {
                 'type'    : w_type
                ,'year'    : w_year
                ,'month'   : w_month
                ,'count'   : w_count
                ,'last_flg': w_last_flg
              }
            )

    sql_all_voice_cnt = """
        select count(*)      as count
          from t_user_voice
         where org_id  = '@LOGIN_ORG_ID@'
    """
    sql_all_voice_cnt = sql_all_voice_cnt.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_voice_cnt = DB.session.execute(sql_all_voice_cnt)
    for r in rst_all_voice_cnt:
        w_count  = r.count
        emit('sok_srv_admin_all_voice_cnt_get'
            , {
                 'count'    : w_count
              }
            )

    sql_all_voice_comment_cnt = """
        select count(*)      as count
          from t_user_voice_comment
         where org_id  = '@LOGIN_ORG_ID@'
    """
    sql_all_voice_comment_cnt = sql_all_voice_comment_cnt.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_voice_comment_cnt = DB.session.execute(sql_all_voice_comment_cnt)
    for r in rst_all_voice_comment_cnt:
        w_count  = r.count
        emit('sok_srv_admin_all_voice_comment_cnt_get'
            , {
                 'count'    : w_count
              }
            )


@SOK.on('sok_cli_admin_all_talk_tatal_get', namespace='/sok')
def sok_cli_admin_all_talk_tatal_get(message):

    sql_all_talk_tatal = """
        select 'send' as type
              ,date_part('year' ,talk_dtm) as year
              ,date_part('month',talk_dtm) as month
              ,count(talk)
          from t_user_talk
         where send_org_id = '@LOGIN_ORG_ID@'
         group by year,month,send_org_id
        union
        select 'resv' as type
              ,date_part('year' ,talk_dtm) as year
              ,date_part('month',talk_dtm) as month
              ,count(talk)
          from t_user_talk
         where resv_org_id = '@LOGIN_ORG_ID@'
         group by year,month,resv_org_id
        order by year desc,month desc,type
        limit 12
    """
    sql_all_talk_tatal = sql_all_talk_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_talk_tatal = DB.session.execute(sql_all_talk_tatal)
    cnt = 0
    w_last_flg = 0
    for r in rst_all_talk_tatal:
        cnt += 1
        if rst_all_talk_tatal.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        w_type  = r.type
        w_year  = r.year
        w_month = r.month
        w_count = r.count

        emit('sok_srv_admin_all_talk_tatal_get'
            , {
                 'type'    : w_type
                ,'year'    : w_year
                ,'month'   : w_month
                ,'count'   : w_count
                ,'last_flg': w_last_flg
              }
            )

    sql_all_talk_send_cnt = """
        select count(*)    as count
          from t_user_talk
         where send_org_id  = '@LOGIN_ORG_ID@'
    """
    sql_all_talk_send_cnt = sql_all_talk_send_cnt.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_talk_send_cnt = DB.session.execute(sql_all_talk_send_cnt)
    for r in rst_all_talk_send_cnt:
        w_count  = r.count
        emit('sok_srv_admin_all_talk_send_cnt_get'
            , {
                 'count'    : w_count
              }
            )

    sql_all_talk_resv_cnt = """
        select count(*)    as count
          from t_user_talk
         where resv_org_id  = '@LOGIN_ORG_ID@'
    """
    sql_all_talk_resv_cnt = sql_all_talk_resv_cnt.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_talk_resv_cnt = DB.session.execute(sql_all_talk_resv_cnt)
    for r in rst_all_talk_resv_cnt:
        w_count  = r.count
        emit('sok_srv_admin_all_talk_resv_cnt_get'
            , {
                 'count'    : w_count
              }
            )


@SOK.on('sok_cli_admin_all_video_tatal_get', namespace='/sok')
def sok_cli_admin_all_video_tatal_get(message):

    sql_all_video_time_tatal = """
         select left(cast(date_part('epoch', sum(a.dtm)) * INTERVAL '1 second' as text),strpos(cast(date_part('epoch', sum(a.dtm)) * INTERVAL '1 second' as text) ,'.') -1) as sum_dtm
          from (
            select end_dtm - start_dtm as dtm
              from t_user_video
             where call_org_id = '@LOGIN_ORG_ID@' or resv_org_id = '@LOGIN_ORG_ID@'
          ) a
    """
    sql_all_video_time_tatal = sql_all_video_time_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_video_time_tatal = DB.session.execute(sql_all_video_time_tatal)
    for r in rst_all_video_time_tatal:
      emit('sok_srv_admin_all_video_tatal_get_time'
          , {
               'sum_dtm'    : r.sum_dtm
            }
          )

    sql_all_video_cnt_tatal = """
        select 'call' as type
              ,date_part('year' ,start_dtm) as year
              ,date_part('month',start_dtm) as month
              ,count(*)
          from t_user_video
         where call_org_id = '@LOGIN_ORG_ID@'
         group by year,month,call_org_id
        union
        select 'resv' as type
              ,date_part('year' ,start_dtm) as year
              ,date_part('month',start_dtm) as month
              ,count(*)
          from t_user_video
         where resv_org_id = '@LOGIN_ORG_ID@'
         group by year,month,resv_org_id
        order by year desc,month desc,type
        limit 12
    """
    sql_all_video_cnt_tatal = sql_all_video_cnt_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_video_cnt_tatal = DB.session.execute(sql_all_video_cnt_tatal)

    cnt = 0
    w_last_flg = 0
    for r in rst_all_video_cnt_tatal:
        cnt += 1
        if rst_all_video_cnt_tatal.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        w_type  = r.type
        w_year  = r.year
        w_month = r.month
        w_count = r.count

        emit('sok_srv_admin_all_video_tatal_get_cnt'
            , {
                 'type'    : w_type
                ,'year'    : w_year
                ,'month'   : w_month
                ,'count'   : w_count
                ,'last_flg': w_last_flg
              }
            )

    sql_all_video_call_cnt_tatal = """
        select count(*)
          from t_user_video
         where call_org_id  = '@LOGIN_ORG_ID@'
         group by call_org_id,call_user_id
    """
    sql_all_video_call_cnt_tatal = sql_all_video_call_cnt_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_video_call_cnt_tatal = DB.session.execute(sql_all_video_call_cnt_tatal)

    w_call_count = 0
    for r in rst_all_video_call_cnt_tatal:
        w_call_count = r.count

    sql_all_video_resv_cnt_tatal = """
        select count(*)
          from t_user_video
         where resv_org_id  = '@LOGIN_ORG_ID@'
         group by resv_org_id,resv_user_id
    """
    sql_all_video_resv_cnt_tatal = sql_all_video_resv_cnt_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_all_video_resv_cnt_tatal = DB.session.execute(sql_all_video_resv_cnt_tatal)

    w_resv_count = 0
    for r in rst_all_video_resv_cnt_tatal:
        w_resv_count = r.count

    emit('sok_srv_admin_all_video_tatal_get_call_resv_cnt'
        , {
             'call_count'    : w_call_count
            ,'resv_count'    : w_resv_count
          }
        )


@SOK.on('sok_cli_admin_user_voice_tatal_get', namespace='/sok')
def sok_cli_admin_user_voice_tatal_get(message):

    w_org_id  = message['org_id']
    w_user_id = message['user_id']

    sql_user_voice_tatal = """
        select 'voice' as type
              ,date_part('year' ,voice_dtm) as year
              ,date_part('month',voice_dtm) as month
              ,count(voice)                 as count
          from t_user_voice
         where org_id  = '@TARGET_ORG_ID@'
           and user_id = '@TARGET_USER_ID@'
         group by year,month
       union all
        select 'comment' as type
              ,date_part('year' ,voice_comment_dtm) as year
              ,date_part('month',voice_comment_dtm) as month
              ,count(voice_comment)                 as count
          from t_user_voice_comment
         where org_id  = '@TARGET_ORG_ID@'
           and user_id = '@TARGET_USER_ID@'
         group by year,month
         order by year desc,month desc, type
         limit 6
    """
    sql_user_voice_tatal = sql_user_voice_tatal.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_voice_tatal = sql_user_voice_tatal.replace("@TARGET_USER_ID@",w_user_id)
    rst_user_voice_tatal = DB.session.execute(sql_user_voice_tatal)
    cnt = 0
    w_last_flg = 0
    for r in rst_user_voice_tatal:
        cnt += 1
        if rst_user_voice_tatal.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        w_type  = r.type
        w_year  = r.year
        w_month = r.month
        w_count = r.count

        emit('sok_srv_admin_user_voice_tatal_get'
            , {
                 'type'    : w_type
                ,'year'    : w_year
                ,'month'   : w_month
                ,'count'   : w_count
                ,'last_flg': w_last_flg
              }
            )

    sql_user_voice_cnt = """
        select count(*)      as count
          from t_user_voice
         where org_id  = '@TARGET_ORG_ID@'
           and user_id = '@TARGET_USER_ID@'
    """
    sql_user_voice_cnt = sql_user_voice_cnt.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_voice_cnt = sql_user_voice_cnt.replace("@TARGET_USER_ID@",w_user_id)
    rst_user_voice_cnt = DB.session.execute(sql_user_voice_cnt)
    for r in rst_user_voice_cnt:
        w_count  = r.count
        emit('sok_srv_admin_user_voice_cnt_get'
            , {
                 'count'    : w_count
              }
            )

    sql_user_voice_comment_cnt = """
        select count(*)      as count
          from t_user_voice_comment
         where org_id  = '@TARGET_ORG_ID@'
           and user_id = '@TARGET_USER_ID@'
    """
    sql_user_voice_comment_cnt = sql_user_voice_comment_cnt.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_voice_comment_cnt = sql_user_voice_comment_cnt.replace("@TARGET_USER_ID@",w_user_id)
    rst_user_voice_comment_cnt = DB.session.execute(sql_user_voice_comment_cnt)
    for r in rst_user_voice_comment_cnt:
        w_count  = r.count
        emit('sok_srv_admin_user_voice_comment_cnt_get'
            , {
                 'count'    : w_count
              }
            )

@SOK.on('sok_cli_admin_user_talk_tatal_get', namespace='/sok')
def sok_cli_admin_user_talk_tatal_get(message):

    w_org_id  = message['org_id']
    w_user_id = message['user_id']

    sql_user_talk_tatal = """
        select 'send' as type
              ,date_part('year' ,talk_dtm) as year
              ,date_part('month',talk_dtm) as month
              ,send_user_id as user_id
              ,count(talk)
          from t_user_talk
         where send_org_id = '@TARGET_ORG_ID@' and send_user_id = '@TARGET_USER_ID@'
         group by year,month,send_org_id,send_user_id
        union
        select 'resv' as type
              ,date_part('year' ,talk_dtm) as year
              ,date_part('month',talk_dtm) as month
              ,resv_user_id as user_id
              ,count(talk)
          from t_user_talk
         where resv_org_id = '@TARGET_ORG_ID@' and resv_user_id = '@TARGET_USER_ID@'
         group by year,month,resv_org_id,resv_user_id
        order by year desc,month desc,type
        limit 12
    """
    sql_user_talk_tatal = sql_user_talk_tatal.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_talk_tatal = sql_user_talk_tatal.replace("@TARGET_USER_ID@",w_user_id)
    rst_user_talk_tatal = DB.session.execute(sql_user_talk_tatal)
    cnt = 0
    w_last_flg = 0
    for r in rst_user_talk_tatal:
        cnt += 1
        if rst_user_talk_tatal.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        w_type  = r.type
        w_year  = r.year
        w_month = r.month
        w_count = r.count

        emit('sok_srv_admin_user_talk_tatal_get'
            , {
                 'type'    : w_type
                ,'year'    : w_year
                ,'month'   : w_month
                ,'count'   : w_count
                ,'last_flg': w_last_flg
              }
            )

    sql_user_talk_send_cnt = """
        select count(*)    as count
          from t_user_talk
         where send_org_id  = '@TARGET_ORG_ID@'
           and send_user_id = '@TARGET_USER_ID@'
    """
    sql_user_talk_send_cnt = sql_user_talk_send_cnt.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_talk_send_cnt = sql_user_talk_send_cnt.replace("@TARGET_USER_ID@" ,w_user_id)
    rst_user_talk_send_cnt = DB.session.execute(sql_user_talk_send_cnt)
    for r in rst_user_talk_send_cnt:
        w_count  = r.count
        emit('sok_srv_admin_user_talk_send_cnt_get'
            , {
                 'count'    : w_count
              }
            )

    sql_user_talk_resv_cnt = """
        select count(*)    as count
          from t_user_talk
         where resv_org_id  = '@TARGET_ORG_ID@'
           and resv_user_id = '@TARGET_USER_ID@'
    """
    sql_user_talk_resv_cnt = sql_user_talk_resv_cnt.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_talk_resv_cnt = sql_user_talk_resv_cnt.replace("@TARGET_USER_ID@",w_user_id)
    rst_user_talk_resv_cnt = DB.session.execute(sql_user_talk_resv_cnt)
    for r in rst_user_talk_resv_cnt:
        w_count  = r.count
        emit('sok_srv_admin_user_talk_resv_cnt_get'
            , {
                 'count'    : w_count
              }
            )

@SOK.on('sok_cli_admin_user_video_tatal_get', namespace='/sok')
def sok_cli_admin_user_video_tatal_get(message):

    w_org_id  = message['org_id']
    w_user_id = message['user_id']

    sql_user_video_time_tatal = """
         select left(cast(date_part('epoch', sum(a.dtm)) * INTERVAL '1 second' as text),strpos(cast(date_part('epoch', sum(a.dtm)) * INTERVAL '1 second' as text) ,'.') -1) as sum_dtm
          from (
            select end_dtm - start_dtm as dtm
              from t_user_video
             where (call_org_id = '@TARGET_ORG_ID@'  and call_user_id = '@TARGET_USER_ID@')
                or (resv_org_id = '@TARGET_ORG_ID@'  and resv_user_id = '@TARGET_USER_ID@')
          ) a
    """
    sql_user_video_time_tatal = sql_user_video_time_tatal.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_video_time_tatal = sql_user_video_time_tatal.replace("@TARGET_USER_ID@",w_user_id)
    rst_user_video_time_tatal = DB.session.execute(sql_user_video_time_tatal)
    for r in rst_user_video_time_tatal:
      emit('sok_srv_admin_user_video_tatal_get_time'
          , {
               'sum_dtm'    : r.sum_dtm
            }
          )

    sql_user_video_cnt_tatal = """
        select 'call' as type
              ,date_part('year' ,start_dtm) as year
              ,date_part('month',start_dtm) as month
              ,call_user_id as user_id
              ,count(*)
          from t_user_video
         where call_org_id = '@TARGET_ORG_ID@' and call_user_id = '@TARGET_USER_ID@'
         group by year,month,call_org_id,call_user_id
        union
        select 'resv' as type
              ,date_part('year' ,start_dtm) as year
              ,date_part('month',start_dtm) as month
              ,resv_user_id as user_id
              ,count(*)
          from t_user_video
         where resv_org_id = '@TARGET_ORG_ID@' and resv_user_id = '@TARGET_USER_ID@'
         group by year,month,resv_org_id,resv_user_id
        order by year desc,month desc,type
        limit 12
    """
    sql_user_video_cnt_tatal = sql_user_video_cnt_tatal.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_video_cnt_tatal = sql_user_video_cnt_tatal.replace("@TARGET_USER_ID@",w_user_id)
    rst_user_video_cnt_tatal = DB.session.execute(sql_user_video_cnt_tatal)

    cnt = 0
    w_last_flg = 0
    for r in rst_user_video_cnt_tatal:
        cnt += 1
        if rst_user_video_cnt_tatal.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        w_type  = r.type
        w_year  = r.year
        w_month = r.month
        w_count = r.count

        emit('sok_srv_common_user_video_tatal_get_cnt'
            , {
                 'type'    : w_type
                ,'year'    : w_year
                ,'month'   : w_month
                ,'count'   : w_count
                ,'last_flg': w_last_flg
              }
            )


    sql_user_video_call_cnt_tatal = """
        select count(*)
          from t_user_video
         where call_org_id  = '@TARGET_ORG_ID@'
           and call_user_id  = '@TARGET_USER_ID@'
         group by call_org_id,call_user_id
    """
    sql_user_video_call_cnt_tatal = sql_user_video_call_cnt_tatal.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_video_call_cnt_tatal = sql_user_video_call_cnt_tatal.replace("@TARGET_USER_ID@" ,w_user_id)
    rst_user_video_call_cnt_tatal = DB.session.execute(sql_user_video_call_cnt_tatal)

    w_call_count = 0
    for r in rst_user_video_call_cnt_tatal:
        w_call_count = r.count

    sql_user_video_resv_cnt_tatal = """
        select count(*)
          from t_user_video
         where resv_org_id  = '@TARGET_ORG_ID@'
           and resv_user_id  = '@TARGET_USER_ID@'
         group by resv_org_id,resv_user_id
    """
    sql_user_video_resv_cnt_tatal = sql_user_video_resv_cnt_tatal.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_user_video_resv_cnt_tatal = sql_user_video_resv_cnt_tatal.replace("@TARGET_USER_ID@" ,w_user_id)
    rst_user_video_resv_cnt_tatal = DB.session.execute(sql_user_video_resv_cnt_tatal)

    w_resv_count = 0
    for r in rst_user_video_resv_cnt_tatal:
        w_resv_count = r.count

    if w_call_count != 0 or w_resv_count != 0:
        emit('sok_srv_admin_user_video_tatal_get_call_resv_cnt'
            , {
                 'call_count'    : w_call_count
                ,'resv_count'    : w_resv_count
              }
            )


@SOK.on('sok_cli_common_my_voice_tatal_get', namespace='/sok')
def sok_cli_common_my_voice_tatal_get(message):

    sql_my_voice_tatal = """
        select 'voice' as type
              ,date_part('year' ,voice_dtm) as year
              ,date_part('month',voice_dtm) as month
              ,count(voice)                 as count
          from t_user_voice
         where org_id  = '@LOGIN_ORG_ID@'
           and user_id = '@LOGIN_USER_ID@'
         group by year,month
       union all
        select 'comment' as type
              ,date_part('year' ,voice_comment_dtm) as year
              ,date_part('month',voice_comment_dtm) as month
              ,count(voice_comment)                 as count
          from t_user_voice_comment
         where org_id  = '@LOGIN_ORG_ID@'
           and user_id = '@LOGIN_USER_ID@'
         group by year,month
         order by year desc,month desc, type
         limit 6
    """
    sql_my_voice_tatal = sql_my_voice_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_voice_tatal = sql_my_voice_tatal.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_voice_tatal = DB.session.execute(sql_my_voice_tatal)
    cnt = 0
    w_last_flg = 0
    for r in rst_my_voice_tatal:
        cnt += 1
        if rst_my_voice_tatal.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        w_type  = r.type
        w_year  = r.year
        w_month = r.month
        w_count = r.count

        emit('sok_srv_common_my_voice_tatal_get'
            , {
                 'type'    : w_type
                ,'year'    : w_year
                ,'month'   : w_month
                ,'count'   : w_count
                ,'last_flg': w_last_flg
              }
            )

    sql_my_voice_cnt = """
        select count(*)      as count
          from t_user_voice
         where org_id  = '@LOGIN_ORG_ID@'
           and user_id = '@LOGIN_USER_ID@'
    """
    sql_my_voice_cnt = sql_my_voice_cnt.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_voice_cnt = sql_my_voice_cnt.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_voice_cnt = DB.session.execute(sql_my_voice_cnt)
    for r in rst_my_voice_cnt:
        w_count  = r.count
        emit('sok_srv_common_my_voice_cnt_get'
            , {
                 'count'    : w_count
              }
            )

    sql_my_voice_comment_cnt = """
        select count(*)      as count
          from t_user_voice_comment
         where org_id  = '@LOGIN_ORG_ID@'
           and user_id = '@LOGIN_USER_ID@'
    """
    sql_my_voice_comment_cnt = sql_my_voice_comment_cnt.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_voice_comment_cnt = sql_my_voice_comment_cnt.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_voice_comment_cnt = DB.session.execute(sql_my_voice_comment_cnt)
    for r in rst_my_voice_comment_cnt:
        w_count  = r.count
        emit('sok_srv_common_my_voice_comment_cnt_get'
            , {
                 'count'    : w_count
              }
            )


@SOK.on('sok_cli_common_my_talk_tatal_get', namespace='/sok')
def sok_cli_common_my_talk_tatal_get(message):

    sql_my_talk_tatal = """
        select 'send' as type
              ,date_part('year' ,talk_dtm) as year
              ,date_part('month',talk_dtm) as month
              ,send_user_id as user_id
              ,count(talk)
          from t_user_talk
         where send_org_id = '@LOGIN_ORG_ID@' and send_user_id = '@LOGIN_USER_ID@'
         group by year,month,send_org_id,send_user_id
        union
        select 'resv' as type
              ,date_part('year' ,talk_dtm) as year
              ,date_part('month',talk_dtm) as month
              ,resv_user_id as user_id
              ,count(talk)
          from t_user_talk
         where resv_org_id = '@LOGIN_ORG_ID@' and resv_user_id = '@LOGIN_USER_ID@'
         group by year,month,resv_org_id,resv_user_id
        order by year desc,month desc,type
        limit 12
    """
    sql_my_talk_tatal = sql_my_talk_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_talk_tatal = sql_my_talk_tatal.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_talk_tatal = DB.session.execute(sql_my_talk_tatal)
    cnt = 0
    w_last_flg = 0
    for r in rst_my_talk_tatal:
        cnt += 1
        if rst_my_talk_tatal.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        w_type  = r.type
        w_year  = r.year
        w_month = r.month
        w_count = r.count

        emit('sok_srv_common_my_talk_tatal_get'
            , {
                 'type'    : w_type
                ,'year'    : w_year
                ,'month'   : w_month
                ,'count'   : w_count
                ,'last_flg': w_last_flg
              }
            )

    sql_my_talk_send_cnt = """
        select count(*)    as count
          from t_user_talk
         where send_org_id  = '@LOGIN_ORG_ID@'
           and send_user_id = '@LOGIN_USER_ID@'
    """
    sql_my_talk_send_cnt = sql_my_talk_send_cnt.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_talk_send_cnt = sql_my_talk_send_cnt.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_talk_send_cnt = DB.session.execute(sql_my_talk_send_cnt)
    for r in rst_my_talk_send_cnt:
        w_count  = r.count
        emit('sok_srv_common_my_talk_send_cnt_get'
            , {
                 'count'    : w_count
              }
            )

    sql_my_talk_resv_cnt = """
        select count(*)    as count
          from t_user_talk
         where resv_org_id  = '@LOGIN_ORG_ID@'
           and resv_user_id = '@LOGIN_USER_ID@'
    """
    sql_my_talk_resv_cnt = sql_my_talk_resv_cnt.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_talk_resv_cnt = sql_my_talk_resv_cnt.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_talk_resv_cnt = DB.session.execute(sql_my_talk_resv_cnt)
    for r in rst_my_talk_resv_cnt:
        w_count  = r.count
        emit('sok_srv_common_my_talk_resv_cnt_get'
            , {
                 'count'    : w_count
              }
            )

@SOK.on('sok_cli_common_my_video_tatal_get', namespace='/sok')
def sok_cli_common_my_video_tatal_get(message):

    sql_my_video_time_tatal = """
         select left(cast(date_part('epoch', sum(a.dtm)) * INTERVAL '1 second' as text),strpos(cast(date_part('epoch', sum(a.dtm)) * INTERVAL '1 second' as text) ,'.') -1) as sum_dtm
          from (
            select end_dtm - start_dtm as dtm
              from t_user_video
             where call_org_id = '@LOGIN_ORG_ID@' or resv_org_id = '@LOGIN_USER_ID@'
          ) a
    """
    sql_my_video_time_tatal = sql_my_video_time_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_video_time_tatal = sql_my_video_time_tatal.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_video_time_tatal = DB.session.execute(sql_my_video_time_tatal)
    for r in rst_my_video_time_tatal:
      emit('sok_srv_common_my_video_tatal_get_time'
          , {
               'sum_dtm'    : r.sum_dtm
            }
          )

    sql_my_video_cnt_tatal = """
        select 'call' as type
              ,date_part('year' ,start_dtm) as year
              ,date_part('month',start_dtm) as month
              ,call_user_id as user_id
              ,count(*)
          from t_user_video
         where call_org_id = '@LOGIN_ORG_ID@' and call_user_id = '@LOGIN_USER_ID@'
         group by year,month,call_org_id,call_user_id
        union
        select 'resv' as type
              ,date_part('year' ,start_dtm) as year
              ,date_part('month',start_dtm) as month
              ,resv_user_id as user_id
              ,count(*)
          from t_user_video
         where resv_org_id = '@LOGIN_ORG_ID@' and resv_user_id = '@LOGIN_USER_ID@'
         group by year,month,resv_org_id,resv_user_id
        order by year desc,month desc,type
        limit 12
    """
    sql_my_video_cnt_tatal = sql_my_video_cnt_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_video_cnt_tatal = sql_my_video_cnt_tatal.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_video_cnt_tatal = DB.session.execute(sql_my_video_cnt_tatal)

    cnt = 0
    w_last_flg = 0
    for r in rst_my_video_cnt_tatal:
        cnt += 1
        if rst_my_video_cnt_tatal.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        w_type  = r.type
        w_year  = r.year
        w_month = r.month
        w_count = r.count

        emit('sok_srv_common_my_video_tatal_get_cnt'
            , {
                 'type'    : w_type
                ,'year'    : w_year
                ,'month'   : w_month
                ,'count'   : w_count
                ,'last_flg': w_last_flg
              }
            )

    sql_my_video_call_cnt_tatal = """
        select count(*)
          from t_user_video
         where call_org_id  = '@LOGIN_ORG_ID@'
           and call_user_id = '@LOGIN_USER_ID@'
         group by call_org_id,call_user_id
    """
    sql_my_video_call_cnt_tatal = sql_my_video_call_cnt_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_video_call_cnt_tatal = sql_my_video_call_cnt_tatal.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_video_call_cnt_tatal = DB.session.execute(sql_my_video_call_cnt_tatal)

    w_call_count = 0
    for r in rst_my_video_call_cnt_tatal:
        w_call_count = r.count

    sql_my_video_resv_cnt_tatal = """
        select count(*)
          from t_user_video
         where resv_org_id  = '@LOGIN_ORG_ID@'
           and resv_user_id = '@LOGIN_USER_ID@'
         group by resv_org_id,resv_user_id
    """
    sql_my_video_resv_cnt_tatal = sql_my_video_resv_cnt_tatal.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_my_video_resv_cnt_tatal = sql_my_video_resv_cnt_tatal.replace("@LOGIN_USER_ID@",session.get('userid'))
    rst_my_video_resv_cnt_tatal = DB.session.execute(sql_my_video_resv_cnt_tatal)

    w_resv_count = 0
    for r in rst_my_video_resv_cnt_tatal:
        w_resv_count = r.count

    emit('sok_srv_common_my_video_tatal_get_call_resv_cnt'
        , {
             'call_count'    : w_call_count
            ,'resv_count'    : w_resv_count
          }
        )

@SOK.on('sok_srv_get_m_user', namespace='/sok')
def sok_srv_get_m_user(message):

    w_org_id   = message['org_id']
    w_user_id  = message['user_id']

    sql_m_user = """
        select c.org_nm
              ,a.user_nm
              ,a.profile_work
              ,a.profile_msg
              ,a.profile_img_file
          from m_user a
             , m_org c
         where a.org_id  = '@TARGET_ORG_ID@'
           and a.user_id = '@TARGET_USER_ID@'
           and a.org_id  = c.org_id
           and a.stop_flg = 0
         limit 1
    """
    sql_m_user = sql_m_user.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_m_user = sql_m_user.replace("@TARGET_USER_ID@",w_user_id)
    rst_m_user = DB.session.execute(sql_m_user)

    for r in rst_m_user:
        w_org_nm           = r.org_nm
        w_user_nm          = r.user_nm
        w_profile_work     = r.profile_work
        w_profile_msg      = r.profile_msg
        w_profile_img_file = r.profile_img_file

        emit('sok_cli_get_m_user'
            , {
                 'org_nm'       : w_org_nm
                ,'user_nm'      : w_user_nm
                ,'profile_work' : w_profile_work
                ,'profile_msg'  : w_profile_msg
                ,'profile_img_file' : w_profile_img_file
              }
            )

@SOK.on('sok_cli_admin_edit_user_get_m_user', namespace='/sok')
def sok_cli_admin_edit_user_get_m_user(message):

    w_org_id   = message['org_id']
    w_user_id  = message['user_id']

    sql_m_user = """
        select c.org_id
              ,c.org_nm
              ,a.user_id
              ,a.user_nm
              ,a.user_auth_cd
              ,a.profile_work
              ,a.profile_msg
              ,a.profile_img_file
              ,a.stop_flg
          from m_user a
             , m_org c
         where a.org_id  = '@TARGET_ORG_ID@'
           and a.user_id = '@TARGET_USER_ID@'
           and a.org_id  = c.org_id
         limit 1
    """
    sql_m_user = sql_m_user.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_m_user = sql_m_user.replace("@TARGET_USER_ID@",w_user_id)
    rst_m_user = DB.session.execute(sql_m_user)

    for r in rst_m_user:
        w_org_id           = r.org_id
        w_org_nm           = r.org_nm
        w_user_id          = r.user_id
        w_user_nm          = r.user_nm
        w_user_auth_cd     = r.user_auth_cd
        w_profile_work     = r.profile_work
        w_profile_msg      = r.profile_msg
        w_profile_img_file = r.profile_img_file
        w_stop_flg         = r.stop_flg

        emit('sok_srv_admin_edit_user_get_m_user'
            , {
                 'org_id'       : w_org_id
                ,'org_nm'       : w_org_nm
                ,'user_id'      : w_user_id
                ,'user_nm'      : w_user_nm
                ,'user_auth_cd' : w_user_auth_cd
                ,'profile_work' : w_profile_work
                ,'profile_msg'  : w_profile_msg
                ,'profile_img_file' : w_profile_img_file
                ,'stop_flg' : w_stop_flg
              }
            )


@SOK.on('sok_cli_admin_edit_grp_get_m_grp', namespace='/sok')
def sok_cli_admin_edit_grp_get_m_grp(message):

    w_grp_id   = message['grp_id']

    sql_m_grp = """
        select a.grp_id
              ,a.grp_nm
              ,a.stop_flg
          from m_grp a
         where a.grp_id  = '@TARGET_GRP_ID@'
           and a.del_flg = 0
         limit 1
    """
    sql_m_grp = sql_m_grp.replace("@TARGET_GRP_ID@",w_grp_id)
    rst_m_grp = DB.session.execute(sql_m_grp)

    for r in rst_m_grp:
        w_grp_id           = r.grp_id
        w_grp_nm           = r.grp_nm
        w_stop_flg         = r.stop_flg

        emit('sok_srv_admin_edit_grp_get_m_grp'
            , {
                 'grp_id'       : w_grp_id
                ,'grp_nm'       : w_grp_nm
                ,'stop_flg'     : w_stop_flg
              }
            )

@SOK.on('sok_cli_admin_edit_grp_user_get_m_grp', namespace='/sok')
def sok_cli_admin_edit_grp_user_get_m_grp(message):

    w_grp_id   = message['grp_id']

    sql_m_grp = """
        select a.grp_id
              ,a.grp_nm
          from m_grp a
         where a.grp_id  = '@TARGET_GRP_ID@'
           and a.stop_flg = 0
           and a.del_flg = 0
         limit 1
    """
    sql_m_grp = sql_m_grp.replace("@TARGET_GRP_ID@",w_grp_id)
    rst_m_grp = DB.session.execute(sql_m_grp)

    for r in rst_m_grp:
        w_grp_id           = r.grp_id
        w_grp_nm           = r.grp_nm

        emit('sok_srv_admin_edit_grp_user_get_m_grp'
            , {
                 'grp_id'       : w_grp_id
                ,'grp_nm'       : w_grp_nm
              }
            )



@SOK.on('sok_cli_admin_edit_grp_user_get_m_user_member', namespace='/sok')
def sok_cli_admin_edit_grp_user_get_m_user_member(message):

    w_grp_id   = message['grp_id']

    sql_m_grp = """
        select b.user_id
              ,(select z.user_nm from m_user z where z.user_id = b.user_id) as user_nm
          from m_grp a
              ,m_grp_user b
         where a.grp_id = b.grp_id
           and a.grp_id = '@TARGET_GRP_ID@'
           and a.stop_flg = 0
           and a.del_flg = 0
           and b.stop_flg = 0
           and b.del_flg = 0
         order by b.user_id
    """
    sql_m_grp = sql_m_grp.replace("@TARGET_GRP_ID@" ,w_grp_id)
    rst_m_grp = DB.session.execute(sql_m_grp)

    cnt = 0
    w_last_flg = 0
    for r in rst_m_grp:
        cnt += 1
        if rst_m_grp.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_srv_admin_edit_grp_user_get_m_user_member'
            , {
                 'user_id'      : r.user_id
                ,'user_nm'      : r.user_nm
                ,'last_flg'     : w_last_flg
              }
            )

@SOK.on('sok_cli_admin_edit_grp_user_get_m_user', namespace='/sok')
def sok_cli_admin_edit_grp_user_get_m_user(message):

    w_org_id   = message['org_id']
    w_user_id  = message['user_id']

    sql_m_user = """
        select a.user_id
              ,a.user_nm
          from m_user a
         where a.org_id  = '@TARGET_ORG_ID@'
           and a.user_id = '@TARGET_USER_ID@'
           and a.stop_flg = 0
           and a.del_flg = 0
         limit 1
    """
    sql_m_user = sql_m_user.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_m_user = sql_m_user.replace("@TARGET_USER_ID@",w_user_id)
    rst_m_user = DB.session.execute(sql_m_user)

    for r in rst_m_user:
        w_user_id          = r.user_id
        w_user_nm          = r.user_nm

        emit('sok_srv_admin_edit_grp_user_get_m_user'
            , {
                 'user_id'      : w_user_id
                ,'user_nm'      : w_user_nm
              }
            )


@SOK.on('sok_cli_admin_del_user_get_m_user', namespace='/sok')
def sok_cli_admin_del_user_get_m_user(message):

    w_org_id   = message['org_id']
    w_user_id  = message['user_id']

    sql_m_user = """
        select c.org_id
              ,c.org_nm
              ,a.user_id
              ,a.user_nm
              ,a.profile_work
              ,a.profile_msg
              ,a.profile_img_file
              ,a.stop_flg
          from m_user a
             , m_org c
         where a.org_id  = '@TARGET_ORG_ID@'
           and a.user_id = '@TARGET_USER_ID@'
           and a.org_id  = c.org_id
           and a.stop_flg = 0
         limit 1
    """
    sql_m_user = sql_m_user.replace("@TARGET_ORG_ID@" ,w_org_id)
    sql_m_user = sql_m_user.replace("@TARGET_USER_ID@",w_user_id)
    rst_m_user = DB.session.execute(sql_m_user)

    for r in rst_m_user:
        w_org_id           = r.org_id
        w_org_nm           = r.org_nm
        w_user_id          = r.user_id
        w_user_nm          = r.user_nm
        w_profile_work     = r.profile_work
        w_profile_msg      = r.profile_msg
        w_profile_img_file = r.profile_img_file
        w_stop_flg         = r.stop_flg

        emit('sok_srv_admin_del_user_get_m_user'
            , {
                 'org_id'       : w_org_id
                ,'org_nm'       : w_org_nm
                ,'user_id'      : w_user_id
                ,'user_nm'      : w_user_nm
                ,'profile_work' : w_profile_work
                ,'profile_msg'  : w_profile_msg
                ,'profile_img_file' : w_profile_img_file
                ,'stop_flg' : w_stop_flg
              }
            )


@SOK.on('sok_cli_admin_user_add', namespace='/sok')
def sok_cli_admin_user_add(message):
    w_user_id   = message['user_id']
    w_user_nm   = message['user_nm']
    w_user_img  = message['user_img']
    w_auth_cd   = message['auth_cd']
    w_user_work = message['user_work']

    import urllib.parse
    w_user_id   = urllib.parse.unquote(w_user_id)
    w_user_nm   = urllib.parse.unquote(w_user_nm)
    w_user_img  = urllib.parse.unquote(w_user_img)
    w_auth_cd   = urllib.parse.unquote(w_auth_cd)
    w_user_work = urllib.parse.unquote(w_user_work)

    try:
        user_ins = m_user(org_id=session.get('orgid')
                         ,user_id=w_user_id
                         ,user_nm=w_user_nm
                         ,user_auth_cd=w_auth_cd
                         ,profile_work=w_user_work
                         ,profile_img_file=w_user_img
                         ,stop_flg=0
                         ,del_flg=0
                         ,upd_org_id=session.get('orgid')
                         ,upd_user_id=session.get('userid')
                         )
        DB.session.add(user_ins)
        # 課金
        org_add_user_ins = t_org_add_user(add_org_id=session.get('orgid')
                                         ,add_user_id=w_user_id
                                         ,upd_org_id=session.get('orgid')
                                         ,upd_user_id=session.get('userid')
                                         )
        DB.session.add(org_add_user_ins)
        DB.session.commit()
        emit('sok_srv_admin_user_add'
           ,{
               'result'   : "success"
              ,'msg'      : ""
            }
        )
    except:
        emit('sok_srv_admin_user_add'
           ,{
               'result'   : "error"
              ,'msg'      : ""
            }
        )

    # カウント情報
    rst_user = DB.session.query(m_user
                ).filter(m_user.org_id == session.get('orgid')
                ).all()
    for r in rst_user:
        info_ins = t_user_info(org_id=session.get('orgid')
                              ,user_id=w_user_id
                              ,target_org_id=r.org_id
                              ,target_user_id=r.user_id
                              ,target_voice_cnt=0
                              ,target_talk_cnt=0
                              ,target_video_cnt=0
                              )
        DB.session.add(info_ins)
        DB.session.commit()

        info_ins2 = t_user_info(org_id=r.org_id
                               ,user_id=r.user_id
                               ,target_org_id=session.get('orgid')
                               ,target_user_id=w_user_id
                               ,target_voice_cnt=0
                               ,target_talk_cnt=0
                               ,target_video_cnt=0
                               )
        DB.session.add(info_ins2)
        DB.session.commit()

@SOK.on('sok_cli_admin_user_upd_chk', namespace='/sok')
def sok_cli_admin_user_upd_chk(message):
    import urllib.parse
    org_id     = message['org_id']
    user_id    = message['user_id']
    user      = DB.session.query(m_user
                ).filter(
                    and_(m_user.org_id == org_id
                        ,m_user.user_id == user_id
                        )
                ).first()
    if user is not None:
        w_exist_flg = 1
        w_user_id   = user.user_id
        w_user_nm   = user.user_nm

    else:
        w_exist_flg = 0
        w_user_id   = ""
        w_user_nm   = ""

    emit('sok_srv_admin_user_upd_chk'
       ,{
           'exist_flg'   : w_exist_flg
          ,'user_id'   : w_user_id
          ,'user_nm'   : w_user_nm
        }
    )

@SOK.on('sok_cli_admin_grp_upd_chk', namespace='/sok')
def sok_cli_admin_grp_upd_chk(message):
    import urllib.parse
    grp_id     = message['grp_id']
    grp      = DB.session.query(m_grp
                ).filter(m_grp.grp_id == grp_id
                ).first()

    w_upd_flg = 0
    if grp is not None:
        w_exist_flg = 1
        w_grp_id   = grp.grp_id
        w_grp_nm   = grp.grp_nm

        upd_chk_grp = DB.session.query(m_grp
                                ).filter(
                                    and_(m_grp.grp_id == grp_id
                                        ,m_grp.upd_org_id == session.get('orgid')
                                        )
                                ).first()
        if upd_chk_grp is not None:
            w_upd_flg = 1
        else:
            w_upd_flg = 0
    else:
        w_exist_flg = 0
        w_upd_flg   = 1
        w_grp_id   = ""
        w_grp_nm   = ""

    emit('sok_srv_admin_grp_upd_chk'
       ,{
           'exist_flg'   : w_exist_flg
          ,'upd_flg'   : w_upd_flg
          ,'grp_id'   : w_grp_id
          ,'grp_nm'   : w_grp_nm
        }
    )

@SOK.on('sok_cli_admin_user_upd', namespace='/sok')
def sok_cli_admin_user_upd(message):
    import urllib.parse
    w_org_id     = message['org_id']
    w_user_id    = message['user_id']
    w_user_nm    = message['user_nm']
    w_user_work  = message['user_work']
    w_auth_cd    = message['auth_cd']
    w_user_img   = message['user_img']
    w_user_msg   = message['user_msg']
    w_stop_flg   = message['stop_flg']

    w_user_nm   = urllib.parse.unquote(w_user_nm)
    w_user_work = urllib.parse.unquote(w_user_work)
    if not w_user_work:
        w_user_work = None
    w_user_msg = urllib.parse.unquote(w_user_msg)
    if not w_user_msg:
        w_user_msg = None

    try:
        user      = DB.session.query(m_user
                    ).filter(
                        and_(m_user.org_id == w_org_id
                            ,m_user.user_id == w_user_id
                            )
                    ).first()
        # 更新
        if user is not None:
            user.user_nm          = w_user_nm
            user.user_auth_cd     = w_auth_cd
            user.profile_work     = w_user_work
            user.profile_msg      = w_user_msg
            user.profile_img_file = w_user_img
            user.stop_flg         = w_stop_flg
            user.upd_org_id       = session.get('orgid')
            user.upd_user_id      = session.get('userid')
            user.upd_dtm          = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            DB.session.commit()
            emit('sok_srv_admin_user_upd'
               ,{
                   'result'   : "success"
                  ,'msg'      : "更新"
                }
            )
        # 新規追加
        else :
            user_ins = m_user(org_id=session.get('orgid')
                             ,user_id=w_user_id
                             ,user_nm=w_user_nm
                             ,user_auth_cd=w_auth_cd
                             ,profile_work=w_user_work
                             ,profile_img_file=w_user_img
                             ,profile_msg=w_user_msg
                             ,stop_flg=0
                             ,del_flg=0
                             ,upd_org_id=session.get('orgid')
                             ,upd_user_id=session.get('userid')
                             )
            DB.session.add(user_ins)
            # 課金
            org_add_user_ins = t_org_add_user(add_org_id=session.get('orgid')
                                             ,add_user_id=w_user_id
                                             ,upd_org_id=session.get('orgid')
                                             ,upd_user_id=session.get('userid')
                                             )
            DB.session.add(org_add_user_ins)
            DB.session.commit()
            emit('sok_srv_admin_user_upd'
               ,{
                   'result'   : "success"
                  ,'msg'      : "新規追加"
                }
            )
    except:
        emit('sok_srv_admin_user_upd'
           ,{
               'result'   : "error"
              ,'msg'      : ""
            }
        )

    # try catch で失敗メッセージとばす


@SOK.on('sok_cli_admin_grp_upd', namespace='/sok')
def sok_cli_admin_grp_upd(message):
    import urllib.parse
    w_grp_id   = message['grp_id']
    w_grp_nm   = message['grp_nm']
    w_grp_img  = message['grp_img']
    w_stop_flg = message['stop_flg']
    w_grp_nm   = urllib.parse.unquote(w_grp_nm)

    try:
        grp      = DB.session.query(m_grp
                    ).filter(
                        and_(m_grp.upd_org_id == session.get('orgid')
                            ,m_grp.grp_id == w_grp_id
                            )
                    ).first()
        # 更新
        if grp is not None:
            grp.grp_nm           = w_grp_nm
            grp.profile_img_file = w_grp_img
            grp.stop_flg         = w_stop_flg
            grp.upd_org_id       = session.get('orgid')
            grp.upd_user_id      = session.get('userid')
            grp.upd_dtm          = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            DB.session.commit()
            emit('sok_srv_admin_grp_upd'
               ,{
                   'result'   : "success"
                  ,'msg'      : "更新"
                }
            )
        # 新規追加
        else :
            grp_ins = m_grp(grp_id=w_grp_id
                           ,grp_nm=w_grp_nm
                           ,profile_img_file=w_grp_img
                           ,stop_flg=0
                           ,del_flg=0
                           ,upd_org_id=session.get('orgid')
                           ,upd_user_id=session.get('userid')
                           )
            DB.session.add(grp_ins)
            # 課金
            """
            org_add_grp_ins = t_org_add_grp(add_org_id=session.get('orgid')
                                             ,add_grp_id=w_user_id
                                             ,upd_org_id=session.get('orgid')
                                             ,upd_user_id=session.get('userid')
                                             )
            DB.session.add(org_add_grp_ins)
            """
            DB.session.commit()
            emit('sok_srv_admin_grp_upd'
               ,{
                   'result'   : "success"
                  ,'msg'      : "新規追加"
                }
            )
    except:
        emit('sok_srv_admin_grp_upd'
           ,{
               'result'   : "error"
              ,'msg'      : ""
            }
        )


@SOK.on('sok_cli_admin_grp_member_add', namespace='/sok')
def sok_cli_admin_grp_member_add(message):
    import urllib.parse
    w_grp_id   = message['grp_id']
    w_user_id   = message['user_id']

    grp      = DB.session.query(m_grp_user
                ).filter(
                    and_(m_grp_user.grp_id == w_grp_id
                        ,m_grp_user.org_id == session.get('orgid')
                        ,m_grp_user.user_id == w_user_id
                        )
                ).first()
    # 追加済みの場合は何もしない
    if grp is not None:
        grp.stop_flg         = 0
        grp.upd_org_id       = session.get('orgid')
        grp.upd_user_id      = session.get('userid')
        grp.upd_dtm          = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        DB.session.commit()
        emit('sok_srv_admin_grp_member_add'
           ,{
               'result'   : "success"
              ,'msg'      : "更新"
              ,'grp_id'   : w_grp_id
            }
        )
    # 新規追加
    else :
        grp_ins = m_grp_user(grp_id=w_grp_id
                            ,org_id=session.get('orgid')
                            ,user_id=w_user_id
                            ,stop_flg=0
                            ,del_flg=0
                            ,upd_org_id=session.get('orgid')
                            ,upd_user_id=session.get('userid')
                            )
        DB.session.add(grp_ins)
        DB.session.commit()
        emit('sok_srv_admin_grp_member_add'
           ,{
               'result'   : "success"
              ,'msg'      : "追加"
              ,'grp_id'   : w_grp_id
            }
        )


@SOK.on('sok_cli_admin_grp_member_del', namespace='/sok')
def sok_cli_admin_grp_member_del(message):
    import urllib.parse
    w_grp_id   = message['grp_id']
    w_user_id   = message['user_id']

    grp      = DB.session.query(m_grp_user
                ).filter(
                    and_(m_grp_user.grp_id == w_grp_id
                        ,m_grp_user.org_id == session.get('orgid')
                        ,m_grp_user.user_id == w_user_id
                        )
                ).first()
    # 追加済みの場合は何もしない
    if grp is not None:
        grp.stop_flg         = 1
        grp.upd_org_id       = session.get('orgid')
        grp.upd_user_id      = session.get('userid')
        grp.upd_dtm          = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        DB.session.commit()
        emit('sok_srv_admin_grp_member_del'
           ,{
               'result'   : "success"
              ,'msg'      : "削除"
              ,'grp_id'   : w_grp_id
            }
        )
    # 存在しない場合は何もしない
    else :
        pass



@SOK.on('sok_cli_common_user_profile_upd', namespace='/sok')
def sok_cli_common_user_profile_upd(message):
    import urllib.parse
    user_img = message['user_img']
    user_msg = message['user_msg']

    user_img = urllib.parse.unquote(user_img)
    user_msg = urllib.parse.unquote(user_msg)

    try:
        user      = DB.session.query(m_user
                    ).filter(
                        and_(m_user.org_id == session.get('orgid')
                            ,m_user.user_id == session.get('userid')
                            )
                    ).first()
        user.profile_msg      = user_msg
        user.profile_img_file = user_img
        user.upd_org_id   = session.get('orgid')
        user.upd_user_id  = session.get('userid')
        user.upd_dtm      = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        DB.session.commit()
        emit('sok_srv_common_user_profile_upd'
           ,{
               'result'   : "success"
              ,'msg'      : ""
            }
        )
    except:
        emit('sok_srv_common_user_profile_upd'
           ,{
               'result'   : "error"
              ,'msg'      : ""
            }
        )

@SOK.on('sok_cli_common_user_password_upd', namespace='/sok')
def sok_cli_common_user_password_upd(message):
    import urllib.parse
    before_password = message['before_password']
    after_password  = message['after_password']

    before_password = urllib.parse.unquote(before_password)
    after_password  = urllib.parse.unquote(after_password)

    user      = DB.session.query(m_user
                ).filter(
                    and_(m_user.org_id == session.get('orgid')
                        ,m_user.user_id == session.get('userid')
                        )
                ).first()


    import bcrypt
    salt                     = bcrypt.gensalt(rounds=10, prefix=b'2a')
    w_before_byte_password   = before_password.encode('utf-8')

    if bcrypt.checkpw(w_before_byte_password, user.user_pass_bcrypt) == True:
        try:
            w_after_byte_password   = after_password.encode('utf-8')
            w_after_bcrypt_password = bcrypt.hashpw(w_after_byte_password, salt)
            user.user_pass_bcrypt   = w_after_bcrypt_password
            DB.session.commit()
            emit('sok_srv_common_user_password_upd'
               ,{
                   'result'   : "success"
                  ,'msg'      : ""
                }
            )
        except:
            emit('sok_srv_common_user_password_upd'
               ,{
                   'result'   : "error"
                  ,'msg'      : ""
                }
            )
    else:
        emit('sok_srv_common_user_password_upd'
           ,{
               'result'   : "error"
              ,'msg'      : "変更前のパスワードが異なります"
            }
        )



@SOK.on('sok_srv_get_my_talk', namespace='/sok')
def sok_srv_get_my_talk(message):
    import urllib.parse
    w_text = message['text']
    w_text = urllib.parse.unquote(w_text)

    sql_talk = """
        select talk_id
              ,talk_dtm
              ,talk
              ,(select user_nm from m_user where user_id = a.send_user_id) as send_user_nm
              ,(select user_nm from m_user where user_id = a.resv_user_id) as resv_user_nm
          from t_user_talk a
         where (
                 (send_org_id = '@LOGIN_ORG_ID@' and send_user_id = '@LOGIN_USER_ID@')
                  or
                 (resv_org_id = '@LOGIN_ORG_ID@' and resv_user_id = '@LOGIN_USER_ID@')
               )
          and talk like '%@TEXT@%'
         order by talk_id desc
        limit 200
    """
    sql_talk = sql_talk.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_talk = sql_talk.replace("@LOGIN_USER_ID@",session.get('userid'))
    sql_talk = sql_talk.replace("@TEXT@",w_text)
    rst_talk = DB.session.execute(sql_talk)

    cnt = 0
    w_last_flg = 0
    for r in rst_talk:
        cnt += 1
        if rst_talk.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_cli_get_my_talk'
            , {
                 'talk_id'  : r.talk_id
                ,'talk_dtm' : r.talk_dtm.strftime("%Y/%m/%d %H:%M:%S")
                ,'talk'     : r.talk
                ,'send_user_nm' : r.send_user_nm
                ,'resv_user_nm' : r.resv_user_nm
                ,'last_flg'     : w_last_flg
              }
            )

@SOK.on('sok_srv_get_my_grp_talk', namespace='/sok')
def sok_srv_get_my_grp_talk(message):
    import urllib.parse
    w_text = message['text']
    w_text = urllib.parse.unquote(w_text)

    sql_talk = """
        select grp_talk_id
              ,grp_talk_dtm
              ,grp_talk
              ,(select grp_nm from m_grp where grp_id = a.grp_id) as grp_nm
          from t_grp_talk a
         where org_id  = '@LOGIN_ORG_ID@'
           and user_id = '@LOGIN_USER_ID@'
           and grp_talk like '%@TEXT@%'
         order by grp_talk_id desc
        limit 200
    """
    sql_talk = sql_talk.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_talk = sql_talk.replace("@LOGIN_USER_ID@",session.get('userid'))
    sql_talk = sql_talk.replace("@TEXT@",w_text)
    rst_talk = DB.session.execute(sql_talk)

    cnt = 0
    w_last_flg = 0
    for r in rst_talk:
        cnt += 1
        if rst_talk.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_cli_get_my_grp_talk'
            , {
                 'grp_talk_id'  : r.grp_talk_id
                ,'grp_talk_dtm' : r.grp_talk_dtm.strftime("%Y/%m/%d %H:%M:%S")
                ,'grp_talk'     : r.grp_talk
                ,'grp_nm'       : r.grp_nm
                ,'last_flg'     : w_last_flg
              }
            )

@SOK.on('sok_srv_get_admin_grp_talk', namespace='/sok')
def sok_srv_get_admin_grp_talk(message):
    import urllib.parse
    w_text = message['text']
    w_text = urllib.parse.unquote(w_text)

    sql_talk = """
        select grp_talk_id
              ,grp_talk_dtm
              ,grp_talk
              ,(select grp_nm from m_grp where grp_id = a.grp_id) as grp_nm
              ,hide_flg
              ,(select user_nm from m_user z where z.org_id = a.hide_org_id and z.user_id = a.hide_user_id) as hide_user_nm
          from t_grp_talk a
         where org_id  = '@LOGIN_ORG_ID@'
           and grp_talk like '%@TEXT@%'
         order by grp_talk_id
        limit 200
    """
    sql_talk = sql_talk.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_talk = sql_talk.replace("@TEXT@",w_text)
    rst_talk = DB.session.execute(sql_talk)

    cnt = 0
    w_last_flg = 0
    for r in rst_talk:
        cnt += 1
        if rst_talk.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_cli_get_admin_grp_talk'
            , {
                 'grp_talk_id'  : r.grp_talk_id
                ,'grp_talk_dtm' : r.grp_talk_dtm.strftime("%Y/%m/%d %H:%M:%S")
                ,'grp_talk'     : r.grp_talk
                ,'hide_user_nm' : r.hide_user_nm
                ,'hide_flg'     : r.hide_flg
                ,'last_flg'     : w_last_flg
              }
            )

@SOK.on('sok_srv_get_admin_voice_comment', namespace='/sok')
def sok_srv_get_admin_voice_comment(message):
    import urllib.parse
    w_text = message['text']
    w_text = urllib.parse.unquote(w_text)

    sql_comment = """
        select voice_id
              ,org_id
              ,user_id
              ,voice_comment_dtm
              ,voice_comment
              ,hide_flg
              ,(select user_nm from m_user z where z.org_id = a.hide_org_id and z.user_id = a.hide_user_id) as hide_user_nm
          from t_user_voice_comment a
         where org_id  = '@LOGIN_ORG_ID@'
           and voice_comment like '%@TEXT@%'
         order by voice_id,voice_comment_dtm
        limit 200
    """
    sql_comment = sql_comment.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_comment = sql_comment.replace("@TEXT@",w_text)
    rst_comment = DB.session.execute(sql_comment)

    cnt = 0
    w_last_flg = 0
    for r in rst_comment:
        cnt += 1
        if rst_comment.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_cli_get_admin_voice_comment'
            , {
                 'voice_id'  : r.voice_id
                ,'org_id'  : r.org_id
                ,'user_id'  : r.user_id
                ,'voice_comment_dtm' : r.voice_comment_dtm.strftime("%Y/%m/%d %H:%M:%S")
                ,'voice_comment'     : r.voice_comment
                ,'hide_user_nm' : r.hide_user_nm
                ,'hide_flg'     : r.hide_flg
                ,'last_flg'     : w_last_flg
              }
            )

@SOK.on('sok_srv_get_my_voice', namespace='/sok')
def sok_srv_get_my_voice(message):
    import urllib.parse
    w_text = message['text']
    w_text = urllib.parse.unquote(w_text)

    sql_voice = """
        select voice_id
              ,(select user_nm from m_user where user_id = a.user_id) as user_nm
              ,voice
              ,voice_dtm
          from t_user_voice a
         where org_id  = '@LOGIN_ORG_ID@'
           and user_id = '@LOGIN_USER_ID@'
           and voice like '%@TEXT@%'
         order by voice_id desc
        limit 200
    """
    sql_voice = sql_voice.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_voice = sql_voice.replace("@LOGIN_USER_ID@",session.get('userid'))
    sql_voice = sql_voice.replace("@TEXT@",w_text)
    rst_voice = DB.session.execute(sql_voice)

    cnt = 0
    w_last_flg = 0
    for r in rst_voice:
        cnt += 1
        if rst_voice.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_cli_get_my_voice'
            , {
                 'voice_id'  : r.voice_id
                ,'voice_dtm' : r.voice_dtm.strftime("%Y/%m/%d %H:%M:%S")
                ,'voice'     : r.voice
                ,'user_nm'   : r.user_nm
                ,'last_flg'  : w_last_flg
              }
            )


@SOK.on('sok_srv_get_my_voice_comment', namespace='/sok')
def sok_srv_get_my_voice_comment(message):
    import urllib.parse
    w_text = message['text']
    w_text = urllib.parse.unquote(w_text)

    sql_voice = """
        select a.voice_id
              ,voice_comment
              ,voice_comment_dtm
              ,(select user_nm from m_user where user_id = b.user_id) as user_nm
          from t_user_voice_comment a
              ,t_user_voice b
         where a.org_id  = '@LOGIN_ORG_ID@'
           and a.user_id = '@LOGIN_USER_ID@'
           and a.voice_comment like '%@TEXT@%'
           and a.voice_id = b.voice_id
         order by a.voice_id desc
        limit 200
    """
    sql_voice = sql_voice.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_voice = sql_voice.replace("@LOGIN_USER_ID@",session.get('userid'))
    sql_voice = sql_voice.replace("@TEXT@",w_text)
    rst_voice = DB.session.execute(sql_voice)

    cnt = 0
    w_last_flg = 0
    for r in rst_voice:
        cnt += 1
        if rst_voice.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_cli_get_my_voice_comment'
            , {
                 'voice_id'          : r.voice_id
                ,'voice_comment_dtm' : r.voice_comment_dtm.strftime("%Y/%m/%d %H:%M:%S")
                ,'voice_comment'     : r.voice_comment
                ,'user_nm'           : r.user_nm
                ,'last_flg'          : w_last_flg
              }
            )


@SOK.on('sok_cli_index_video_set_my_peer_id', namespace='/sok')
def sok_cli_index_video_set_my_peer_id(message):
    w_peer_id = message['peer_id']

    user_status      = DB.session.query(t_user_status
                        ).filter(
                            and_(t_user_status.org_id == session.get('orgid')
                                ,t_user_status.user_id == session.get('userid')
                                )
                        ).first()
    user_status.peer_id  = w_peer_id
    DB.session.commit()


@SOK.on('sok_cli_index_video_get_target_peer_id', namespace='/sok')
def sok_cli_index_video_get_target_peer_id(message):
    w_org_id  = message['org_id']
    w_user_id = message['user_id']

    user_status      = DB.session.query(t_user_status
                        ).filter(
                            and_(t_user_status.org_id == w_org_id
                                ,t_user_status.user_id == w_user_id
                                )
                        ).first()
    user             = DB.session.query(m_user
                        ).filter(
                            and_(m_user.org_id  == w_org_id
                                ,m_user.user_id == w_user_id
                                )
                        ).first()

    emit('sok_srv_index_video_get_target_peer_id'
        , {
             'peer_id'  : user_status.peer_id
            ,'org_id'   : user.org_id
            ,'user_id'  : user.user_id
            ,'user_nm'  : user.user_nm
          }
        )

@SOK.on('sok_cli_index_sendfile_get_target_peer_id', namespace='/sok')
def sok_cli_index_sendfile_get_target_peer_id(message):
    w_org_id  = message['org_id']
    w_user_id = message['user_id']

    user_status      = DB.session.query(t_user_status
                        ).filter(
                            and_(t_user_status.org_id == w_org_id
                                ,t_user_status.user_id == w_user_id
                                )
                        ).first()
    user             = DB.session.query(m_user
                        ).filter(
                            and_(m_user.org_id  == w_org_id
                                ,m_user.user_id == w_user_id
                                )
                        ).first()

    emit('sok_srv_index_sendfile_get_target_peer_id'
        , {
             'peer_id'  : user_status.peer_id
            ,'org_id'   : user.org_id
            ,'user_id'  : user.user_id
            ,'user_nm'  : user.user_nm
          }
        )

@SOK.on('sok_cli_index_video_get_target_user', namespace='/sok')
def sok_cli_index_video_get_target_user(message):
    w_peer_id = message['peer_id']

    rst_user_status = DB.session.query(t_user_status
                        ).filter(t_user_status.peer_id == w_peer_id
                        ).first()

    rst_m_user = DB.session.query(m_user
                        ).filter(
                            and_(m_user.org_id == rst_user_status.org_id
                                ,m_user.user_id == rst_user_status.user_id
                                )
                        ).first()

    sql_media_type = """
        select call_type
          from t_user_video a
         where call_org_id  = '@CALL_ORG_ID@'
           and call_user_id = '@CALL_USER_ID@'
           and status  = 'CALL'
         order by video_id desc
        limit 1
    """
    sql_media_type = sql_media_type.replace("@CALL_ORG_ID@" ,rst_m_user.org_id)
    sql_media_type = sql_media_type.replace("@CALL_USER_ID@" ,rst_m_user.user_id)
    rst_media_type = DB.session.execute(sql_media_type)
    w_call_type = ""
    for r in rst_media_type:
      w_call_type = r.call_type

    emit('sok_srv_index_video_get_target_user'
        , {
             'org_id'           : rst_m_user.org_id
            ,'user_id'          : rst_m_user.user_id
            ,'user_nm'          : rst_m_user.user_nm
            ,'profile_img_file' : rst_m_user.profile_img_file
            ,'call_type'        : w_call_type
          }
        )

@SOK.on('sok_cli_index_video_call_resver_cancel', namespace='/sok')
def sok_cli_index_video_call_resver_cancel(message):
    w_org_id  = message['org_id']
    w_user_id = message['user_id']

    # 相手のsocketidを取得
    rst_user_status = DB.session.query(t_user_status
                          ).filter(
                              and_(t_user_status.org_id == w_org_id
                                  ,t_user_status.user_id == w_user_id
                                  )
                          ).first()
    if rst_user_status is not None:
        # 通知する
        emit('sok_srv_index_video_call_resver_cancel'
            , {
                 'msg'        : '拒否されました'
              }
            ,room=rst_user_status.socket_id
            )


@SOK.on('sok_cli_index_video_call_caller_cancel', namespace='/sok')
def sok_cli_index_video_call_caller_cancel(message):
    w_org_id  = message['org_id']
    w_user_id = message['user_id']

    # 不在着信登録
    talk_ins = t_user_talk(talk='ビデオ通話着信: '+datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                          ,send_org_id=session.get('orgid')
                          ,send_user_id=session.get('userid')
                          ,resv_org_id=w_org_id
                          ,resv_user_id=w_user_id
                          ,hide_flg=0
                          )
    DB.session.add(talk_ins)
    DB.session.commit()

    # お知らせ情報を更新
    rst_info = DB.session.query(t_user_info
                          ).filter(
                              and_(t_user_info.org_id == w_org_id
                                  ,t_user_info.user_id == w_user_id
                                  ,t_user_info.target_org_id ==  session.get('orgid')
                                  ,t_user_info.target_user_id == session.get('userid')
                                  )
                          ).first()
    rst_info.target_talk_cnt  = rst_info.target_talk_cnt + 1
    rst_info.target_video_cnt  = rst_info.target_video_cnt + 1
    rst_info.upd_dtm           = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()

    # 相手のsocketidを取得
    rst_user_status = DB.session.query(t_user_status
                          ).filter(
                              and_(t_user_status.org_id == w_org_id
                                  ,t_user_status.user_id == w_user_id
                                  )
                          ).first()


    if rst_user_status is not None:
        # 通知する
        emit('sok_srv_index_video_call_caller_cancel'
            , {
                 'org_id'     : session.get('orgid')
                ,'user_id'    : session.get('userid')
              }
            ,room=rst_user_status.socket_id
            )



@SOK.on('sok_cli_index_video_call_ini', namespace='/sok')
def sok_cli_index_video_call_ini(message):
    w_org_id    = message['resv_org_id']
    w_user_id   = message['resv_user_id']
    w_call_type = message['call_type']
    # 新規レコード作成
    # ステータスはCALL
    # クライアントにシーケンスを伝える
    video_ins = t_user_video(call_org_id=session.get('orgid')
                            ,call_user_id=session.get('userid')
                            ,resv_org_id=w_org_id
                            ,resv_user_id=w_user_id
                            ,call_type=w_call_type
                            ,status="CALL"
                            )
    DB.session.add(video_ins)
    DB.session.commit()


@SOK.on('sok_cli_index_video_call_start', namespace='/sok')
def sok_cli_index_video_call_start(message):
    w_org_id    = message['call_org_id']
    w_user_id   = message['call_user_id']
    w_resv_type = message['resv_type']
    # 新規レコード作成
    # ステータスはCALL
    # クライアントにシーケンスを伝える

    rst_call_video = DB.session.query(t_user_video
                        ).filter(
                            and_(t_user_video.status == 'CALL'
                                ,t_user_video.call_org_id == w_org_id
                                ,t_user_video.call_user_id == w_user_id
                                )
                        ).first()
    rst_call_video.resv_type = w_resv_type
    rst_call_video.status    = "START"
    rst_call_video.start_dtm = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()

    # 相手のsocketidを取得
    rst_user_status = DB.session.query(t_user_status
                          ).filter(
                              and_(t_user_status.org_id == w_org_id
                                  ,t_user_status.user_id == w_user_id
                                  )
                          ).first()
    if rst_user_status is not None:
        # 通知する
        emit('sok_srv_index_video_call_start'
            , {
                 'msg'        : '開始しました'
              }
            ,room=rst_user_status.socket_id
            )

@SOK.on('sok_cli_index_video_call_end', namespace='/sok')
def sok_cli_index_video_call_end(message):
    # シーケンスをもらう、なければログインIDで取得 ブラウザ更新などの例外的な終了(ソケット消えたタイミングで呼ぶ)
    # レコードを更新
    # ステータスはEND、時間はNOW
    # シーケンスをもとに相手に終了を伝える

    rst_call_video = DB.session.query(t_user_video
                        ).filter(
                            and_(t_user_video.status != 'END'
                                ,t_user_video.call_org_id == session.get('orgid')
                                ,t_user_video.call_user_id == session.get('userid')
                                )
                        ).all()
    for r_c in rst_call_video:
        # 更新する
        r_c.status = 'END'
        r_c.end_dtm = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        DB.session.commit()
        # 相手のsocketidを取得
        r_c_user_status = DB.session.query(t_user_status
                              ).filter(
                                  and_(t_user_status.org_id == r_c.resv_org_id
                                      ,t_user_status.user_id == r_c.resv_user_id
                                      )
                              ).first()
        if r_c_user_status is not None:
            # 通知する
            emit('sok_srv_index_video_call_end'
                , {
                     'msg'        : '終了しました1'
                  }
                ,room=r_c_user_status.socket_id
                )

    rst_resv_video = DB.session.query(t_user_video
                        ).filter(
                            and_(t_user_video.status != 'END'
                                ,t_user_video.resv_org_id == session.get('orgid')
                                ,t_user_video.resv_user_id == session.get('userid')
                                )
                        ).all()
    for r_r in rst_resv_video:
        # 更新する
        r_r.status = 'END'
        r_r.end_dtm = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        DB.session.commit()
        # 相手のsocketidを取得
        r_r_user_status = DB.session.query(t_user_status
                              ).filter(
                                  and_(t_user_status.org_id == r_r.call_org_id
                                      ,t_user_status.user_id == r_r.call_user_id
                                      )
                              ).first()
        if r_r_user_status is not None:
            # 通知する
            emit('sok_srv_index_video_call_end'
                , {
                     'msg'        : '終了しました2'
                  }
                ,room=r_r_user_status.socket_id
                )


@SOK.on('sok_srv_add_voice', namespace='/sok')
def sok_srv_add_voice(message):

    import urllib.parse
    voice = message['voice']
    voice = urllib.parse.unquote(voice)

    voice_ins = t_user_voice(org_id=session.get('orgid')
                            ,user_id=session.get('userid')
                            ,voice=voice
                            ,hide_flg=0
                            )
    DB.session.add(voice_ins)
    DB.session.commit()

    # 追加したボイスのボイスIDを取得
    sql_voice_id = """
        select voice_id
          from t_user_voice a
         where org_id  = '@LOGIN_ORG_ID@'
           and user_id = '@LOGIN_USER_ID@'
         order by voice_id desc
        limit 1
    """
    sql_voice_id = sql_voice_id.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_voice_id = sql_voice_id.replace("@LOGIN_USER_ID@" ,session.get('userid'))
    rst_voice_id = DB.session.execute(sql_voice_id)
    for r in rst_voice_id:
      add_voice_id = r.voice_id

    # 同じ組織でログイン中のユーザーを指定
    rst_user_status = DB.session.query(t_user_status
                          ).filter(
                              and_(t_user_status.org_id == session.get('orgid')
                                  ,t_user_status.socket_id != None
                                  )
                          ).all()
    for r in rst_user_status:
        emit('sok_cli_res_add_voice'
            , {
                 'voice'        : voice
                ,'now_dtm'      : datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                ,'voice_org_id' : session.get('orgid')
                ,'voice_user_id': session.get('userid')
                ,'voice_id'     : add_voice_id
              }
            ,room=r.socket_id
            )

    # お知らせ情報を更新
    rst_info = DB.session.query(t_user_info
                          ).filter(
                              and_(t_user_info.target_org_id ==  session.get('orgid')
                                  ,t_user_info.target_user_id == session.get('userid')
                                  )
                          ).all()
    for r in rst_info:
        r.target_voice_cnt = r.target_voice_cnt + 1
        r.upd_dtm          = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        DB.session.commit()

@SOK.on('sok_srv_add_voice_comment', namespace='/sok')
def sok_srv_add_voice_comment(message):

    voice_id = message['target_voice_id']
    import urllib.parse
    voice_comment = message['voice_comment']
    voice_comment = urllib.parse.unquote(voice_comment)

    chk  = DB.session.query(t_user_voice_comment
                          ).filter(
                              and_(t_user_voice_comment.voice_id == voice_id
                                  ,t_user_voice_comment.org_id ==  session.get('orgid')
                                  ,t_user_voice_comment.user_id == session.get('userid')
                                  )
                          ).first()
    if chk is None:
        voice_ins = t_user_voice_comment(voice_id=voice_id
                                        ,org_id=session.get('orgid')
                                        ,user_id=session.get('userid')
                                        ,voice_comment=voice_comment
                                        ,kidoku_flg=0
                                        ,hide_flg=0
                                        )
        DB.session.add(voice_ins)
        DB.session.commit()

        # 同じ組織でログイン中のユーザーを指定
        rst_user_status = DB.session.query(t_user_status
                              ).filter(
                                  and_(t_user_status.org_id == session.get('orgid')
                                      ,t_user_status.socket_id != None
                                      )
                              ).all()
        for r in rst_user_status:
            emit('sok_cli_res_add_voice_comment'
                , {
                     'voice_id'       : voice_id
                    ,'voice_comment'  : voice_comment
                    ,'now_dtm'        : datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    ,'comment_org_id'         : session.get('orgid')
                    ,'comment_user_id'        : session.get('userid')
                  }
                ,room=r.socket_id
                )


@SOK.on('sok_cli_admin_voice_get', namespace='/sok')
def sok_cli_admin_voice_get(message):
    import urllib.parse
    w_text = message['text']
    w_text = urllib.parse.unquote(w_text)

    sql_voice = """
        select voice_id
              ,(select user_nm from m_user where user_id = a.user_id) as user_nm
              ,voice
              ,voice_dtm
              ,hide_flg
              ,(select user_nm from m_user where org_id = a.hide_org_id and user_id = a.hide_user_id) as hide_user_nm
          from t_user_voice a
         where org_id  = '@LOGIN_ORG_ID@'
           and voice like '%@TEXT@%'
         order by voice_id desc
        limit 200
    """
    sql_voice = sql_voice.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_voice = sql_voice.replace("@TEXT@",w_text)
    rst_voice = DB.session.execute(sql_voice)

    cnt = 0
    w_last_flg = 0
    for r in rst_voice:
        cnt += 1
        if rst_voice.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_srv_admin_voice_get'
            , {
                 'voice_id'  : r.voice_id
                ,'voice_dtm' : r.voice_dtm.strftime("%Y/%m/%d %H:%M:%S")
                ,'voice'     : r.voice
                ,'hide_user_nm'  : r.hide_user_nm
                ,'hide_flg'  : r.hide_flg
                ,'last_flg'  : w_last_flg
              }
            )

@SOK.on('sok_cli_admin_voice_disp', namespace='/sok')
def sok_cli_admin_voice_disp(message):
    w_voice_id = message['voice_id']
    voice_ins  = DB.session.query(t_user_voice
                          ).filter(t_user_voice.voice_id == w_voice_id
                          ).first()
    voice_ins.hide_flg     = 0
    voice_ins.hide_org_id  = session.get('orgid')
    voice_ins.hide_user_id = session.get('userid')
    voice_ins.hide_dtm     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()


@SOK.on('sok_cli_admin_voice_hide', namespace='/sok')
def sok_cli_admin_voice_hide(message):
    w_voice_id = message['voice_id']
    voice_ins  = DB.session.query(t_user_voice
                          ).filter(t_user_voice.voice_id == w_voice_id
                          ).first()
    voice_ins.hide_flg     = 1
    voice_ins.hide_org_id  = session.get('orgid')
    voice_ins.hide_user_id = session.get('userid')
    voice_ins.hide_dtm     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()

@SOK.on('sok_cli_admin_voice_comment_disp', namespace='/sok')
def sok_cli_admin_voice_comment_disp(message):
    w_voice_id = message['voice_id']
    w_org_id   = message['org_id']
    w_user_id  = message['user_id']
    voice_ins  = DB.session.query(t_user_voice_comment
                          ).filter(
                              and_(t_user_voice_comment.org_id == w_org_id
                                  ,t_user_voice_comment.user_id == w_user_id
                                  ,t_user_voice_comment.voice_id == w_voice_id
                                  )
                          ).first()
    voice_ins.hide_flg     = 0
    voice_ins.hide_org_id  = session.get('orgid')
    voice_ins.hide_user_id = session.get('userid')
    voice_ins.hide_dtm     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()


@SOK.on('sok_cli_admin_voice_comment_hide', namespace='/sok')
def sok_cli_admin_voice_comment_hide(message):
    w_voice_id = message['voice_id']
    w_org_id   = message['org_id']
    w_user_id  = message['user_id']
    voice_ins  = DB.session.query(t_user_voice_comment
                          ).filter(
                              and_(t_user_voice_comment.org_id == w_org_id
                                  ,t_user_voice_comment.user_id == w_user_id
                                  ,t_user_voice_comment.voice_id == w_voice_id
                                  )
                          ).first()
    voice_ins.hide_flg     = 1
    voice_ins.hide_org_id  = session.get('orgid')
    voice_ins.hide_user_id = session.get('userid')
    voice_ins.hide_dtm     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()


@SOK.on('sok_cli_admin_grp_talk_disp', namespace='/sok')
def sok_cli_admin_grp_talk_disp(message):
    w_grp_talk_id = message['grp_talk_id']
    grp_talk_ins  = DB.session.query(t_grp_talk
                          ).filter(t_grp_talk.grp_talk_id == w_grp_talk_id
                          ).first()
    grp_talk_ins.hide_flg     = 0
    grp_talk_ins.hide_org_id  = session.get('orgid')
    grp_talk_ins.hide_user_id = session.get('userid')
    grp_talk_ins.hide_dtm     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()


@SOK.on('sok_cli_admin_grp_talk_hide', namespace='/sok')
def sok_cli_admin_grp_talk_hide(message):
    w_grp_talk_id = message['grp_talk_id']
    grp_talk_ins  = DB.session.query(t_grp_talk
                          ).filter(t_grp_talk.grp_talk_id == w_grp_talk_id
                          ).first()
    grp_talk_ins.hide_flg     = 1
    grp_talk_ins.hide_org_id  = session.get('orgid')
    grp_talk_ins.hide_user_id = session.get('userid')
    grp_talk_ins.hide_dtm     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()


@SOK.on('sok_cli_admin_talk_get', namespace='/sok')
def sok_cli_admin_talk_get(message):
    import urllib.parse
    w_text = message['text']
    w_text = urllib.parse.unquote(w_text)

    sql_talk = """
        select talk_id
              ,talk
              ,talk_dtm
              ,hide_flg
              ,(select user_nm from m_user where org_id = a.hide_org_id and user_id = a.hide_user_id) as hide_user_nm
          from t_user_talk a
         where send_org_id = '@LOGIN_ORG_ID@'
           and resv_org_id = '@LOGIN_ORG_ID@'
           and talk like '%@TEXT@%'
         order by talk_id desc
        limit 200
    """
    sql_talk = sql_talk.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    sql_talk = sql_talk.replace("@TEXT@",w_text)
    rst_talk = DB.session.execute(sql_talk)

    cnt = 0
    w_last_flg = 0
    for r in rst_talk:
        cnt += 1
        if rst_talk.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_srv_admin_talk_get'
            , {
                 'talk_id'  : r.talk_id
                ,'talk_dtm' : r.talk_dtm.strftime("%Y/%m/%d %H:%M:%S")
                ,'talk'     : r.talk
                ,'hide_user_nm'     : r.hide_user_nm
                ,'hide_flg'     : r.hide_flg
                ,'last_flg'     : w_last_flg
              }
            )

@SOK.on('sok_cli_admin_talk_disp', namespace='/sok')
def sok_cli_admin_talk_disp(message):
    w_talk_id = message['talk_id']
    talk_ins  = DB.session.query(t_user_talk
                          ).filter(t_user_talk.talk_id == w_talk_id
                          ).first()
    talk_ins.hide_flg     = 0
    talk_ins.hide_org_id  = session.get('orgid')
    talk_ins.hide_user_id = session.get('userid')
    talk_ins.hide_dtm     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()

@SOK.on('sok_cli_admin_talk_hide', namespace='/sok')
def sok_cli_admin_talk_hide(message):
    w_talk_id = message['talk_id']
    talk_ins  = DB.session.query(t_user_talk
                          ).filter(t_user_talk.talk_id == w_talk_id
                          ).first()
    talk_ins.hide_flg     = 1
    talk_ins.hide_org_id  = session.get('orgid')
    talk_ins.hide_user_id = session.get('userid')
    talk_ins.hide_dtm     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB.session.commit()



@SOK.on('sok_cli_admin_user_list_get', namespace='/sok')
def sok_cli_admin_user_list_get(message):

    sql_user_list = """
        select user_id
              ,user_nm
              ,(select user_auth_nm from m_user_auth b where b.user_auth_cd = a.user_auth_cd) as user_auth_nm
              ,profile_work
              ,profile_msg
              ,profile_img_file
              ,stop_flg
              ,(select user_nm from m_user c where c.user_id = a.upd_user_id) as upd_user_nm
              ,upd_dtm
          from m_user a
         where org_id = '@LOGIN_ORG_ID@'
           and del_flg = 0
         order by user_id
    """
    sql_user_list = sql_user_list.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_user_list = DB.session.execute(sql_user_list)

    cnt = 0
    w_last_flg = 0
    for r in rst_user_list:
        cnt += 1
        if rst_user_list.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_srv_admin_user_list_get'
            , {
                 'user_id'          : r.user_id
                ,'user_nm'          : r.user_nm
                ,'user_auth_nm'     : r.user_auth_nm
                ,'profile_work'     : r.profile_work
                ,'profile_msg'      : r.profile_msg
                ,'profile_img_file' : r.profile_img_file
                ,'stop_flg'         : r.stop_flg
                ,'upd_user_nm'      : r.upd_user_nm
                ,'upd_dtm'          : r.upd_dtm.strftime("%Y/%m/%d %H:%M:%S")
                ,'last_flg'         : w_last_flg
              }
            )

@SOK.on('sok_cli_admin_grp_list_get', namespace='/sok')
def sok_cli_admin_grp_list_get(message):

    sql_grp_list = """
        select a.grp_id
              ,a.grp_nm
              ,a.stop_flg
          from m_grp a
         where a.del_flg = 0
           and a.upd_org_id = '@LOGIN_ORG_ID@'
         order by a.grp_id
    """
    sql_grp_list = sql_grp_list.replace("@LOGIN_ORG_ID@" ,session.get('orgid'))
    rst_grp_list = DB.session.execute(sql_grp_list)

    cnt = 0
    w_last_flg = 0
    for r in rst_grp_list:
        cnt += 1
        if rst_grp_list.rowcount == cnt:
            w_last_flg = 1
        else:
            w_last_flg = 0

        emit('sok_srv_admin_grp_list_get'
            , {
                 'grp_id'          : r.grp_id
                ,'grp_nm'          : r.grp_nm
                ,'stop_flg'        : r.stop_flg
                ,'last_flg'        : w_last_flg
              }
            )



@SOK.on('sok_srv_get_grp_user', namespace='/sok')
def sok_srv_get_grp_user(message):
    """
    # 処理： [Socket.io]グループメンバー取得処理
    # 概要：
    # 備考：
    """
    grp_id  = message['grp_id']

    # サポートセンター用
    if grp_id == 'manyone':
        grp_id = session.get('orgid') + '-support-grp'

    # データ取得
    sql_grp = """
        select b.grp_id
              ,b.org_id
              ,b.user_id
              ,c.user_nm
              ,c.user_nm
              ,c.profile_img_file
              ,c.profile_work
              ,b.auth_cd
              ,(select status from t_user_status d where d.org_id = b.org_id and d.user_id = b.user_id) as status
          from m_grp_user b
              ,m_user c
         where b.org_id   = c.org_id
           and b.user_id  = c.user_id
           and b.grp_id   = '@GRP_ID@'
           and b.stop_flg = 0
           and b.del_flg  = 0
         order by b.org_id,b.user_id
    """
    sql_grp   = sql_grp.replace("@GRP_ID@",grp_id)
    rst_grp   = DB.session.execute(sql_grp)
    rst_grp   = list(rst_grp)
    for r in rst_grp:
        # データ送信
        emit('sok_cli_get_grp_user'
            , {
                'grp_id' : r.grp_id
               ,'org_id' : r.org_id
               ,'user_id': r.user_id
               ,'user_nm': r.user_nm
               ,'profile_img_file': r.profile_img_file
               ,'profile_work': r.profile_work
               ,'auth_cd' : r.auth_cd
               ,'status' : r.status
              }
            )

@SOK.on('sok_srv_get_grp_talk', namespace='/sok')
def sok_srv_get_grp_talk(message):
    """
    # 処理： [Socket.io]グループトーク取得処理
    # 概要：
    # 備考：
    """
    grp_id      = message['grp_id']
    grp_talk_id = message['grp_talk_id']

    # サポートセンター用
    if grp_id == 'manyone':
        grp_id = session.get('orgid') + '-support-grp'

    # データ取得
    sql_grp = """
        select a.grp_talk_id
              ,a.org_id
              ,c.user_id
              ,c.user_nm
              ,c.profile_img_file
              ,c.profile_work
              ,a.grp_talk
              ,a.grp_talk_dtm
              ,a.grp_id
          from t_grp_talk a
              ,m_grp b
              ,m_user c
         where a.grp_id   = b.grp_id
           and a.org_id   = c.org_id
           and a.user_id  = c.user_id
           and b.stop_flg = 0
           and b.del_flg  = 0
           and c.stop_flg = 0
           and c.del_flg  = 0
           and a.hide_flg = 0
           and a.grp_id   = '@GRP_ID@'
           and a.grp_talk_id < @GRP_TALK_ID@
         order by a.grp_talk_id desc
         limit 20
    """
    sql_grp = sql_grp.replace("@GRP_ID@",grp_id)
    if (grp_talk_id == ""):
        sql_grp = sql_grp.replace("and a.grp_talk_id < @GRP_TALK_ID@","")
    else:
        sql_grp = sql_grp.replace("@GRP_TALK_ID@",grp_talk_id)
    rst_grp = DB.session.execute(sql_grp)
    rst_grp = list(rst_grp)

    w_cnt = 0
    for r in rst_grp:
        w_cnt += 1
        # データ送信
        emit('sok_cli_get_grp_talk'
            , {
                'grp_talk_id' : r.grp_talk_id
               ,'org_id': r.org_id
               ,'user_id': r.user_id
               ,'user_nm': r.user_nm
               ,'profile_img_file': r.profile_img_file
               ,'profile_work': r.profile_work
               ,'grp_talk': r.grp_talk
               ,'grp_talk_dtm': r.grp_talk_dtm.strftime("%Y/%m/%d %H:%M:%S")
              }
            )
        if ( w_cnt == 20) :
            # 更に読み込むボタン
            emit('sok_cli_res_get_grp_talk_read_more_btn'
                , {
                    'grp_id'      : r.grp_id
                   ,'grp_talk_id' : r.grp_talk_id
                  }
                )


@SOK.on('sok_srv_get_voice', namespace='/sok')
def sok_srv_get_voice(message):
    """
    # 処理： [Socket.io]ボイス取得処理
    # 概要：
    # 備考：
    """
    voice_id = message['voice_id']
    org_id   = message['org_id']
    user_id  = message['user_id']
    # データ取得
    sql_voice = """
        select c.org_id
              ,c.org_nm
              ,b.user_id
              ,b.user_nm
              ,b.profile_img_file
              ,a.voice_id
              ,a.voice
              ,a.voice_dtm
              ,(select count(*) as voice_comment_cnt from t_user_voice_comment where voice_id = a.voice_id)
          from t_user_voice a
              ,m_user b
              ,m_org c
         where a.org_id    = b.org_id
           and a.user_id   = b.user_id
           and b.org_id    = c.org_id
           and a.org_id    = '@ORG_ID@'
           and a.user_id   = '@USER_ID@'
           and a.voice_id  < @VOICE_ID@
         order by voice_id desc
         limit 10
    """
    sql_voice = sql_voice.replace("@ORG_ID@",org_id)
    sql_voice = sql_voice.replace("@USER_ID@",user_id)
    if (voice_id == ""):
        sql_voice = sql_voice.replace("and a.voice_id  < @VOICE_ID@","")
    else:
        sql_voice = sql_voice.replace("@VOICE_ID@",voice_id)

    rst_voice = DB.session.execute(sql_voice)
    rst_voice = list(rst_voice)

    w_cnt = 0
    for r in rst_voice:
        w_cnt += 1
        # データ送信
        emit('sok_cli_res_get_voice'
            , {
                'org_id' : r.org_id
               ,'org_nm' : r.org_nm
               ,'user_id': r.user_id
               ,'user_nm': r.user_nm
               ,'profile_img_file': r.profile_img_file
               ,'voice_id' : r.voice_id
               ,'voice_dtm': r.voice_dtm.strftime("%Y/%m/%d %H:%M:%S")
               ,'voice'    : r.voice
               ,'voice_comment_cnt'    : r.voice_comment_cnt
              }
            )
        if ( w_cnt == 10) :
            # 更に読み込むボタン
            emit('sok_cli_res_get_voice_read_more_btn'
                , {
                    'org_id'   : r.org_id
                   ,'user_id'  : r.user_id
                   ,'voice_id' : r.voice_id
                  }
                )


@SOK.on('sok_srv_get_voice_comment', namespace='/sok')
def sok_srv_get_voice_comment(message):
    """
    # 処理： [Socket.io]ボイスコメント取得処理
    # 概要：
    # 備考：
    """
    w_voice_id  = message['target_voice_id']
    # データ取得
    sql_voice = """
        select a.voice_id
              ,a.voice_comment
              ,a.voice_comment_dtm
              ,b.org_id   as voice_comment_org_id
              ,b.user_id  as voice_comment_user_id
              ,b.user_nm  as voice_comment_user_nm
              ,b.profile_img_file as voice_comment_profile_img_file
              ,c.org_id   as voice_org_id
              ,c.user_id  as voice_user_id
              ,d.user_nm  as voice_user_nm
              ,d.profile_img_file as voice_profile_img_file
          from t_user_voice_comment a
              ,m_user b
              ,t_user_voice c
              ,m_user d
         where a.org_id    = b.org_id
           and a.user_id   = b.user_id
           and a.voice_id  = c.voice_id
           and c.user_id   = d.user_id
           and a.voice_id  = '@VOICE_ID@'
         order by voice_id desc
         limit 100
    """
    sql_voice = sql_voice.replace("@VOICE_ID@",str(w_voice_id))
    rst_voice = DB.session.execute(sql_voice)
    rst_voice = list(rst_voice)
    for r in rst_voice:
        # データ送信
        emit('sok_cli_res_get_voice_comment'
            , {
                'voice_comment_org_id'           : r.voice_comment_org_id
               ,'voice_comment_user_id'          : r.voice_comment_user_id
               ,'voice_comment_user_nm'          : r.voice_comment_user_nm
               ,'voice_comment_profile_img_file' : r.voice_comment_profile_img_file
               ,'voice_org_id'           : r.voice_org_id
               ,'voice_user_id'          : r.voice_user_id
               ,'voice_user_nm'          : r.voice_user_nm
               ,'voice_profile_img_file' : r.voice_profile_img_file
               ,'voice_id'         : r.voice_id
               ,'voice_comment_dtm': r.voice_comment_dtm.strftime("%Y/%m/%d %H:%M:%S")
               ,'voice_comment'    : r.voice_comment
              }
            )

@SOK.on('sok_srv_get_talk', namespace='/sok')
def sok_srv_get_talk(message):
    """
    # 処理： [Socket.io]トーク取得処理
    # 概要：
    # 備考：
    """
    org_id  = message['org_id']
    user_id = message['user_id']
    talk_id = message['talk_id']
    # データ取得
    sql_talk = """
        select talk_id
              ,talk_dtm
              ,talk
              ,case
                 when (send_org_id = '@ORG_ID@' and send_user_id = '@USER_ID@') then 'left'
                 else 'right'
               end              as position
              ,case
                 when (send_org_id = '@ORG_ID@' and send_user_id = '@USER_ID@') then resv_org_id
                 else send_org_id
               end              as org_id
              ,case
                 when (send_org_id = '@ORG_ID@' and send_user_id = '@USER_ID@')
                    then (select org_nm from m_org where org_id = a.resv_org_id)
                 else (select org_nm from m_org where org_id = a.send_org_id)
               end              as org_nm
              ,case
                 when (send_user_id = '@ORG_ID@' and send_user_id = '@USER_ID@') then resv_user_id
                 else send_user_id
               end              as user_id
              ,case
                 when (send_user_id = '@ORG_ID@' and send_user_id = '@USER_ID@')
                    then (select user_nm from m_user where user_id = a.resv_user_id)
                 else (select user_nm from m_user where user_id = a.send_user_id)
               end              as user_nm
              ,case
                 when (send_user_id = '@ORG_ID@' and send_user_id = '@USER_ID@')
                    then (select profile_img_file from m_user where user_id = a.resv_user_id)
                 else (select profile_img_file from m_user where user_id = a.send_user_id)
               end              as profile_img_file
          from t_user_talk a
         where   (
                    (send_org_id = '@LOGIN_ORG_ID@' and send_user_id = '@LOGIN_USER_ID@')
                 or
                    (resv_org_id = '@LOGIN_ORG_ID@' and resv_user_id = '@LOGIN_USER_ID@')
                 )
           and   (
                    (send_org_id = '@ORG_ID@' and send_user_id = '@USER_ID@')
                 or
                    (resv_org_id = '@ORG_ID@' and resv_user_id = '@USER_ID@')
                 )
           and talk_id  < @TALK_ID@
           and hide_flg = 0
        order by talk_id desc
        limit 20
    """
    sql_talk = sql_talk.replace("@ORG_ID@",org_id)
    sql_talk = sql_talk.replace("@USER_ID@",user_id)
    sql_talk = sql_talk.replace("@LOGIN_ORG_ID@",session.get('orgid'))
    sql_talk = sql_talk.replace("@LOGIN_USER_ID@",session.get('userid'))
    if (talk_id == ""):
        sql_talk = sql_talk.replace("and talk_id  < @TALK_ID@","")
    else:
        sql_talk = sql_talk.replace("@TALK_ID@",talk_id)

    rst_talk = DB.session.execute(sql_talk)
    rst_talk = list(rst_talk)

    w_cnt = 0
    for r in rst_talk:
        w_cnt += 1
        # データ送信
        emit('sok_cli_res_talk'
            , {
                'org_id' : r.org_id
               ,'org_nm' : r.org_nm
               ,'user_id': r.user_id
               ,'user_nm': r.user_nm
               ,'profile_img_file': r.profile_img_file
               ,'talk_id' : r.talk_id
               ,'talk_dtm': r.talk_dtm.strftime("%Y/%m/%d %H:%M:%S")
               ,'talk'    : r.talk
               ,'position': r.position
              }
            )
        if ( w_cnt == 20) :
            # 更に読み込むボタン
            emit('sok_cli_res_get_talk_read_more_btn'
                , {
                    'org_id'   : r.org_id
                   ,'user_id'  : r.user_id
                   ,'talk_id' : r.talk_id
                  }
                )

@SOK.on('sok_srv_ini_index', namespace='/sok')
def sok_srv_ini_index(message):
    """
    # 処理： [Socket.io]index.html初期化処理
    # 概要： 
    # 備考： 
    """
    org_id  = message['org_id']
    user_id = message['user_id']
    # ----------------------------------------------------
    # 発信者
    # ----------------------------------------------------
    # データ取得
    sql_voice = """
        select c.org_id
              ,c.org_nm
              ,b.user_id
              ,b.user_nm
              ,b.profile_img_file
              ,a.voice_id
              ,a.voice
              ,a.voice_dtm
          from t_user_voice a
              ,m_user b
              ,m_org c
         where a.org_id    = b.org_id
           and a.user_id   = b.user_id
           and b.org_id    = c.org_id
           and a.org_id    = '@ORG_ID@'
           and a.user_id   = '@USER_ID@'
           and a.stop_flg  = 0
         order by voice_id desc
         limit 100
    """
    sql_voice = sql_voice.replace("@ORG_ID@",org_id)
    sql_voice = sql_voice.replace("@USER_ID@",user_id)
    rst_voice = DB.session.execute(sql_voice)
    rst_voice = list(rst_voice)
    for r in rst_voice:
        # データ送信
        emit('sok_cli_ini_voice'
            , {
                'org_id' : r.org_id
               ,'org_nm' : r.org_nm
               ,'user_id': r.user_id
               ,'user_nm': r.user_nm
               ,'profile_img_file': r.profile_img_file
               ,'voice_id' : r.voice_id
               ,'voice_dtm': r.voice_dtm.strftime("%Y/%m/%d %H:%M:%S")
               ,'voice'    : r.voice
              }
            )
        # ----------------------------------------------------
        # ログインユーザー
        # ----------------------------------------------------
        # データ取得
        v_login_user = DB.session.query(m_user
                    ).filter(
                        and_(m_user.org_id == session.get('orgid')
                            ,m_user.user_id == session.get('userid')
                            )
                    ).first()
        v_login_comment = DB.session.query(t_user_voice_comment
                    ).filter(
                        and_(t_user_voice_comment.comment_org_id == session.get('orgid')
                            ,t_user_voice_comment.comment_user_id == session.get('userid')
                            ,t_user_voice_comment.voice_id == r.voice_id
                            )
                    ).first()
        v_login_good = DB.session.query(t_user_voice_good
                    ).filter(
                        and_(t_user_voice_good.good_org_id == session.get('orgid')
                            ,t_user_voice_good.good_user_id == session.get('userid')
                            ,t_user_voice_comment.voice_id == r.voice_id
                            )
                    ).first()
        v_login_report = DB.session.query(t_user_voice_report
                    ).filter(
                        and_(t_user_voice_report.report_org_id == session.get('orgid')
                            ,t_user_voice_report.report_user_id == session.get('userid')
                            ,t_user_voice_comment.voice_id == r.voice_id
                            )
                    ).first()
        w_user_nm           = ""
        w_user_img_file     = ""
        w_voice_comment_flg = 0
        w_voice_comment_dtm = ""
        w_voice_comment     = ""
        w_good_flg          = 0
        w_report_flg        = 0
        if v_login_user is not None:
            w_user_img_file = v_login_user.profile_img_file
        if v_login_comment is not None:
            w_voice_comment_flg = 1
            w_voice_comment_dtm = v_login_comment.voice_comment_dtm.strftime("%Y/%m/%d %H:%M:%S")
            w_voice_comment     = v_login_comment.voice_comment
        if v_login_good is not None:
            w_good_flg = 1
        if v_login_report is not None:
            w_report_flg = 1
        # データ送信
        emit('sok_cli_ini_voice_comment_login_user'
            , {
                'login_org_id'  : session.get('orgid')
               ,'login_org_nm'  : session.get('orgnm')
               ,'login_user_id' : session.get('userid')
               ,'login_user_nm' : session.get('usernm')
               ,'login_user_img': w_user_img_file
               ,'login_voice_comment_dtm': w_voice_comment_dtm
               ,'login_voice_comment'    : w_voice_comment
               ,'login_voice_comment_flg': w_voice_comment_flg
               ,'login_voice_good_flg'   : w_good_flg
               ,'login_voice_report_flg' : w_report_flg
              }
            )
        # ----------------------------------------------------
        # その他ユーザー
        # ----------------------------------------------------
        # データ取得
        sql_voice_comment = """
            select a.voice_comment
                  ,a.voice_comment_dtm
                  ,a.comment_org_id
                  ,a.comment_user_id
              from t_user_voice_comment a
             where a.voice_id  = @VOICE_ID@
               and (a.comment_org_id, a.comment_user_id) not in (
                select b.comment_org_id, b.comment_user_id
                  from t_user_voice_comment b
                 where b.voice_id        = @VOICE_ID@
                   and b.comment_org_id  = '@LOGIN_ORG_ID@'
                   and b.comment_user_id = '@LOGIN_USER_ID@'
                )
             order by a.voice_comment_dtm desc
             limit 5
        """
        sql_voice_comment = sql_voice_comment.replace("@VOICE_ID@",str(r.voice_id))
        sql_voice_comment = sql_voice_comment.replace("@LOGIN_ORG_ID@",session.get('orgid'))
        sql_voice_comment = sql_voice_comment.replace("@LOGIN_USER_ID@",session.get('userid'))
        rst_voice_comment = DB.session.execute(sql_voice_comment)
        rst_voice_comment = list(rst_voice_comment)
        for r_comment in rst_voice_comment:
            v_comment_user = DB.session.query(m_user
                                    ).filter(
                                        and_(m_user.org_id == r_comment.comment_org_id
                                            ,m_user.user_id == r_comment.comment_user_id
                                            )
                                    ).first()
            v_comment_rep = DB.session.query(t_user_voice_comment_report
                                    ).filter(
                                        and_(t_user_voice_comment_report.comment_org_id == r_comment.comment_org_id
                                            ,t_user_voice_comment_report.comment_user_id == r_comment.comment_user_id
                                            ,t_user_voice_comment_report.report_org_id == session.get('orgid')
                                            ,t_user_voice_comment_report.report_user_id == session.get('userid')
                                            ,t_user_voice_comment_report.voice_id == r.voice_id
                                            )
                                    ).first()
            w_user_nm         = ""
            w_user_img_file   = ""
            w_comment_rep_flg = 0
            if v_comment_user is not None:
                w_user_nm       = v_comment_user.user_nm
                w_user_img_file = v_comment_user.profile_img_file
            if v_comment_rep is not None:
                w_comment_rep_flg = 1
            # データ送信
            emit('sok_cli_ini_voice_comment'
                , {
                    'other_org_id'   : r_comment.comment_org_id
                   ,'other_user_id'  : r_comment.comment_user_id
                   ,'other_user_nm'  : w_user_nm
                   ,'other_user_img' : w_user_img_file
                   ,'other_voice_comment_dtm' : r_comment.voice_comment_dtm.strftime("%Y/%m/%d %H:%M:%S")
                   ,'other_voice_comment'     : r_comment.voice_comment
                   ,'other_comment_report_flg': w_comment_rep_flg
                  }
                )

@SOK.on('sok_srv_ini_analyze', namespace='/sok')
def sok_srv_ini_analyze(message):
    """
    # 処理： [Socket.io]analyze.html初期化処理
    # 概要： 
    # 備考： 
    """
    pass

@SOK.on('connect', namespace='/sok')
def sok_connect():
    """
    # 処理： [Socket.io]WEBソケット接続後処理
    # 概要： 
    # 備考： 
    """
    _create_access_log('/sok_connect ')
    # global SOK_CON_CNT
    # SOK_CON_CNT += 1
    # APP.logger.debug(SOK_CON_CNT)
    w_sid = request.sid

    if session.get('orgid') is not None and session.get('userid') is not None:
        chk_user_status = DB.session.query(t_user_status
                ).filter(
                    and_(t_user_status.org_id == session.get('orgid')
                        ,t_user_status.user_id == session.get('userid')
                        ,t_user_status.socket_id != None
                        )
                ).first()
        if chk_user_status is not None:
            w_socket_id = chk_user_status.socket_id
            emit('sok_cli_disconnect'
                , {
                    'message'   : 'ウィンドウを閉じてください'
                  }
                ,room=w_socket_id
                )
            # 切断

        DB.session.query(t_user_status
                ).filter(
                    and_(t_user_status.org_id == session.get('orgid')
                        ,t_user_status.user_id == session.get('userid')
                        )
                ).delete()
        status = t_user_status(org_id=session.get('orgid')
                              ,user_id=session.get('userid')
                              ,status='ONLINE'
                              ,socket_id=w_sid
                              )
        DB.session.add(status)
        DB.session.commit()


        # 同じ組織でログイン中のユーザーを指定
        rst_user_status = DB.session.query(t_user_status
                              ).filter(
                                  and_(t_user_status.org_id == session.get('orgid')
                                      ,t_user_status.socket_id != None
                                      )
                              ).all()
        for r in rst_user_status:
            emit('sok_cli_user_login'
                , {
                    'org_id'   : session.get('orgid')
                   ,'user_id'  : session.get('userid')
                  }
                ,room=r.socket_id
                )

@SOK.on('disconnect', namespace='/sok')
def sok_disconnect():
    """
    # 処理： [Socket.io]WEBソケット切断後処理
    # 概要： 
    # 備考： 
    """
    _create_access_log('/sok_disconnect ')
    # global SOK_CON_CNT
    # SOK_CON_CNT -= 1
    # APP.logger.debug(SOK_CON_CNT)
    # ビデオ終了
    sok_cli_index_video_call_end("DUMMY")

    if session.get('orgid') is not None and session.get('userid') is not None:
        chk_user_status = DB.session.query(t_user_status
                ).filter(
                    and_(t_user_status.org_id == session.get('orgid')
                        ,t_user_status.user_id == session.get('userid')
                        ,t_user_status.socket_id == request.sid
                        )
                ).first()
        if chk_user_status is not None :
            DB.session.query(t_user_status
                    ).filter(
                        and_(t_user_status.org_id == session.get('orgid')
                            ,t_user_status.user_id == session.get('userid')
                            )
                    ).delete()
            status = t_user_status(org_id=session.get('orgid')
                                  ,user_id=session.get('userid')
                                  ,status='OFFLINE'
                                  )
            DB.session.add(status)
            DB.session.commit()

            # 同じ組織でログイン中のユーザーを指定
            rst_user_status = DB.session.query(t_user_status
                                  ).filter(
                                      and_(t_user_status.org_id == session.get('orgid')
                                          ,t_user_status.socket_id != None
                                          )
                                  ).all()
            for r in rst_user_status:
                emit('sok_cli_user_logout'
                    , {
                        'org_id'   : session.get('orgid')
                       ,'user_id'  : session.get('userid')
                      }
                    ,room=r.socket_id
                    )



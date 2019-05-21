from manyone import *
from sqlalchemy import *

__all__ = ['m_org','t_org_add_user','t_org_del_user','t_org_cost'
          ,'m_user','m_user_auth'
          ,'t_user_status'
          ,'t_user_info'
          ,'t_user_video'
          ,'t_user_voice'
          ,'t_user_voice_comment'
          ,'t_user_talk'
          ,'m_grp','m_grp_user'
          ,'t_grp_talk'
          ,'t_sys_access_log','t_sys_batch_log'
          ]

class m_org(DB.Model):
    __tablename__    = 'm_org'
    __table_args__   = {'extend_existing': True}
    org_id           = DB.Column(DB.Text, primary_key=True)
    org_nm           = DB.Column(DB.Text)
    org_auth_cd      = DB.Column(DB.Text)
    profile_business = DB.Column(DB.Text)
    profile_address  = DB.Column(DB.Text)
    profile_msg      = DB.Column(DB.Text)
    profile_img_file = DB.Column(DB.Text)
    profile_mail     = DB.Column(DB.Text)
    stop_flg         = DB.Column(DB.SmallInteger)
    del_flg          = DB.Column(DB.SmallInteger)
    upd_org_id       = DB.Column(DB.Text)
    upd_user_id      = DB.Column(DB.Text)
    upd_dtm          = DB.Column(DB.TIMESTAMP)

class t_org_add_user(DB.Model):
    __tablename__  = 't_org_add_user'
    __table_args__ = {'extend_existing': True}
    seq            = DB.Column(DB.BigInteger, Sequence('t_org_add_user_seq'), primary_key=True)
    add_org_id     = DB.Column(DB.Text)
    add_user_id    = DB.Column(DB.Text)
    upd_org_id     = DB.Column(DB.Text)
    upd_user_id    = DB.Column(DB.Text)
    upd_dtm        = DB.Column(DB.TIMESTAMP, default=func.now())


class t_org_del_user(DB.Model):
    __tablename__  = 't_org_del_user'
    __table_args__ = {'extend_existing': True}
    seq            = DB.Column(DB.BigInteger, Sequence('t_org_del_user_seq'), primary_key=True)
    del_org_id     = DB.Column(DB.Text)
    del_user_id    = DB.Column(DB.Text)
    upd_org_id     = DB.Column(DB.Text)
    upd_user_id    = DB.Column(DB.Text)
    upd_dtm        = DB.Column(DB.TIMESTAMP, default=func.now())

class t_org_cost(DB.Model):
    __tablename__           = 't_org_cost'
    __table_args__          = {'extend_existing': True}
    org_id                  = DB.Column(DB.Text, primary_key=True)
    status                  = DB.Column(DB.Text) # CONFIRM PAID PENDING
    year                    = DB.Column(DB.SmallInteger, primary_key=True)
    month                   = DB.Column(DB.SmallInteger, primary_key=True)
    cost_total              = DB.Column(DB.BigInteger)
    cost_detail_active_user = DB.Column(DB.BigInteger)
    cost_detail_add_user    = DB.Column(DB.BigInteger)
    upd_org_id              = DB.Column(DB.Text)
    upd_user_id             = DB.Column(DB.Text)
    upd_dtm                 = DB.Column(DB.TIMESTAMP, default=func.now())

class m_user(DB.Model):
    __tablename__    = 'm_user'
    __table_args__   = {'extend_existing': True}
    org_id           = DB.Column(DB.Text, primary_key=True)
    user_id          = DB.Column(DB.Text, primary_key=True)
    user_nm          = DB.Column(DB.Text)
    user_pass_bcrypt = DB.Column(DB.LargeBinary)
    user_auth_cd     = DB.Column(DB.Text)
    profile_work     = DB.Column(DB.Text)
    profile_msg      = DB.Column(DB.Text)
    profile_img_file = DB.Column(DB.Text)
    stop_flg         = DB.Column(DB.SmallInteger)
    del_flg          = DB.Column(DB.SmallInteger)
    upd_org_id       = DB.Column(DB.Text)
    upd_user_id      = DB.Column(DB.Text)
    upd_dtm          = DB.Column(DB.TIMESTAMP, default=func.now())

class m_user_auth(DB.Model):
    __tablename__      = 'm_user_auth'
    __table_args__     = {'extend_existing': True}
    user_auth_cd       = DB.Column(DB.Text, primary_key=True)
    user_auth_nm       = DB.Column(DB.Text)
    sysadm_access_flg  = DB.Column(DB.SmallInteger)
    sysadm_user_flg    = DB.Column(DB.SmallInteger)
    sysadm_grp_flg     = DB.Column(DB.SmallInteger)
    sysadm_cost_flg    = DB.Column(DB.SmallInteger)
    sysadm_data_flg    = DB.Column(DB.SmallInteger)
    sysadm_analyze_flg = DB.Column(DB.SmallInteger)
    sysadm_support_flg = DB.Column(DB.SmallInteger)

class t_user_status(DB.Model):
    __tablename__  = 't_user_status'
    __table_args__ = {'extend_existing': True}
    org_id         = DB.Column(DB.Text, primary_key=True)
    user_id        = DB.Column(DB.Text, primary_key=True)
    status         = DB.Column(DB.Text)
    socket_id      = DB.Column(DB.Text)
    peer_id        = DB.Column(DB.Text)
    upd_dtm        = DB.Column(DB.TIMESTAMP, default=func.now())

class t_user_info(DB.Model):
    __tablename__    = 't_user_info'
    __table_args__   = {'extend_existing': True}
    org_id           = DB.Column(DB.Text, primary_key=True)
    user_id          = DB.Column(DB.Text, primary_key=True)
    target_org_id    = DB.Column(DB.Text, primary_key=True)
    target_user_id   = DB.Column(DB.Text, primary_key=True)
    target_voice_cnt = DB.Column(DB.BigInteger)
    target_talk_cnt  = DB.Column(DB.BigInteger)
    target_video_cnt = DB.Column(DB.BigInteger)
    upd_dtm          = DB.Column(DB.TIMESTAMP, default=func.now())

class t_user_voice(DB.Model):
    __tablename__  = 't_user_voice'
    __table_args__ = {'extend_existing': True}
    voice_id       = DB.Column(DB.BigInteger, Sequence('t_user_voice_seq'), primary_key=True)
    org_id         = DB.Column(DB.Text)
    user_id        = DB.Column(DB.Text)
    voice_dtm      = DB.Column(DB.TIMESTAMP, default=func.now())
    voice          = DB.Column(DB.Text)
    hide_flg       = DB.Column(DB.SmallInteger)
    hide_org_id    = DB.Column(DB.Text)
    hide_user_id   = DB.Column(DB.Text)
    hide_dtm       = DB.Column(DB.TIMESTAMP)

class t_user_voice_comment(DB.Model):
    __tablename__     = 't_user_voice_comment'
    __table_args__    = {'extend_existing': True}
    voice_id          = DB.Column(DB.BigInteger, primary_key=True)
    org_id            = DB.Column(DB.Text, primary_key=True)
    user_id           = DB.Column(DB.Text, primary_key=True)
    voice_comment_dtm = DB.Column(DB.TIMESTAMP, default=func.now())
    voice_comment     = DB.Column(DB.Text)
    kidoku_flg        = DB.Column(DB.SmallInteger)
    hide_flg          = DB.Column(DB.SmallInteger)
    hide_org_id       = DB.Column(DB.Text)
    hide_user_id      = DB.Column(DB.Text)
    hide_dtm          = DB.Column(DB.TIMESTAMP)


class t_user_talk(DB.Model):
    __tablename__  = 't_user_talk'
    __table_args__ = {'extend_existing': True}
    talk_id        = DB.Column(DB.BigInteger, Sequence('t_user_talk_seq'), primary_key=True)
    talk_dtm       = DB.Column(DB.TIMESTAMP, default=func.now())
    talk           = DB.Column(DB.Text)
    send_org_id    = DB.Column(DB.Text)
    send_user_id   = DB.Column(DB.Text)
    resv_org_id    = DB.Column(DB.Text)
    resv_user_id   = DB.Column(DB.Text)
    hide_flg       = DB.Column(DB.SmallInteger)
    hide_org_id    = DB.Column(DB.Text)
    hide_user_id   = DB.Column(DB.Text)
    hide_dtm       = DB.Column(DB.TIMESTAMP)

class t_user_video(DB.Model):
    __tablename__  = 't_user_video'
    __table_args__ = {'extend_existing': True}
    video_id       = DB.Column(DB.BigInteger, Sequence('t_user_video_seq'), primary_key=True)
    status         = DB.Column(DB.Text)
    call_dtm       = DB.Column(DB.TIMESTAMP, default=func.now())
    start_dtm      = DB.Column(DB.TIMESTAMP, default=func.now())
    end_dtm        = DB.Column(DB.TIMESTAMP, default=func.now())
    call_type      = DB.Column(DB.Text)
    call_org_id    = DB.Column(DB.Text)
    call_user_id   = DB.Column(DB.Text)
    resv_type      = DB.Column(DB.Text)
    resv_org_id    = DB.Column(DB.Text)
    resv_user_id   = DB.Column(DB.Text)


class m_grp(DB.Model):
    __tablename__    = 'm_grp'
    __table_args__   = {'extend_existing': True}
    grp_id           = DB.Column(DB.Text, primary_key=True)
    grp_nm           = DB.Column(DB.Text)
    auth_cd          = DB.Column(DB.Text)
    profile_work     = DB.Column(DB.Text)
    profile_msg      = DB.Column(DB.Text)
    profile_img_file = DB.Column(DB.Text)
    stop_flg         = DB.Column(DB.SmallInteger)
    del_flg          = DB.Column(DB.SmallInteger)
    upd_org_id       = DB.Column(DB.Text)
    upd_user_id      = DB.Column(DB.Text)
    upd_dtm          = DB.Column(DB.TIMESTAMP, default=func.now())

class m_grp_user(DB.Model):
    __tablename__    = 'm_grp_user'
    __table_args__   = {'extend_existing': True}
    grp_id           = DB.Column(DB.Text, primary_key=True)
    org_id           = DB.Column(DB.Text, primary_key=True)
    user_id          = DB.Column(DB.Text, primary_key=True)
    auth_cd          = DB.Column(DB.Text)
    stop_flg         = DB.Column(DB.SmallInteger)
    del_flg          = DB.Column(DB.SmallInteger)
    upd_org_id       = DB.Column(DB.Text)
    upd_user_id      = DB.Column(DB.Text)
    upd_dtm          = DB.Column(DB.TIMESTAMP, default=func.now())

class t_grp_talk(DB.Model):
    __tablename__  = 't_grp_talk'
    __table_args__ = {'extend_existing': True}
    grp_talk_id    = DB.Column(DB.BigInteger, Sequence('t_grp_talk_seq'), primary_key=True)
    grp_talk_dtm   = DB.Column(DB.TIMESTAMP, default=func.now())
    grp_talk       = DB.Column(DB.Text)
    grp_id         = DB.Column(DB.Text)
    org_id         = DB.Column(DB.Text)
    user_id        = DB.Column(DB.Text)
    hide_flg       = DB.Column(DB.SmallInteger)
    hide_org_id    = DB.Column(DB.Text)
    hide_user_id   = DB.Column(DB.Text)
    hide_dtm       = DB.Column(DB.TIMESTAMP)

class t_sys_access_log(DB.Model):
    __tablename__  = 't_sys_access_log'
    __table_args__ = {'extend_existing': True}
    seq            = DB.Column(DB.BigInteger, Sequence('t_sys_access_log_seq'), primary_key=True)
    ip             = DB.Column(DB.Text)
    url            = DB.Column(DB.Text)
    org_id         = DB.Column(DB.Text)
    user_id        = DB.Column(DB.Text)
    access_dtm     = DB.Column(DB.TIMESTAMP, default=func.now())

class t_sys_batch_log(DB.Model):
    __tablename__  = 't_sys_batch_log'
    __table_args__ = {'extend_existing': True}
    seq            = DB.Column(DB.BigInteger, Sequence('t_sys_batch_log_seq'), primary_key=True)
    proc_dtm       = DB.Column(DB.TIMESTAMP, default=func.now())
    pg             = DB.Column(DB.Text)
    proc           = DB.Column(DB.Text)
    msg            = DB.Column(DB.Text)
    msg_detail     = DB.Column(DB.Text)

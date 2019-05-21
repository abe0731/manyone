/* ------------------------------------------ */
/* グローバル変数                                 */
/* ------------------------------------------ */
_SELECT_ORG_ID  ="";
_SELECT_USER_ID ="";
_SELECT_GRP_ID  ="";
_VIDEO_START    = new Date();
_SPINNER        = '<i class="fa fa-refresh fa-spin"></i><br>'
_MY_DEVICE      = (function(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'sp';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return 'tab';
    }else{
        return 'other';
    }
})();
_EFFECT_SOUND = new Audio('/static/audio/dummy.mp3')

// [ボイス]絵文字
window.emojiPicker = new EmojiPicker({
  emojiable_selector: '[data-emojiable=true]',
  assetsPath: '/static/img/',
  popupButtonClasses: 'fa fa-smile-o'
});

var megabyteFormat = function(number, point) {
    var bytes  = Number(number),
        unit = 'MB',
        mega = 1048576;
    return (Math.round(bytes / mega  * Math.pow( 10, 2 )) / Math.pow( 10, 2 ) + ' ' + unit);
};

/* ------------------------------------------ */
/* DOMツリー構築後処理                           */
/* ------------------------------------------ */
$(document).ready(function () {

    /* ------------------------------------------ */
    /* レイアウト制御                  　              */
    /* ------------------------------------------ */
    function fnc_layout_ctl() {
        var w_height                     = $(window).height();
        var w_width                      = $(window).width();
        var w_scroll_h                   = w_height - 100
        var w_sidebar_h                  = w_height - 5
        var w_scroll_h_harf              = (w_height / 2) - 72
        var w_video_h                    = w_height - 155
        var w_video_h_harf               = w_video_h /2
        var w_video_h_harf_harf          = w_video_h_harf /2
        var w_video_w                    = w_width /1.33
        var w_video_w_harf               = w_video_w /2
        var w_video_w_harf_harf          = w_video_w_harf /2
        var w_video_w_all_harf           = w_width /2.05
        var w_video_w_all_harf_harf      = w_video_w_all_harf /2
        var w_video_w_all_harf_harf_harf = w_video_w_all_harf_harf /2
        // MYメニュー 内枠の白い部分 スクロール部分
        $("#sidebar-my-voice").parent().css("height", w_scroll_h + "px");
        $("#sidebar-my-setting").parent().css("height", w_scroll_h + "px");
        $("#sidebar-my-analyze").parent().css("height", w_scroll_h + "px");
        $("#sidebar-my-data").parent().css("height", w_scroll_h + "px");
        // MYメニュー 外枠の黒い部分
        $("#my_user_sidebar").css("height", w_sidebar_h + "px");

        $("#user_scroll_content").css("padding", "10px");
        $("#voice_scroll_content").css("padding", "10px");
        $("#talk_scroll_content").css("padding", "10px");
        $("#grp_scroll_content").css("padding", "10px");
        $("#talk_info_scroll_content").css("padding", "10px");
        $("#grp_talk_scroll_content").css("padding", "10px");
        $("#video_scroll_content").css("padding", "10px");

        // ユーザーモード
        if (_LAYOUT_MODE == 'USER') {

            // ユーザーモード共通
            $('#col-user').css("display","")
            $('#col-voice').css("display","")
            $('#col-talk').css("display","")
            $('#col-video').css('display','')
            $('#col-group').css("display","none")
            $('#col-group-talk-info').css("display","none")
            $('#col-group-talk').css("display","none")

            $('#select_user_box').css("display","")

            // MYMENU制御
            if( _LAYOUT_MYMENU == 'OPEN' ){
                // 1 USER  + VOICE + TALK
                if (_LAYOUT_USER_MODE_STATUS == 1) {
                     // 2　USER  + VOICE + TALK + MYMENU
                    _LAYOUT_USER_MODE_STATUS = 2
                // 3 USER  + VOICE + TALK + AUDIO
                } else if(_LAYOUT_USER_MODE_STATUS == 3) {
                    // 4 AUDIO + MYMENU
                    _LAYOUT_USER_MODE_STATUS = 4
                }
            } else if (_LAYOUT_MYMENU == 'CLOSE') {
                // 2　USER  + VOICE + TALK + MYMENU
                if (_LAYOUT_USER_MODE_STATUS == 2) {
                    // 1 USER  + VOICE + TALK
                    _LAYOUT_USER_MODE_STATUS = 1
                // 4 AUDIO + MYMENU
                } else if (_LAYOUT_USER_MODE_STATUS == 4) {
                    // 3 USER  + VOICE + TALK + AUDIO
                    _LAYOUT_USER_MODE_STATUS = 3
                }
            }

            // 1:[ユーザーモード]USER  + VOICE + TALK
            if ( _LAYOUT_USER_MODE_STATUS == 1 ){
                // 高さ調整
                $("#user_scroll_content").parent().css("height", w_scroll_h + "px");
                $("#voice_scroll_content").parent().css("height", w_scroll_h + "px");
                $("#talk_scroll_content").parent().css("height", w_scroll_h + "px");
                // コンテンツ表示調整
                $('#col-user').css('display','')
                $('#col-talk').css('display','')
                $('#col-voice').css('display','')
                $('#col-video').css('display','none')
                $('#select_user_box').css("display","")
                // コンテンツ位置調整

                $("#col-talk").each(function(idx, ele){
                    var eleTarget= $(this).find("#talk_content_box");
                    if(eleTarget.length <= 0){
                        $("#col-talk").append($("#talk_content_box"))
                    }
                });
                // コンテンツ幅調整
                $("#col-voice").css("padding-right", "15px");
                $("#col-talk").removeClass("col-xs-3");
                $("#col-talk").addClass("col-xs-6");
            // 2:[ユーザーモード]USER  + VOICE + TALK + MYMENU
            } else if (_LAYOUT_USER_MODE_STATUS == 2) {
                // 高さ調整
                $("#user_scroll_content").parent().css("height", w_scroll_h + "px");
                $("#voice_scroll_content").parent().css("height", w_scroll_h_harf + "px");
                $("#talk_scroll_content").parent().css("height", w_scroll_h_harf + "px");
                // コンテンツ表示調整
                $('#col-user').css('display','')
                $('#col-talk').css('display','none')
                $('#col-voice').css('display','')
                $('#col-video').css('display','none')
                $('#select_user_box').css("display","")
                // コンテンツ位置調整
                $("#col-center-row-2").each(function(idx, ele){
                    var eleTarget= $(this).find("#talk_content_box");
                    if(eleTarget.length <= 0){
                        $("#col-center-row-2").append($("#talk_content_box"))
                    }
                });
                // コンテンツ幅調整
                $("#col-voice").css("padding-right", "15px");
                $("#col-talk").removeClass("col-xs-6")
                $("#col-talk").addClass("col-xs-3");
            // 3:[ユーザーモード] TALK + AUDIO
            } else if (_LAYOUT_USER_MODE_STATUS == 3) {
                if (_LAYOUT_VIDEO_STATUS == 1) {
                    // 高さ調整
                    $("#voice_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#talk_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#video_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#media_their").css("height", w_video_h + "px");
                    $("#media_my").css("height", w_video_h + "px");
                    // 幅調整
                    $("#media_their").css("width", w_video_w_harf + "px");
                    $("#media_my").css("width", w_video_w_harf + "px");
                    $("#media_my").css("left", w_video_w_harf + "px");
                    // コンテンツ表示調整
                    $('#col-user').css('display','none')
                    $('#col-voice').css('display','none')
                    $('#col-talk').css('display','')
                    $('#col-video').css('display','')
                    $('#select_user_box').css("display","none")
                    $("#media_their").css("display", "block");
                    $("#media_my").css("display", "block")
                    // コンテンツ幅調整
                    $("#col-video").removeClass("col-xs-6")
                    $("#col-video").addClass("col-xs-9");
                    $("#col-talk").removeClass("col-xs-6")
                    $("#col-talk").addClass("col-xs-3");
                    $("#col-video").css("padding-left", "20px");
                } else if (_LAYOUT_VIDEO_STATUS == 2) {
                    // 高さ調整
                    $("#voice_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#talk_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#video_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#media_their").css("height", w_video_h + "px");
                    $("#media_my").css("height", w_video_h_harf_harf + "px");
                    // 幅調整
                    $("#media_their").css("width", w_video_w + "px");
                    $("#media_my").css("width", w_video_w_harf_harf + "px");
                    $("#media_my").css("left", "5px");
                    // コンテンツ表示調整
                    $('#col-user').css('display','none')
                    $('#col-voice').css('display','none')
                    $('#col-talk').css('display','')
                    $('#col-video').css('display','')
                    $('#select_user_box').css("display","none")
                    $("#media_their").css("display", "block");
                    $("#media_my").css("display", "block")
                    // コンテンツ幅調整
                    $("#col-video").removeClass("col-xs-6")
                    $("#col-video").addClass("col-xs-9");
                    $("#col-talk").removeClass("col-xs-6")
                    $("#col-talk").addClass("col-xs-3");
                    $("#col-video").css("padding-left", "20px");
                } else if (_LAYOUT_VIDEO_STATUS == 3) {
                    // 高さ調整
                    $("#voice_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#talk_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#video_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#media_their").css("height", w_video_h + "px");
                    // 幅調整
                    $("#media_their").css("width", w_video_w + "px");
                    $("#media_my").css("width", w_video_w_harf_harf + "px");
                    // コンテンツ表示調整
                    $('#col-user').css('display','none')
                    $('#col-voice').css('display','none')
                    $('#col-talk').css('display','')
                    $('#col-video').css('display','')
                    $('#select_user_box').css("display","none")
                    $("#media_their").css("display", "block");
                    $("#media_my").css("display", "none")
                    // コンテンツ幅調整
                    $("#col-video").removeClass("col-xs-6")
                    $("#col-video").addClass("col-xs-9");
                    $("#col-talk").removeClass("col-xs-6")
                    $("#col-talk").addClass("col-xs-3");
                    $("#col-video").css("padding-left", "20px");
                }
            // 4:[ユーザーモード]AUDIO + MYMENU
            } else if (_LAYOUT_USER_MODE_STATUS == 4) {
                if (_LAYOUT_VIDEO_STATUS == 1) {
                    // 高さ調整
                    $("#video_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#media_their").css("height", w_video_h + "px");
                    $("#media_my").css("height", w_video_h + "px");
                    // 幅調整
                    $("#media_their").css("width", w_video_w_all_harf_harf + "px");
                    $("#media_my").css("width", w_video_w_all_harf_harf + "px");
                    $("#media_my").css("left", w_video_w_all_harf_harf + "px");
                    // コンテンツ表示調整
                    $('#col-user').css('display','none')
                    $('#col-talk').css('display','none')
                    $('#col-voice').css('display','none')
                    $('#col-video').css('display','')
                    $('#select_user_box').css("display","none")
                    $("#media_my").css("display", "block")
                    // コンテンツ幅調整
                    $("#col-video").removeClass("col-xs-9")
                    $("#col-video").addClass("col-xs-6");
                    $("#col-video").css("padding-left", "20px");
                } else if (_LAYOUT_VIDEO_STATUS == 2) {
                    // 高さ調整
                    $("#video_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#media_their").css("height", w_video_h + "px");
                    $("#media_my").css("height", w_video_h_harf_harf + "px");
                    // 幅調整
                    $("#media_their").css("width", w_video_w_all_harf + "px");
                    $("#media_my").css("width", w_video_w_all_harf_harf_harf + "px");
                    $("#media_my").css("left", "5px");
                    // コンテンツ表示調整
                    $('#col-user').css('display','none')
                    $('#col-talk').css('display','none')
                    $('#col-voice').css('display','none')
                    $('#col-video').css('display','')
                    $('#select_user_box').css("display","none")
                    $("#media_my").css("display", "block")
                    // コンテンツ幅調整
                    $("#col-video").removeClass("col-xs-9")
                    $("#col-video").addClass("col-xs-6");
                    $("#col-video").css("padding-left", "20px");
                } else if (_LAYOUT_VIDEO_STATUS == 3) {
                    // 高さ調整
                    $("#video_scroll_content").parent().css("height", w_scroll_h + "px");
                    $("#media_their").css("height", w_video_h + "px");
                    $("#media_my").css("height", w_video_h_harf_harf + "px");
                    // 幅調整
                    $("#media_their").css("width", w_video_w_all_harf + "px");
                    $("#media_my").css("width", w_video_w_all_harf_harf_harf + "px");
                    $("#media_my").css("left", "5px");
                    // コンテンツ表示調整
                    $('#col-user').css('display','none')
                    $('#col-talk').css('display','none')
                    $('#col-voice').css('display','none')
                    $('#col-video').css('display','')
                    $('#select_user_box').css("display","none")
                    $("#media_my").css("display", "none")
                    // コンテンツ幅調整
                    $("#col-video").removeClass("col-xs-9")
                    $("#col-video").addClass("col-xs-6");
                    $("#col-video").css("padding-left", "20px");
                }
            }
        // グループモード
        } else if ( _LAYOUT_MODE == 'GROUP') {

            // グループモード共通
            $('#col-user').css("display","none")
            $('#col-voice').css("display","none")
            $('#col-talk').css("display","none")
            $('#col-video').css('display','none')
            $('#col-group').css("display","")
            $('#col-group-talk-info').css("display","")
            $('#col-group-talk').css("display","")

            $('#select_user_box').css("display","none")

            // MYMENU制御
            if( _LAYOUT_MYMENU == 'OPEN' ){
                // 1 GROUP + GROUPMENBER + GROUPTALK
                if (_LAYOUT_GROUP_MODE_STATUS == 1) {
                     // 2　GROUP + GROUPMENBER + GROUPTALK　+ MYMENU
                    _LAYOUT_GROUP_MODE_STATUS = 2
                }
            } else if (_LAYOUT_MYMENU == 'CLOSE') {
                // 2　GROUP + GROUPMENBER + GROUPTALK　+ MYMENU
                if (_LAYOUT_GROUP_MODE_STATUS == 2) {
                    // 1 GROUP + GROUPMENBER + GROUPTALK
                    _LAYOUT_GROUP_MODE_STATUS = 1
                }
            }

            // 1:[グループモード]GROUP + GROUPMENBER + GROUPTALK
            if ( _LAYOUT_GROUP_MODE_STATUS == 1 ){

                // 高さ調整
                $("#grp_scroll_content").parent().css("height", w_scroll_h + "px");
                $("#talk_info_scroll_content").parent().css("height", w_scroll_h + "px");
                $("#grp_talk_scroll_content").parent().css("height", w_scroll_h + "px");
                // コンテンツ表示調整
                $('#col-group').css('display','')
                $('#col-group-talk-info').css('display','')
                $('#col-group-talk').css('display','')
                // コンテンツ位置調整
                $("#col-group-talk").each(function(idx, ele){
                    var eleTarget= $(this).find("#grp_talk_content_box");
                    if(eleTarget.length <= 0){
                        $("#col-group-talk").append($("#grp_talk_content_box"))
                    }
                });
                // コンテンツ幅調整
                $("#col-group-talk").css('padding-left','0px');
                $("#col-group-talk").css('padding-right','20px');
                $("#col-group-talk").removeClass("col-xs-3");
                $("#col-group-talk").addClass("col-xs-6");

            // 2:[グループモード]GROUP + GROUPMENBER + GROUPTALK　+ MYMENU
            } else if ( _LAYOUT_GROUP_MODE_STATUS == 2 ){

                // 高さ調整
                $("#grp_scroll_content").parent().css("height", w_scroll_h + "px");
                $("#talk_info_scroll_content").parent().css("height", w_scroll_h_harf + "px");
                $("#grp_talk_scroll_content").parent().css("height", w_scroll_h_harf + "px");

                // コンテンツ表示調整
                $('#col-group').css('display','')
                $('#col-group-talk-info').css('display','')
                $('#col-group-talk').css('display','')
                // コンテンツ位置調整
                $("#col-center-grp-row-2").each(function(idx, ele){
                    var eleTarget= $(this).find("#grp_talk_content_box");
                    if(eleTarget.length <= 0){
                        $("#col-center-grp-row-2").append($("#grp_talk_content_box"))
                    }
                });
                // コンテンツ幅調整
                $("#col-group-talk").removeClass("col-xs-6")
                $("#col-group-talk").addClass("col-xs-3");

            }

        }
    }

    /* ------------------------------------------ */
    /* ユーザーモード切替               　              */
    /* ------------------------------------------ */
    $("#chg_user_mode").on('click',function() {
        _LAYOUT_MODE   = 'USER'
        fnc_layout_ctl()
    })
    /* ------------------------------------------ */
    /* グループモード切替               　              */
    /* ------------------------------------------ */
    $("#chg_group_mode").on('click',function() {
        _LAYOUT_MODE   = 'GROUP'
        fnc_layout_ctl()
    })
    /* ------------------------------------------ */
    /* MYメニュー表示                　              */
    /* ------------------------------------------ */
    $("#nav_user_prof").on('click', function () {
        if( $('#my_user_sidebar').hasClass('control-sidebar-open') ){
          // OPEN
          _LAYOUT_MYMENU = 'OPEN'
           fnc_layout_ctl()
          $('#my_user_sidebar').fadeIn("slow")
          // テキストサイズの高さが0になる対応(2回クリックで高さを調整)
          $('#voice_text_size_chg').click();
          $('#voice_text_size_chg').click();
          /* ------------------------------------------ */
          /* [個人集計]ボイス集計取得                       */
          /* ------------------------------------------ */
          _SOK.emit('sok_cli_common_my_voice_tatal_get',{});
          /* ------------------------------------------ */
          /* [個人集計]トーク集計取得                        */
          /* ------------------------------------------ */
          _SOK.emit('sok_cli_common_my_talk_tatal_get',{});
          /* ------------------------------------------ */
          /* [個人集計]ビデオ集計取得                       */
          /* ------------------------------------------ */
          _SOK.emit('sok_cli_common_my_video_tatal_get',{});


        } else {
          // CLOSE
          _LAYOUT_MYMENU = 'CLOSE'
          fnc_layout_ctl()
          $('#my_user_sidebar').fadeOut("slow")
        }
    })

    /* ------------------------------------------ */
    /* レイアウト設定                  　              */
    /* ------------------------------------------ */
    /* ==========================================
      _LAYOUT_MODE
        USER: ユーザーモード
        GROUP: グループモード
      _LAYOUT_MYMENU
        OPEN: 開いている状態
        CLOSE: 閉じている状態
      _LAYOUT_USER_MODE_STATUS
        1: USER  + VOICE + TALK
        2: USER  + VOICE + TALK + MYMENU
        3: USER  + VOICE + TALK + AUDIO
        4: AUDIO + MYMENU
      _LAYOUT_GROUP_MODE_STATUS
        1: GROUP + GROUPMENBER + GROUPTALK
        2: GROUP + GROUPMENBER + GROUPTALK + MYMENU
      _LAYOUT_VIDEO_STATUS
        1: MY-1/2 + THIRE-1/2
        2: MY-1/4 + THIRE-1
        3: THIRE-1
       ========================================== */
    _LAYOUT_MODE              = 'USER'
    _LAYOUT_MYMENU            = 'CLOSE'
    _LAYOUT_USER_MODE_STATUS  = 1
    _LAYOUT_GROUP_MODE_STATUS = 1
    _LAYOUT_VIDEO_STATUS      = 1
    // 初期表示レイアウト
    fnc_layout_ctl()
    $(window).resize(function() {
        // ウィンドウリサイズ時
        fnc_layout_ctl()
    });

    /* ------------------------------------------ */
    /* [ユーザーBOX]状況変更 ログイン    　              */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_user_login', function(msg) {
        var w_org_id     = msg.org_id
        var w_user_id    = msg.user_id
        $('#user_box_status_' + w_org_id + '_' + w_user_id).empty()
        $('#user_box_status_' + w_org_id + '_' + w_user_id).append(
            "<small class='label label-primary'>ログイン中</small>"
        )
    })
    /* ------------------------------------------ */
    /* [ユーザーBOX]状況変更 ログアウト                  */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_user_logout', function(msg) {
        var w_org_id     = msg.org_id
        var w_user_id    = msg.user_id
        $('#user_box_status_' + w_org_id + '_' + w_user_id).empty()
        $('#user_box_status_' + w_org_id + '_' + w_user_id).append(
            "<small class='label bg-gray'>ログアウト</small>"
        )
    })
    /* ------------------------------------------ */
    /* [ユーザーBOX]ホバー設定                         */
    /* ------------------------------------------ */
    $("[id^=user_boxh_]").hover(
      function () {
        if ( _SELECT_ORG_ID == this.id.split("_")[2] && _SELECT_USER_ID == this.id.split("_")[3]) {
            $(this).css("background","rgba(255, 0, 0, 0.2)");
        } else {
            $(this).css("background","#EEEEEE");
        }
      },
      function () {
        if ( _SELECT_ORG_ID == this.id.split("_")[2] && _SELECT_USER_ID == this.id.split("_")[3]) {
            $(this).css("background","rgba(255, 0, 0, 0.3)");
        } else {
            $(this).css("background","#fff");
        }
      }
    );
    /* ------------------------------------------ */
    /* [グループBOX]ホバー設定                         */
    /* ------------------------------------------ */
    $("[id^=grp_boxh_]").hover(
      function () {
        if ( _SELECT_GRP_ID == this.id.split("_")[2]) {
            $(this).css("background","rgba(255, 0, 0, 0.2)");
        } else {
            $(this).css("background","#EEEEEE");
        }
      },
      function () {
        if ( _SELECT_GRP_ID == this.id.split("_")[2]) {
            $(this).css("background","rgba(255, 0, 0, 0.3)");
        } else {
            $(this).css("background","#fff");
        }
      }
    );
    /* ------------------------------------------ */
    /* [ユーザーBOX]ユーザーBOX選択                    */
    /* ------------------------------------------ */
    $("[id^=user_boxh_]").on('click', function () {
        // 選択ユーザー情報を変数に設定
        _SELECT_ORG_ID  = this.id.split("_")[2];
        _SELECT_USER_ID = this.id.split("_")[3];
        var w_user_boxh = "user_boxh_" + _SELECT_ORG_ID + "_" + _SELECT_USER_ID
        var w_user_boxb = "user_boxb_" + _SELECT_ORG_ID + "_" + _SELECT_USER_ID

        // 他ユーザーのBOXを初期値に戻す
        $("[id^=user_boxh_]").css({
             'background-color':'white'
            ,'opacity': 1
            ,'color':'#444'
        })
        $("[id^=user_boxb_]").css({
             'border-color':'white'
        })
        // 選択したユーザーBOXの色調整
        $("#" + w_user_boxh ).css({
             'background-color':'rgba(255,0,0,0.3)'
            ,'color':'white'
        })
        $("#" + w_user_boxb ).css({
             'border-color':'rgba(255,0,0,0.3)'
        })
        // 選択したユーザー情報を送信
        _SOK.emit('sok_srv_user_visit', {
             visit_org_id  : this.id.split("_")[2]
            ,visit_user_id : this.id.split("_")[3]
        });
        /* ------------------------------------------ */
        /* [ボイスBOX]ユーザーBOX選択時処理                 */
        /* ------------------------------------------ */
        $('div#voice').empty();
        $('div#voice').append(
            "<div id='voice_not_exist_msg' style='color: #BBBBBB;text-align: center'>"
          +      "<i class='fa fa-commenting-o fa-5x'></i>"
          +      "<h1 style='color:#BBBBBB'>ボイスがありません</h1>"
          + "</div>"
        )
         _SOK.emit('sok_srv_get_voice', {
              org_id:  this.id.split("_")[2]
             ,user_id: this.id.split("_")[3]
             ,voice_id: ""
         });
        /* ------------------------------------------ */
        /* [トークBOX]ユーザーBOX選択時処理                 */
        /* ------------------------------------------ */
        $('div#send_right_talk').empty();
        $('div#new_talk').empty();
        $('div#new_talk').append(
            "<div id='talk_not_exist_msg' style='color: #BBBBBB;text-align: center'>"
          +      "<i class='fa fa-comments-o fa-5x'></i>"
          +      "<h1 style='color:#BBBBBB'>トークがありません</h1>"
          + "</div>"
        )
        $('div#talk').empty();
         _SOK.emit('sok_srv_get_talk', {
              org_id:  this.id.split("_")[2]
             ,user_id: this.id.split("_")[3]
             ,talk_id: ""
         });

         $('div#send_right_talk').append(
             "<div class='direct-chat-info clearfix'>"
            +    "<span class='direct-chat-name pull-right'>" + _LOGIN_USER_NM + "</span>"
            + "</div>"
            + "<img class='direct-chat-img' src='/static/img/user/" + _LOGIN_USER_IMG + "'>"
            + "<div class='direct-chat-text'>"
            +     "<div class='emoji-picker-container'>"
            +         "<textarea id='text_send_talk' rows=2 placeholder='トークを入力...' class='form-control' data-emojiable='true'></textarea>"
            +         "<div style='text-align:left'>"
            +            "<button id='talk_text_size_chg' type='button' style='margin-top:5px;border-radius:10px' class='btn btn-primary btn-flat'><i class='fa fa-angle-double-down'></i></button>"
            +            "<button id='btn_send_talk' type='button' style='float:right;margin:5px;border-radius:10px' class='btn btn-primary btn-flat'>送信</button>"
            +         "</div>"
            +     "</div>"
            + "</div>"
        );
        // [トーク]絵文字
        window.emojiPicker.discover();
        // [トーク]テキスト幅
        $("#talk_text_size_chg").on('click', function () {
            var w_height = $("#text_send_talk").next().height()
            if ( w_height > 55) {
                $("#talk_text_size_chg").empty()
                $("#talk_text_size_chg").append("<i class='fa fa-angle-double-down'></i>")
                $("#text_send_talk").next().height(35)
            } else {
                $("#talk_text_size_chg").empty()
                $("#talk_text_size_chg").append("<i class='fa fa-angle-double-up'></i>")
                $("#text_send_talk").next().height(275)
            }
        })
        // 連続クリックで閉じないよう、collapseを削除する
        // 0.35秒開くのを待ってから削除する
        setTimeout( function() {
            $("#" + w_user_boxh ).removeAttr("data-widget");
        }, 400 );
    });


    /* ------------------------------------------ */
    /* [グループBOX]グループBOX選択                    */
    /* ------------------------------------------ */
    $("[id^=grp_boxh_]").on('click', function () {
        // 選択ユーザー情報を変数に設定
        _SELECT_GRP_ID  = this.id.split("_")[2];
        var w_grp_boxh = "grp_boxh_" + _SELECT_GRP_ID

        // 他ユーザーのBOXを初期値に戻す
        $("[id^=grp_boxh_]").css({
             'background-color':'white'
            ,'opacity': 1
            ,'color':'#444'
        })
        // 選択したユーザーBOXの色調整
        $("#" + w_grp_boxh ).css({
             'background-color':'rgba(255,0,0,0.3)'
            ,'color':'white'
        })

        $('#select_talk_info_list').empty();
        $('#select_talk_info_list').css({
             'border':'solid 1px #BBBBBB'
        })
        /* ありえないから削除
        $('#select_talk_info_list').append(
            "<div id='grp_user_not_exist_msg' style='color: #BBBBBB;text-align: center'>"
          +      "<i class='fa fa-commenting-o fa-5x'></i>"
          +      "<h1 style='color:#BBBBBB'>メンバーがいません</h1>"
          + "</div>"
        )
        */

        $('#send_right_grp_talk').empty();
        $('#new_grp_talk').empty();
        $('#new_grp_talk').append(
            "<div id='grp_talk_not_exist_msg' style='color: #BBBBBB;text-align: center'>"
          +      "<i class='fa fa-comments-o fa-5x'></i>"
          +      "<h1 style='color:#BBBBBB'>グループトークがありません</h1>"
          + "</div>"
        )
        $('#grp_talk').empty();

         $('#send_right_grp_talk').append(
             "<div class='direct-chat-info clearfix'>"
            +    "<span class='direct-chat-name pull-right'>" + _LOGIN_USER_NM + "</span>"
            + "</div>"
            + "<img class='direct-chat-img' src='/static/img/user/" + _LOGIN_USER_IMG + "'>"
            + "<div class='direct-chat-text'>"
            +     "<div class='emoji-picker-container'>"
            +         "<textarea id='text_send_grp_talk' rows=2 placeholder='グループトークを入力...' class='form-control' data-emojiable='true'></textarea>"
            +         "<div style='text-align:left'>"
            +            "<button id='grp_talk_text_size_chg' type='button' style='margin-top:5px;border-radius:10px' class='btn btn-primary btn-flat'><i class='fa fa-angle-double-down'></i></button>"
            +            "<button id='btn_send_grp_talk' type='button' style='float:right;margin:5px;border-radius:10px' class='btn btn-primary btn-flat'>送信</button>"
            +         "</div>"
            +     "</div>"
            + "</div>"
        );
        window.emojiPicker.discover();
        // [グループトーク]テキスト幅
        $("#grp_talk_text_size_chg").on('click', function () {
            var w_height = $("#text_send_grp_talk").next().height()
            if ( w_height > 55) {
                $("#grp_talk_text_size_chg").empty()
                $("#grp_talk_text_size_chg").append("<i class='fa fa-angle-double-down'></i>")
                $("#text_send_grp_talk").next().height(35)
            } else {
                $("#grp_talk_text_size_chg").empty()
                $("#grp_talk_text_size_chg").append("<i class='fa fa-angle-double-up'></i>")
                $("#text_send_grp_talk").next().height(275)
            }
        })

        // グループメンバーを取得
         _SOK.emit('sok_srv_get_grp_user', {
              grp_id:  this.id.split("_")[2]
         });
        // グループトークを取得
         _SOK.emit('sok_srv_get_grp_talk', {
              grp_id:  this.id.split("_")[2]
             ,grp_talk_id:  ""
         });
    });


    /* ------------------------------------------ */
    /* [ボイス]ボイス受信イベント                        */
    /* ------------------------------------------ */
     _SOK.on('sok_cli_res_get_voice', function(msg) {
        // 初期メッセージ削除
　       $('#voice_not_exist_msg').empty();
        var w_org_id            = msg.org_id
        var w_org_nm            = msg.org_nm
        var w_user_id           = msg.user_id
        var w_user_nm           = msg.user_nm
        if (!msg.profile_img_file) {
            var w_profile_img_file = "noimage.png"
        } else {
            var w_profile_img_file = msg.profile_img_file
        }
        var w_voice_id          = msg.voice_id
        var w_voice_dtm         = msg.voice_dtm
        var w_voice             = msg.voice
        var w_voice             = w_voice.replace(/\r?\n/g, '<br>');
        var w_voice             = window.emojiPicker.appendUnicodeAsImageToElement($("#EMOJI_DUMMY"),w_voice)
        var w_voice_comment_cnt = msg.voice_comment_cnt
        /* ------------------------------------------ */
        /* [ボイス][個人]ボイス配置                        */
        /* ------------------------------------------ */
        if ( _LOGIN_ORG_ID == w_org_id && _LOGIN_USER_ID == w_user_id ) {
            $('div#my_voice').append(
                "<div id='my_voice_box_" + w_voice_id + "' class='box collapsed-box' style='margin-bottom: 10px;border:solid 1px #BBBBBB'>"
              +      "<div id='my_voice_boxh_" + w_voice_id + "' class='box-header' data-widget='collapse'>"
              +          "<span class='text-muted' style='margin-left: 10px'>"
              +              "<small>" + w_voice_dtm + "</small>"
              +          "</span>"
              +          "<img style='margin-left:5px;' class='img-circle img-sm' src='/static/img/user/" + w_profile_img_file + "'>"
              +          "<div style='margin-left:45px'>"
              +              "<span>"+ w_voice + "</span>"
              +          "</div>"
              +          "<div class='box-tools'>"
              +              "<i class='fa fa-retweet' aria-hidden='true'></i> " + w_voice_comment_cnt
              +          "</div>"
              +      "</div>"
              +      "<div id='my_voice_boxb_" + w_voice_id + "' class='box-body'>"
              +          "<div id='my_voice_comment_area_"+ w_voice_id + "'>"
              +          "</div>"
              +      "</div>"
              +  "</div>"
            );
            /* ------------------------------------------ */
            /* [ボイスコメント]ヘッダー押下                        */
            /* ------------------------------------------ */
            $(document).off('click', '#my_voice_boxh_' + w_voice_id )
            $(document).on('click', '#my_voice_boxh_' + w_voice_id , function(){
                if ($('#my_voice_box_' + w_voice_id).hasClass('collapsed-box')) {
                  $('#my_voice_comment_area_' + w_voice_id).empty()
                  // ボイスコメント取得
                  _SOK.emit('sok_srv_get_voice_comment', {
                     target_voice_id: w_voice_id
                  });
                }
            });

            /* ------------------------------------------ */
            /* [ボイス]ホバー設定                             */
            /* ------------------------------------------ */
            $("#my_voice_boxh_" + w_voice_id).hover(
              function () {
                $(this).css("background","#EEEEEE");
              },
              function () {
                $(this).css("background","#fff");
              }
            );


        /* ------------------------------------------ */
        /* [ボイス][ボイスBOX]ボイス配置                    */
        /* ------------------------------------------ */
        } else {
            $('div#voice').append(
                "<div id='voice_box_" + w_voice_id + "' class='box collapsed-box' style='margin-bottom: 10px;border:solid 1px #BBBBBB'>"
              +      "<div id='voice_boxh_" + w_voice_id + "' class='box-header' data-widget='collapse'>"
              +          "<span class='text-muted' style='margin-left: 10px'>"
              +              "<small>" + w_voice_dtm + "</small>"
              +          "</span>"
              +          "<img style='margin-left:5px;' class='img-circle img-sm' src='/static/img/user/" + w_profile_img_file + "'>"
              +          "<div style='margin-left:45px'>"
              +              "<span>"+ w_voice + "</span>"
              +          "</div>"
              +          "<div class='box-tools'>"
              +              "<i class='fa fa-retweet' aria-hidden='true'></i> " + w_voice_comment_cnt
              +          "</div>"
              +      "</div>"
              +      "<div id='voice_boxb_" + w_voice_id + "' class='box-body'>"
              +          "<div id='voice_my_comment_area_"+ w_voice_id + "'>"
              +          "</div>"
              +          "<div id='voice_comment_area_"+ w_voice_id + "'>"
              +          "</div>"
              +      "</div>"
              +  "</div>"
            )

            /* ------------------------------------------ */
            /* [ボイスコメント]ヘッダー押下                        */
            /* ------------------------------------------ */
            $(document).off('click', '#voice_boxh_' + w_voice_id )
            $(document).on('click', '#voice_boxh_' + w_voice_id , function(){
                if ($('#voice_box_' + w_voice_id).hasClass('collapsed-box')) {
                  $('#voice_comment_area_' + w_voice_id).empty()
                  $('#voice_my_comment_area_' + w_voice_id).empty()
                  $('#voice_my_comment_area_' + w_voice_id).append(
                           "<div class='direct-chat-msg right'>"
                    +          "<div class='direct-chat-info clearfix'>"
                    +               "<span class='direct-chat-name pull-right'>"
                    +                    _LOGIN_USER_NM
                    +               "</span>"
                    +          "</div>"
                    +          "<img class='direct-chat-img' src='/static/img/user/" + _LOGIN_USER_IMG + "'>"
                    +          "<div class='direct-chat-text'>"
                    +              "<div class='emoji-picker-container'>"
                    +                  "<textarea id='text_send_voice_comment_" + w_voice_id + "' rows=2 placeholder='コメントを入力...' class='form-control' data-emojiable='true'></textarea>"
                    +                  "<div style='text-align:left'>"
                    +                     "<button id='voice_comment_text_size_chg_" + w_voice_id + "' type='button' style='margin-top:5px;border-radius:10px' class='btn btn-primary btn-flat'><i class='fa fa-angle-double-down'></i></button>"
                    +                     "<button id='btn_send_voice_comment_" + w_voice_id + "' type='button' style='float:right;margin:5px;border-radius:10px' class='btn btn-primary btn-flat'>送信</button>"
                    +                  "</div>"
                    +              "</div>"
                    +          "</div>"
                    +      "</div>"
                  )
                  // [ボイスコメント]テキスト幅
                  window.emojiPicker.discover();
                  $("#voice_comment_text_size_chg_" + w_voice_id).on('click', function () {
                      var w_height = $("#text_send_voice_comment_" + w_voice_id).next().height()
                      if ( w_height > 55) {
                          $("#voice_comment_text_size_chg_" + w_voice_id).empty()
                          $("#voice_comment_text_size_chg_" + w_voice_id).append("<i class='fa fa-angle-double-down'></i>")
                          $("#text_send_voice_comment_" + w_voice_id).next().height(35)
                      } else {
                          $("#voice_comment_text_size_chg_" + w_voice_id).empty()
                          $("#voice_comment_text_size_chg_" + w_voice_id).append("<i class='fa fa-angle-double-up'></i>")
                          $("#text_send_voice_comment_" + w_voice_id).next().height(275)
                      }
                  })
                  // ボイスコメント取得
                  _SOK.emit('sok_srv_get_voice_comment', {
                     target_voice_id: w_voice_id
                  });
                }
            });

            /* ------------------------------------------ */
            /* [ボイスコメント]送信ボタン押下                     */
            /* ------------------------------------------ */
            $(document).off('click', '#btn_send_voice_comment_' + w_voice_id )
            $(document).on('click', '#btn_send_voice_comment_' + w_voice_id , function(){
                voice_comment = escapeHTML($("#text_send_voice_comment_" + w_voice_id).val())
                if (voice_comment != "") {
                    // ボイスコメント登録
                    _SOK.emit('sok_srv_add_voice_comment', {
                        voice_comment: encodeURIComponent(voice_comment)
                       ,target_voice_id: w_voice_id
                    });
                }
                return false;
            });

            /* ------------------------------------------ */
            /* [ボイス]ホバー設定                             */
            /* ------------------------------------------ */
            $("#voice_boxh_" + w_voice_id).hover(
              function () {
                $(this).css("background","#EEEEEE");
              },
              function () {
                $(this).css("background","#fff");
              }
            );
         }
    });

    /* ------------------------------------------ */
    /* [ボイス]続きを読込むボタン                        */
    /* ------------------------------------------ */
     _SOK.on('sok_cli_res_get_voice_read_more_btn', function(msg) {
        var w_org_id   = msg.org_id
        var w_user_id  = msg.user_id
        var w_voice_id = msg.voice_id
        if ( _LOGIN_ORG_ID == w_org_id && _LOGIN_USER_ID == w_user_id ) {
            $('div#my_voice').append(
                "<div id='voice_read_more_" + w_voice_id + "_" + w_org_id + "_" + w_user_id + "' style='text-align:center'>"
             +     "<button type='button' class='btn btn-primary btn-box-tool' style='color:white; border: 1px solid #BBBBBB ;width:100%;margin-bottom:20px'>"
             +         "更に読込む"
             +     "</button>"
             +  "</div>"
            )
            $('#voice_read_more_' + w_voice_id + "_" + w_org_id + "_" + w_user_id).on('click', function () {
                $('#voice_read_more_' + w_voice_id + "_" + w_org_id + "_" + w_user_id).remove();
                _SOK.emit('sok_srv_get_voice', {
                     voice_id:  this.id.split("_")[3]
                    ,org_id:  this.id.split("_")[4]
                    ,user_id: this.id.split("_")[5]
                });
            })
        } else {
            $('div#voice').append(
                "<div id='voice_read_more_" + w_voice_id + "_" + w_org_id + "_" + w_user_id + "' style='text-align:center'>"
             +     "<button type='button' class='btn btn-primary btn-box-tool' style='color:white;border: 1px solid #BBBBBB ;width:100%;margin-bottom:20px'>"
             +         "更に読込む"
             +     "</button>"
             +  "</div>"
            )
            $('#voice_read_more_' + w_voice_id + "_" + w_org_id + "_" + w_user_id).on('click', function () {
                $('#voice_read_more_' + w_voice_id + "_" + w_org_id + "_" + w_user_id).remove();
                _SOK.emit('sok_srv_get_voice', {
                     voice_id:  this.id.split("_")[3]
                    ,org_id:  this.id.split("_")[4]
                    ,user_id: this.id.split("_")[5]
                });
            })
        }
    })
    /* ------------------------------------------ */
    /* [トーク]続きを読込むボタン                        */
    /* ------------------------------------------ */
     _SOK.on('sok_cli_res_get_talk_read_more_btn', function(msg) {
        var w_org_id   = msg.org_id
        var w_user_id  = msg.user_id
        var w_talk_id = msg.talk_id
        $('div#talk').append(
            "<div id='talk_read_more_" + w_talk_id + "_" + w_org_id + "_" + w_user_id + "' style='text-align:center'>"
         +     "<button type='button' class='btn btn-primary btn-box-tool' style='color:white;border: 1px solid #BBBBBB ;width:100%;margin-bottom:20px'>"
         +         "更に読込む"
         +     "</button>"
         +  "</div>"
        )
        $('#talk_read_more_' + w_talk_id + "_" + w_org_id + "_" + w_user_id).on('click', function () {
            $('#talk_read_more_' + w_talk_id + "_" + w_org_id + "_" + w_user_id).remove();
            _SOK.emit('sok_srv_get_talk', {
                 talk_id:  this.id.split("_")[3]
                ,org_id:  this.id.split("_")[4]
                ,user_id: this.id.split("_")[5]
            });
        })
    })
    /* ------------------------------------------ */
    /* [グループトーク]続きを読込むボタン                   */
    /* ------------------------------------------ */
     _SOK.on('sok_cli_res_get_grp_talk_read_more_btn', function(msg) {
        var w_grp_id  = msg.grp_id
        var w_grp_talk_id = msg.grp_talk_id
        $('div#grp_talk').append(
            "<div id='grp_talk_read_more_" + w_grp_talk_id + "_" + w_grp_id + "' style='text-align:center'>"
         +     "<button type='button' class='btn btn-primary btn-box-tool' style='color:white;border: 1px solid #BBBBBB ;width:100%;margin-bottom:20px'>"
         +         "更に読込む"
         +     "</button>"
         +  "</div>"
        )
        $('#grp_talk_read_more_' + w_grp_talk_id + "_" + w_grp_id).on('click', function () {
            $('#grp_talk_read_more_' + w_grp_talk_id + "_" + w_grp_id).remove();
            _SOK.emit('sok_srv_get_grp_talk', {
                 grp_talk_id:  this.id.split("_")[4]
                ,grp_id:  this.id.split("_")[5]
            });
        })
    })

    /* ------------------------------------------ */
    /* [ボイスコメント]ボイスコメント受信イベント               */
    /* ------------------------------------------ */
     _SOK.on('sok_cli_res_get_voice_comment', function(msg) {
        var w_voice_comment_org_id            = msg.voice_comment_org_id
        var w_voice_comment_user_id           = msg.voice_comment_user_id
        var w_voice_comment_user_nm           = msg.voice_comment_user_nm
        if (!msg.voice_comment_profile_img_file) {
            var w_voice_comment_profile_img_file = "noimage.png"
        } else {
            var w_voice_comment_profile_img_file = msg.voice_comment_profile_img_file
        }
        var w_voice_org_id            = msg.voice_org_id
        var w_voice_user_id           = msg.voice_user_id
        var w_voice_user_nm           = msg.voice_user_nm
        if (!msg.voice_profile_img_file) {
            var w_voice_profile_img_file = "noimage.png"
        } else {
            var w_voice_profile_img_file = msg.voice_profile_img_file
        }
        var w_voice_id          = msg.voice_id
        var w_voice_comment_dtm = msg.voice_comment_dtm
        var w_voice_comment     = msg.voice_comment
        var w_voice_comment     = w_voice_comment.replace(/\r?\n/g, '<br>');
        var w_voice_comment     =   window.emojiPicker.appendUnicodeAsImageToElement($("#EMOJI_DUMMY"),w_voice_comment)
        /* ------------------------------------------ */
        /* [ボイスコメント]ボイスコメント配置                    */
        /* ------------------------------------------ */

        // コメントしたユーザー自身
        if ( _LOGIN_ORG_ID == w_voice_comment_org_id && _LOGIN_USER_ID == w_voice_comment_user_id) {
            // コメント送信フォームを削除する
            $('#voice_my_comment_area_' + w_voice_id).empty()
            // コメントを追加
            $('#voice_my_comment_area_' + w_voice_id).append(
                 "<div class='direct-chat-msg right'>"
              +      "<div class='direct-chat-info clearfix'>"
              +          "<span class='direct-chat-name pull-right'>"
              +          w_voice_comment_user_nm
              +          "</span>"
              +          "<span class='direct-chat-timestamp pull-left'>"
              +          w_voice_comment_dtm
              +          "</span>"
              +      "</div>"
              +      "<img class='direct-chat-img mCS_img_loaded' src='/static/img/user/" + w_voice_comment_profile_img_file + "'>"
              +      "<div class='direct-chat-text'>"
              +           w_voice_comment
              +      "</div>"
              +  "</div>"
            )
        // 個人のコメント取得
        } else if ( _LOGIN_ORG_ID == w_voice_org_id && _LOGIN_USER_ID == w_voice_user_id) {
            $('#my_voice_comment_area_' + w_voice_id).append(
                 "<div class='direct-chat-msg right'>"
              +      "<div class='direct-chat-info clearfix'>"
              +          "<span class='direct-chat-name pull-right'>"
              +          w_voice_comment_user_nm
              +          "</span>"
              +          "<span class='direct-chat-timestamp pull-left'>"
              +          w_voice_comment_dtm
              +          "</span>"
              +      "</div>"
              +      "<img class='direct-chat-img mCS_img_loaded' src='/static/img/user/" + w_voice_comment_profile_img_file + "'>"
              +      "<div class='direct-chat-text'>"
              +           w_voice_comment
              +      "</div>"
              +  "</div>"
            )
        } else {
            $('#voice_comment_area_' + w_voice_id).append(
                 "<div class='direct-chat-msg right'>"
              +      "<div class='direct-chat-info clearfix'>"
              +          "<span class='direct-chat-name pull-right'>"
              +          w_voice_comment_user_nm
              +          "</span>"
              +          "<span class='direct-chat-timestamp pull-left'>"
              +          w_voice_comment_dtm
              +          "</span>"
              +      "</div>"
              +      "<img class='direct-chat-img mCS_img_loaded' src='/static/img/user/" + w_voice_comment_profile_img_file + "'>"
              +      "<div class='direct-chat-text'>"
              +           w_voice_comment
              +      "</div>"
              +  "</div>"
            )
        }
    });

    /* ------------------------------------------ */
    /* [ボイス]ボイス追加イベント                        */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_res_add_voice', function(msg) {
        var w_voice_org_id  = msg.voice_org_id
        var w_voice_user_id = msg.voice_user_id
        var w_voice         = msg.voice
        var w_voice         = w_voice.replace(/\r?\n/g, '<br>');
        var w_voice         = window.emojiPicker.appendUnicodeAsImageToElement($("#EMOJI_DUMMY"),w_voice)
        var w_voice_dtm     = msg.now_dtm
        var w_voice_id      = msg.voice_id
        /* ------------------------------------------ */
        /* [ボイス][個人]ボイス配置                        */
        /* ------------------------------------------ */
        if ( _LOGIN_ORG_ID == w_voice_org_id && _LOGIN_USER_ID == w_voice_user_id ) {
            $('div#my_voice').prepend(

                "<div id='my_voice_box_" + w_voice_id + "' class='box collapsed-box' style='margin-bottom: 10px;border:solid 1px #BBBBBB'>"
              +      "<div id='my_voice_boxh_" + w_voice_id + "' class='box-header' data-widget='collapse'>"
              +          "<span class='text-muted' style='margin-left: 10px'>"
              +              "<small>" + w_voice_dtm + "</small>"
              +          "</span>"
              +          "<img style='margin-left:5px;' class='img-circle img-sm' src='/static/img/user/" + _LOGIN_USER_IMG + "'>"
              +          "<div style='margin-left:45px'>"
              +              "<span>"+ w_voice + "</span>"
              +          "</div>"
              +          "<div class='box-tools'>"
              +              "<i class='fa fa-retweet' aria-hidden='true'></i> 0"
              +          "</div>"
              +      "</div>"
              +      "<div id='my_voice_boxb_" + w_voice_id + "' class='box-body'>"
              +          "<div id='my_voice_comment_area_"+ w_voice_id + "'>"
              +          "</div>"
              +      "</div>"
              +  "</div>"
            );
            $("#text_send_voice").next().empty();
            $("#my_voice_boxh_" + w_voice_id).hover(
              function () {
                $(this).css("background","#EEEEEE");
              },
              function () {
                $(this).css("background","#fff");
              }
            );

        /* ------------------------------------------ */
        /* [ボイス][ユーザーBOX]ログインユーザー宛のお知らせ      */
        /* ------------------------------------------ */
        } else {
            var cnt = 1
            if ($('#voice_info_' + w_voice_org_id + '_' + w_voice_user_id)[0]) {
                str_cnt = $('#voice_info_' + w_voice_org_id + '_' + w_voice_user_id).text()
                cnt = Number(str_cnt) + 1;
            } else {
                $('#user_box_tool_' + w_voice_org_id + '_' + w_voice_user_id).append(
                    "<span id='voice_info_" + w_voice_org_id + "_" + w_voice_user_id+ "'"
                  + "class='label label-info'>"
                  + "</span>"
                )
            }
            $('#voice_info_' + w_voice_org_id + '_' + w_voice_user_id).empty()
            $('#voice_info_' + w_voice_org_id + '_' + w_voice_user_id).append(cnt)
        }
    });


    /* ------------------------------------------ */
    /* [ボイスコメント]ボイスコメント追加イベント               */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_res_add_voice_comment', function(msg) {
        var w_voice_id          = msg.voice_id
        var w_comment_org_id    = msg.comment_org_id
        var w_comment_user_id   = msg.comment_user_id
        var w_voice_comment     = msg.voice_comment
        var w_voice_comment     = w_voice_comment.replace(/\r?\n/g, '<br>');
        var w_voice_comment     =   window.emojiPicker.appendUnicodeAsImageToElement($("#EMOJI_DUMMY"),w_voice_comment)
        var w_voice_comment_dtm = msg.now_dtm
        /* ------------------------------------------ */
        /* [ボイスコメント]送信フォーム削除、コメント配置           */
        /* ------------------------------------------ */
        if ( _LOGIN_ORG_ID == w_comment_org_id && _LOGIN_USER_ID == w_comment_user_id ) {
            $('#voice_my_comment_area_' + w_voice_id).empty()
            $('#voice_my_comment_area_' + w_voice_id).append(
                 "<div class='direct-chat-msg right'>"
              +      "<div class='direct-chat-info clearfix'>"
              +          "<span class='direct-chat-name pull-right'>"
              +          _LOGIN_USER_NM
              +          "</span>"
              +          "<span class='direct-chat-timestamp pull-left'>"
              +          w_voice_comment_dtm
              +          "</span>"
              +      "</div>"
              +      "<img class='direct-chat-img' src='/static/img/user/" + _LOGIN_USER_IMG + "'>"
              +      "<div class='direct-chat-text'>"
              +           w_voice_comment
              +      "</div>"
              +  "</div>"
            )
        /* ------------------------------------------ */
        /* [ボイスコメント]コメント者以外                      */
        /* ------------------------------------------ */
        } else {
            /* Pendding */
        }
    });

    /* ------------------------------------------ */
    /* [トーク]トーク受信イベント                        */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_res_talk', function(msg) {
　       $('#talk_not_exist_msg').empty();
        var w_org_id           =   msg.org_id
        var w_org_nm           =   msg.org_nm
        var w_user_id          =   msg.user_id
        var w_user_nm          =   msg.user_nm
        if (!msg.profile_img_file) {
            var w_profile_img_file = "noimage.png"
        } else {
            var w_profile_img_file = msg.profile_img_file
        }
        var w_talk_id  =   msg.talk_id
        var w_talk_dtm =   msg.talk_dtm
        var w_talk     =   msg.talk
        var w_talk     =   w_talk.replace(/\r?\n/g, '<br>');
        var w_talk     =   window.emojiPicker.appendUnicodeAsImageToElement($("#EMOJI_DUMMY"),w_talk)

        var w_position =   msg.position
        /* ------------------------------------------ */
        /* [トーク][トークBOX]ログインユーザーではないトーク配置     */
        /* ------------------------------------------ */
        if (w_position == 'left') {
            $('div#talk').append(
                 "<div id='left_talk' class='direct-chat-msg'>"
              +     "<div class='direct-chat-info clearfix'>"
              +         "<span class='direct-chat-name pull-left'>" + w_user_nm + "</span>"
              +         "<span class='direct-chat-timestamp pull-right'>" + w_talk_dtm + "</span>"
              +     "</div>"
              +     "<img class='direct-chat-img' src='/static/img/user/" + w_profile_img_file + "'>"
              +     "<div class='direct-chat-text'>"
              +         w_talk
              +     "</div>"
              +  "</div>"
            );
        /* ------------------------------------------ */
        /* [トーク][トークBOX]ログインユーザーのトーク配置         */
        /* ------------------------------------------ */
        } else {
            $('div#talk').append(
                "<div id='right_talk' class='direct-chat-msg right'>"
              +     "<div class='direct-chat-info clearfix'>"
              +         "<span class='direct-chat-name pull-right'>" + _LOGIN_USER_NM + "</span>"
              +         "<span class='direct-chat-timestamp pull-left'>" + w_talk_dtm + "</span>"
              +     "</div>"
              +     "<img class='direct-chat-img' src='/static/img/user/" + w_profile_img_file + "'>"
              +     "<div class='direct-chat-text'>"
              +         w_talk
              +     "</div>"
              + "</div>"
            );
        }

    });
    /* ------------------------------------------ */
    /* [トーク]トーク追加イベント                         */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_add_talk', function(msg) {
         var w_talk         = msg.talk
         var w_talk         = w_talk.replace(/\r?\n/g, '<br>');
         var w_talk         =   window.emojiPicker.appendUnicodeAsImageToElement($("#EMOJI_DUMMY"),w_talk)
         var w_now_dtm      = msg.now_dtm
         var w_send_org_id  = msg.send_org_id
         var w_send_user_id = msg.send_user_id
         var w_send_user_nm = msg.send_user_nm
         if (!msg.send_user_img) {
             var w_send_user_img = "noimage.png"
         } else {
             var w_send_user_img = msg.send_user_img
         }
         var w_resv_org_id   = msg.resv_org_id
         var w_resv_user_id  = msg.resv_user_id
        /* ------------------------------------------ */
        /* [トーク][トークBOX]ログインユーザーが送信したトーク配置   */
        /* ------------------------------------------ */
        if ( (_LOGIN_ORG_ID == w_send_org_id) && (_LOGIN_USER_ID == w_send_user_id)) {
   　       $('#talk_not_exist_msg').empty();
            $('div#new_talk').prepend(
                "<div id='right_talk' class='direct-chat-msg right'>"
              +     "<div class='direct-chat-info clearfix'>"
              +         "<span class='direct-chat-name pull-right'>" + _LOGIN_USER_NM + "</span>"
              +         "<span class='direct-chat-timestamp pull-left'>" + w_now_dtm + "</span>"
              +     "</div>"
              +     "<img class='direct-chat-img' src='/static/img/user/" + _LOGIN_USER_IMG + "'>"
              +     "<div class='direct-chat-text'>"
              +         w_talk
              +     "</div>"
              + "</div>"
            );
            $("#text_send_talk").next().empty();
        }
        /* ------------------------------------------ */
        /* [トーク][ユーザーBOX]ログインユーザーあてのお知らせ      */
        /* ------------------------------------------ */
        if ( (_LOGIN_ORG_ID == w_resv_org_id) && (_LOGIN_USER_ID == w_resv_user_id)) {
            if ((_SELECT_ORG_ID == w_send_org_id) && (_SELECT_USER_ID == w_send_user_id)) {
                // トークBOX
                $('#talk_not_exist_msg').empty();
                $('div#new_talk').prepend(
                     "<div id='left_talk' class='direct-chat-msg'>"
                  +     "<div class='direct-chat-info clearfix'>"
                  +         "<span class='direct-chat-name pull-left'>" + w_send_user_nm + "</span>"
                  +         "<span class='direct-chat-timestamp pull-right'>" + w_now_dtm + "</span>"
                  +     "</div>"
                  +     "<img class='direct-chat-img' src='/static/img/user/" + w_send_user_img + "'>"
                  +     "<div class='direct-chat-text'>"
                  +         w_talk
                  +     "</div>"
                  +  "</div>"
                );
                // 効果音
                if (_MY_DEVICE == 'other') {
                    var audio = new Audio('/static/audio/notice_talk_2.mp3');
                    audio.load();
                    audio.play();
                } else {
                }

            } else {
                // ユーザーBOX 未読件数
                var cnt = 1
                if ($('#talk_info_' + w_send_org_id + '_' + w_send_user_id)[0]) {
                    str_cnt = $('#talk_info_' + w_send_org_id + '_' + w_send_user_id).text()
                    cnt = Number(str_cnt) + 1;
                } else {
                    $('#user_box_tool_' + w_send_org_id + '_' + w_send_user_id).append(
                        "<span id='talk_info_" + w_send_org_id + "_" + w_send_user_id+ "'"
                      + "class='label label-warning'>"
                      + "</span>"
                    )
                }
                $('#talk_info_' + w_send_org_id + '_' + w_send_user_id).empty()
                $('#talk_info_' + w_send_org_id + '_' + w_send_user_id).append(cnt)


                if (_MY_DEVICE == 'other') {
                    // デスクトップ通知
                    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
                    // PC 通知許可あり
                    if (Notification.permission !== 'denied') {
                      Notification.requestPermission(function (permission) {
                        // ユーザが許可した場合は、通知を作成する
                        if (permission === "granted") {
                            var n = new Notification(
                                 "トークを受信しました"
                                ,{
                                 body: w_send_user_nm + "\r\n" + w_talk.substr(0,20)
                                ,icon: "/static/img/manyone_icon.ico"
                                }
                            );
                            _EFFECT_SOUND = new Audio('/static/audio/notise_talk.mp3');
                            _EFFECT_SOUND.load();
                            _EFFECT_SOUND.play();
                        }
                      });
                    // PC 通知許可なし
                    } else {
                    }
                } else {
                    // スマホ
                    alert(w_user_nm + "からトークを受信しました")
                }
            }

        }
    });

    /* ------------------------------------------ */
    /* [トーク]送信ボタン押下                           */
    /* ------------------------------------------ */
    $(document).on('click', '#btn_send_talk', function(){
        talk = escapeHTML($("#text_send_talk").val())
        if (talk != "") {
            _SOK.emit('sok_srv_add_talk', {
                talk: encodeURIComponent(talk)
               ,target_org_id: _SELECT_ORG_ID
               ,target_user_id: _SELECT_USER_ID
            });
        }
        return false;
    });
    /* ------------------------------------------ */
    /* [グループトーク]送信ボタン押下                     */
    /* ------------------------------------------ */
    $(document).on('click', '#btn_send_grp_talk', function(){
        grp_talk = escapeHTML($("#text_send_grp_talk").val())
        if (grp_talk != "") {
            _SOK.emit('sok_srv_add_grp_talk', {
                grp_talk: encodeURIComponent(grp_talk)
               ,target_grp_id: _SELECT_GRP_ID
            });
        }
        return false;
    });
    /* ------------------------------------------ */
    /* [ボイス個人]送信フォーム                         */
    /* ------------------------------------------ */
    $('div#send_my_voice').append(
         "<div style='border:1px solid #BBBBBB; padding:5px;margin-bottom:5px;background-color:#d2d6de;border-radius:3px'>"
        +    "<div class='emoji-picker-container'>"
        +         "<textarea id='text_send_voice' rows=2 placeholder='ボイスを入力...' class='form-control' data-emojiable='true'></textarea>"
        +         "<div style='text-align:left'>"
        +            "<button id='voice_text_size_chg' type='button' style='margin-top:5px;border-radius:10px' class='btn btn-primary btn-flat'><i class='fa fa-angle-double-down'></i></button>"
        +            "<button id='btn_send_voice' type='button' style='float:right;margin:5px;border-radius:10px' class='btn btn-primary btn-flat'>送信</button>"
        +         "</div>"
        +     "</div>"
        + "</div>"
    );
    window.emojiPicker.discover();
    // [ボイス]テキスト幅
    $("#voice_text_size_chg").on('click', function () {
        var w_height = $("#text_send_voice").next().height()
        if ( w_height > 55) {
            $("#voice_text_size_chg").empty()
            $("#voice_text_size_chg").append("<i class='fa fa-angle-double-down'></i>")
            $("#text_send_voice").next().height(35)
        } else {
            $("#voice_text_size_chg").empty()
            $("#voice_text_size_chg").append("<i class='fa fa-angle-double-up'></i>")
            $("#text_send_voice").next().height(275)
        }
    })

    /* ------------------------------------------ */
    /* [ボイス個人]ボイス取得処理                       */
    /* ------------------------------------------ */
    _SOK.emit('sok_srv_get_voice', {
         org_id:  _LOGIN_ORG_ID
        ,user_id: _LOGIN_USER_ID
        ,voice_id: ""
    });
    /* ------------------------------------------ */
    /* [ボイス個人]送信ボタン押下                       */
    /* ------------------------------------------ */
    $(document).on('click', '#btn_send_voice', function(){
        voice = escapeHTML($("#text_send_voice").val())
        if (voice != "") {
            $("#text_send_voice").val("");
            _SOK.emit('sok_srv_add_voice', {
                voice: encodeURIComponent(voice)
            });
        }
        return false;
    });

    /* ------------------------------------------ */
    /* [グループ]グループメンバー受信イベント                */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_get_grp_user', function(msg) {
        $('#grp_user_not_exist_msg').empty();
        var w_grp_id           =   msg.grp_id
        var w_org_id           =   msg.org_id
        var w_user_id          =   msg.user_id
        var w_user_nm          =   msg.user_nm
        if (!msg.profile_img_file) {
            var w_profile_img_file = "noimage.png"
        } else {
            var w_profile_img_file = msg.profile_img_file
        }
        var w_auth_cd =   msg.auth_cd
        var w_status  =   msg.status
        if (w_status == 'ONLINE') {
            var w_status_html  =   "<small class='label label-primary'>ログイン中</small>"
        } else {
            var w_status_html  =   "<small class='label bg-gray'>ログアウト</small>"
        }

        $('#select_talk_info_list').append(
               "<li class='item' style='padding:0px;'>"
            +      "<div id='grp_user_boxhb_" + w_org_id + "_" + w_user_id + "' class='box collapsed-box' style='margin-bottom: 0px;border-top:none'>"
            +      "<div id='grp_user_boxh_" + w_org_id + "_" + w_user_id + "' class='box-header'>"
            +          "<div class='user-block fa-minus'>"
            +              "<img class='img-circle mCS_img_loaded' src='/static/img/user/"+ w_profile_img_file + "' onerror='this.src=\"/static/img/user/noimage.png\"'>"
            +              "<span class='username' style='color: black'>"
            +                  w_user_nm
            +              "</span>"
            +              "<span class='description'>"
            +                  "<span id='grp_user_box_status_" + w_org_id + "_" + w_user_id + "' style='overflow:hidden; white-space:nowrap; width:300px; height:20px; text-overflow:ellipsis;'>"
            +                      w_status_html
            +                  "</span>"
            +              "</span>"
            +          "</div>"
            +          "<div id='grp_user_box_tool_" + w_org_id + "_" + w_user_id + "' class='box-tools'></div>"
            +      "</div>"
            +  "</li>"
        )
    });

    /* ------------------------------------------ */
    /* [グループ]グループトーク受信イベント                */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_get_grp_talk', function(msg) {
        $('#grp_talk_not_exist_msg').empty();
        var w_grp_id           =   msg.grp_id
        var w_org_id           =   msg.org_id
        var w_user_id          =   msg.user_id
        var w_user_nm          =   msg.user_nm
        if (!msg.profile_img_file) {
            var w_profile_img_file = "noimage.png"
        } else {
            var w_profile_img_file = msg.profile_img_file
        }
        var w_grp_talk         =   msg.grp_talk
        var w_grp_talk         =   w_grp_talk.replace(/\r?\n/g, '<br>');
        var w_grp_talk         =   window.emojiPicker.appendUnicodeAsImageToElement($("#EMOJI_DUMMY"),w_grp_talk)
        var w_grp_talk_dtm     =   msg.grp_talk_dtm

        /* ------------------------------------------ */
        /* [グループ][グループトーク]ログインユーザー              */
        /* ------------------------------------------ */
        if ( w_org_id == _LOGIN_ORG_ID　&& w_user_id == _LOGIN_USER_ID) {
            $('#grp_talk').append(
                "<div class='direct-chat-msg right'>"
              +     "<div class='direct-chat-info clearfix'>"
              +         "<span class='direct-chat-name pull-right'>" + _LOGIN_USER_NM + "</span>"
              +         "<span class='direct-chat-timestamp pull-left'>" + w_grp_talk_dtm + "</span>"
              +     "</div>"
              +     "<img class='direct-chat-img' src='/static/img/user/" + _LOGIN_USER_IMG + "'>"
              +     "<div class='direct-chat-text'>"
              +         w_grp_talk
              +     "</div>"
              + "</div>"
            );
        /* ------------------------------------------ */
        /* [グループ][グループトーク]ログインユーザー以外          */
        /* ------------------------------------------ */
        } else {
            $('#grp_talk').append(
                 "<div class='direct-chat-msg'>"
              +     "<div class='direct-chat-info clearfix'>"
              +         "<span class='direct-chat-name pull-left'>" + w_user_nm + "</span>"
              +         "<span class='direct-chat-timestamp pull-right'>" + w_grp_talk_dtm + "</span>"
              +     "</div>"
              +     "<img class='direct-chat-img' src='/static/img/user/" + w_profile_img_file + "'>"
              +     "<div class='direct-chat-text'>"
              +         w_grp_talk
              +     "</div>"
              +  "</div>"
            );
        }

    });


    /* ------------------------------------------ */
    /* [グループトーク]グループトーク追加イベント              */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_add_grp_talk', function(msg) {
         var w_grp_id   = msg.grp_id
         var w_grp_talk = msg.grp_talk
         var w_grp_talk = w_grp_talk.replace(/\r?\n/g, '<br>');
         var w_grp_talk = window.emojiPicker.appendUnicodeAsImageToElement($("#EMOJI_DUMMY"),w_grp_talk)
         var w_now_dtm  = msg.now_dtm
         var w_org_id   = msg.org_id
         var w_user_id  = msg.user_id
         var w_user_nm  = msg.user_nm
         if (!msg.user_img) {
             var w_user_img = "noimage.png"
         } else {
             var w_user_img = msg.send_user_img
         }
         console.log(w_grp_talk)
        /* ------------------------------------------ */
        /* [グループトークBOX]ログインユーザーが送信したトーク配置   */
        /* ------------------------------------------ */
        if ( _LOGIN_ORG_ID == w_org_id && _LOGIN_USER_ID == w_user_id) {
   　       $('#grp_talk_not_exist_msg').empty();
            $('#new_grp_talk').prepend(
                "<div class='direct-chat-msg right'>"
              +     "<div class='direct-chat-info clearfix'>"
              +         "<span class='direct-chat-name pull-right'>" + _LOGIN_USER_NM + "</span>"
              +         "<span class='direct-chat-timestamp pull-left'>" + w_now_dtm + "</span>"
              +     "</div>"
              +     "<img class='direct-chat-img' src='/static/img/user/" + _LOGIN_USER_IMG + "'>"
              +     "<div class='direct-chat-text'>"
              +         w_grp_talk
              +     "</div>"
              + "</div>"
            );
            $("#text_send_grp_talk").next().empty();
        /* ------------------------------------------ */
        /* [グループユーザーBOX]ログインユーザーあてのお知らせ      */
        /* ------------------------------------------ */
        } else if (_SELECT_GRP_ID == w_grp_id) {
                // トークBOX
                $('#grp_talk_not_exist_msg').empty();
                $('#new_grp_talk').prepend(
                     "<div class='direct-chat-msg'>"
                  +     "<div class='direct-chat-info clearfix'>"
                  +         "<span class='direct-chat-name pull-left'>" + w_user_nm + "</span>"
                  +         "<span class='direct-chat-timestamp pull-right'>" + w_now_dtm + "</span>"
                  +     "</div>"
                  +     "<img class='direct-chat-img' src='/static/img/user/" + w_user_img + "'>"
                  +     "<div class='direct-chat-text'>"
                  +         w_grp_talk
                  +     "</div>"
                  +  "</div>"
                );
                // 効果音
                var audio = new Audio('/static/audio/notice_talk_2.mp3');
                audio.play();
        }
    });

    /* ==========================================
      _MY_MEDIA_TYPE
        VIDEO       : 音声とビデオ
        AUDIO       : 音声のみ
        SCREEN      : 画面共有
        SCREEN_AUDIO: 画面共有+音声通話
        DATA_SEND   : データ送信
       ========================================== */
    /* ------------------------------------------ */
    /* [音声通話]ボタンクリックイベント                     */
    /* ------------------------------------------ */
    $("[id^=start_audio_only_]").on('click',function() {
        _MY_MEDIA_TYPE = 'AUDIO'
        var w_org_id   = this.id.split("_")[3]
        var w_user_id  = this.id.split("_")[4]

        // 対象ユーザーのピアID取得
        _SOK.emit('sok_cli_index_video_get_target_peer_id', {
             org_id  : w_org_id
            ,user_id : w_user_id
        });

        // メディアタイプを登録
        _SOK.emit('sok_cli_index_video_call_ini', {
             resv_org_id  : w_org_id
            ,resv_user_id : w_user_id
            ,call_type    : _MY_MEDIA_TYPE
        });

    })

    /* ------------------------------------------ */
    /* [ビデオ通話]ボタンクリックイベント                     */
    /* ------------------------------------------ */
    $("[id^=start_video_]").on('click',function() {
        _MY_MEDIA_TYPE = 'VIDEO'
        var w_org_id   = this.id.split("_")[2]
        var w_user_id  = this.id.split("_")[3]
        // 対象ユーザーのピアID取得
        _SOK.emit('sok_cli_index_video_get_target_peer_id', {
             org_id  : w_org_id
            ,user_id : w_user_id
        });

        // メディアタイプを登録
        _SOK.emit('sok_cli_index_video_call_ini', {
             resv_org_id  : w_org_id
            ,resv_user_id : w_user_id
            ,call_type    : _MY_MEDIA_TYPE
        });

    })

    /* ------------------------------------------ */
    /* [画面共有]ボタンクリックイベント                     */
    /* ------------------------------------------ */
    $("[id^=start_screen_only_]").on('click', function () {
        _MY_MEDIA_TYPE = 'SCREEN'
        var w_org_id   = this.id.split("_")[3]
        var w_user_id  = this.id.split("_")[4]
        // 対象ユーザーのピアID取得
        _SOK.emit('sok_cli_index_video_get_target_peer_id', {
             org_id  : w_org_id
            ,user_id : w_user_id
        });

        // メディアタイプを登録
        _SOK.emit('sok_cli_index_video_call_ini', {
             resv_org_id  : w_org_id
            ,resv_user_id : w_user_id
            ,call_type    : _MY_MEDIA_TYPE
        });
    });

    /* ------------------------------------------ */
    /* [画面共有+音声通話]ボタンクリックイベント             */
    /* ------------------------------------------ */
    $("[id^=start_screen_audio_]").on('click', function () {
        _MY_MEDIA_TYPE = 'SCREEN_AUDIO'
        var w_org_id   = this.id.split("_")[3]
        var w_user_id  = this.id.split("_")[4]
        // 対象ユーザーのピアID取得
        _SOK.emit('sok_cli_index_video_get_target_peer_id', {
             org_id  : w_org_id
            ,user_id : w_user_id
        });

        // メディアタイプを登録
        _SOK.emit('sok_cli_index_video_call_ini', {
             resv_org_id  : w_org_id
            ,resv_user_id : w_user_id
            ,call_type    : _MY_MEDIA_TYPE
        });
    });

    /* ------------------------------------------ */
    /* [データ送信]ボタンクリックイベント                    */
    /* ------------------------------------------ */
    $("[id^=start_data_send_]").on('click', function () {
        $('#readfile').click();
        _MY_MEDIA_TYPE = 'DATA_SEND'
        var w_org_id   = this.id.split("_")[3]
        var w_user_id  = this.id.split("_")[4]
        // 対象ユーザーのピアID取得
        _SOK.emit('sok_cli_index_sendfile_get_target_peer_id', {
             org_id  : w_org_id
            ,user_id : w_user_id
        });
    });
    /* ------------------------------------------ */
    /* [データ送信]ファイル選択後イベント                  */
    /* ------------------------------------------ */
    $('#readfile').change(function(e) {
        var files    = e.target.files;
        var oFile    = files[0];
        var filename = files[0].name;
        var filesize = files[0].size;
        var filesize = megabyteFormat(filesize, 2);
        var reader   = new FileReader();
        reader.readAsArrayBuffer(oFile);
        // オーバーレイ
        swal({
             title: '<i class="fa fa-refresh fa-spin fa-3x"></i><br><br>データ送信中です'
            ,showConfirmButton: false
            ,showCancelButton: false
            ,allowOutsideClick: false
            ,allowEscapeKey: false
            ,allowEnterKey: false
        }).then(function () {} ,function (dismiss) {
            // Pending...
            if (dismiss === 'cancel') {
                fnc_unset_overlay()
            }
        })
        //ファイル読込成功イベント
        reader.onload = function(evt) {
            fnc_unset_overlay()
            var w_arr_buffer = []
            w_arr_buffer.push(reader.result)
            w_arr_buffer.push(filename)
            w_arr_buffer.push(filesize)
            w_arr_buffer.push(_LOGIN_USER_IMG)
            w_arr_buffer.push(_LOGIN_USER_NM)

            // データ送信
            try {
                _DATACONN.send(w_arr_buffer);
                swal(
                    'データを送信しました'
                   ,""
                   + "<p>ファイル: " + filename + "</p>"
                   + "サイズ:" + filesize
                   ,'success'
                    )
            }
            catch (e) {
                swal(
                    'データ送信に失敗しました'
                   ,'error'
                    )
            }
        }
    });

    /* ------------------------------------------ */
    /* [メディア]終了イベント                           */
    /* ------------------------------------------ */
    $("[id^=video_ctl_end]").on('click',function() {
        fnc_end_modal_video()
        _LAYOUT_USER_MODE_STATUS = 1
        fnc_layout_ctl()
    })
    /* ------------------------------------------ */
    /* [メディア]レイアウト変更イベント                     */
    /* ------------------------------------------ */
    $("#video_ctl_layout").on('click',function() {
        if (_LAYOUT_VIDEO_STATUS == 1) {
            _LAYOUT_VIDEO_STATUS = 2
        } else if (_LAYOUT_VIDEO_STATUS == 2) {
            _LAYOUT_VIDEO_STATUS = 3
        } else if (_LAYOUT_VIDEO_STATUS == 3) {
            _LAYOUT_VIDEO_STATUS = 1
        }
        fnc_layout_ctl()
    })


    // 自分のピアIDを取得
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    var peer               = new Peer({ key: '6031b9f3-73ef-49d9-838a-2bad4ae2c99d', debug: 3});
    var screen             = ScreenShare.create({debug: true});
    /* ------------------------------------------ */
    /* [PEER]自分のピアIDを取得したら、DBに設定する         */
    /* ------------------------------------------ */
    peer.on('open', function(){
        var w_peer_id = peer.id
        _SOK.emit('sok_cli_index_video_set_my_peer_id', {
             peer_id  : w_peer_id
        });
    });
    /* ------------------------------------------ */
    /* [PEER]着信があったら                           */
    /* ------------------------------------------ */
    peer.on('call', function(call){
        window.tmpCall    = call
        _THEIR_MEDIA_TYPE = ''
        // ピアIDからユーザー情報を取得
        _SOK.emit('sok_cli_index_video_get_target_user', {
             peer_id  : call.peer
        });
    });
    /* ------------------------------------------ */
    /* [PEER]接続確立(データ送信)                    */
    /* ------------------------------------------ */
    peer.on('connection', function(conn){
        /* ------------------------------------------ */
        /* [PEER]データ受信完了                          */
        /* ------------------------------------------ */
        conn.on('data', function(data) {
            var w_arrb     = data[0]
            var w_filename = data[1]
            var w_filesize = data[2]
            var w_user_img = data[3]
            var w_user_nm  = data[4]
            var blob       = new Blob([w_arrb], {type: "application/octet-stream"})
            var blob_url   = window.URL.createObjectURL(blob)
            // デスクトップ通知
            if (_MY_DEVICE == 'other') {
                // デスクトップ通知
                var Notification = window.Notification || window.mozNotification || window.webkitNotification;
                // PC 通知許可あり
                if (Notification.permission !== 'denied') {
                  Notification.requestPermission(function (permission) {
                    // ユーザが許可した場合は、通知を作成する
                    if (permission === "granted") {
                        var n = new Notification(
                             "データを受信しました"
                            ,{
                             body: w_user_nm + "\r\n" + w_filename.substr(0,20)
                            ,icon: "/static/img/manyone_icon.ico"
                            }
                        );
                        _EFFECT_SOUND = new Audio('/static/audio/notise_talk.mp3');
                        _EFFECT_SOUND.load();
                        _EFFECT_SOUND.play();
                    }
                  });
                // PC 通知許可なし
                } else {
                    alert(w_user_nm + "からデータを受信しました")
                }
            } else {
                // スマホ
                alert(w_user_nm + "からデータを受信しました")
            }

            swal({
                title: "データを受信しました",
                type: 'success',
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                html: $("<p>以下のリンクをクリックしダウンロードして下さい</p>"
                      + "<p>送信者: " + w_user_nm + "</p>"
                      + "サイズ:" + w_filesize + "バイト"
                      + "<h3><a href='" + blob_url + "' download='" + w_filename + "'>" + w_filename + "</a></h3>"
                     )
            });
        })
    })
    /* ------------------------------------------ */
    /* [PEER]エラー発生                              */
    /* ------------------------------------------ */
    peer.on('error', function(err){
        swal({
             title: 'メディアを利用できません'
            ,type: 'error'
        })
    })
    /* ------------------------------------------ */
    /* [データ送信]データコネクション設定                   */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_index_sendfile_get_target_peer_id', function(msg) {
        var w_peer_id = msg.peer_id
        var w_org_id  = msg.org_id
        var w_user_id = msg.user_id
        var w_user_nm = msg.user_nm
        if (w_peer_id) {
            // グローバル変数に設定する
            _DATACONN = ""
            _DATACONN = peer.connect(w_peer_id);
        }
    })
    /* ------------------------------------------ */
    /* [メディア]着信後処理                            */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_index_video_get_target_user', function(msg) {
        var w_org_id  = msg.org_id
        var w_user_id = msg.user_id
        var w_user_nm = msg.user_nm
        if (!msg.profile_img_file) {
            var w_profile_img_file = "noimage.png"
        } else {
            var w_profile_img_file = msg.profile_img_file
        }
        var w_call_type = msg.call_type
        if (w_call_type == 'AUDIO') {
            var w_call_type_str = "音声通話"
            var w_call_type_btn = "<i class='fa fa-phone' aria-hidden='true'></i> 音声通話"
        } else if (w_call_type == 'VIDEO') {
            var w_call_type_str = "ビデオ通話"
            var w_call_type_btn = "<i class='fa fa-video-camera' aria-hidden='true'></i></i> ビデオ通話"
        } else if (w_call_type == 'SCREEN') {
            var w_call_type_str = "画面共有"
            var w_call_type_btn = "<i class='fa fa-window-restore' aria-hidden='true'></i> 画面共有"
        } else if (w_call_type == 'SCREEN_AUDIO') {
            var w_call_type_str = "画面共有+音声通話"
            var w_call_type_btn = "<i class='fa fa-window-restore' aria-hidden='true'><span style='font-size: 10px'>+</span><i class='fa fa-phone' aria-hidden='true'></i></i> 画面共有+音声通話"
        }

        if (_MY_DEVICE == 'other') {
            // デスクトップ通知
            var Notification = window.Notification || window.mozNotification || window.webkitNotification;
            // PC 通知許可あり
            if (Notification.permission !== 'denied') {
              Notification.requestPermission(function (permission) {
                // ユーザが許可した場合は、通知を作成する
                if (permission === "granted") {
                    var n = new Notification(
                         w_user_nm + "から" + w_call_type_str + "の着信中です。"
                        ,{
                         body: "Manyoneから応答することが可能です"
                        ,icon: "/static/img/manyone_icon.ico"
                        }
                    );
                    _EFFECT_SOUND = new Audio('/static/audio/notice_tyakusin.mp3');
                    _EFFECT_SOUND.loop = 'true';
                    _EFFECT_SOUND.load();
                    _EFFECT_SOUND.play();
                }
              });
            // PC 通知許可なし
            } else {
                alert(w_user_nm + "から" + w_call_type_str + "の着信中です。")
            }
        } else {
            // スマホ
            alert(w_user_nm + "から" + w_call_type_str + "の着信中です。")
        }
        // 答えるかどうかユーザー側で判断する
        swal({
            title: w_user_nm + "から着信中です",
            showConfirmButton: false,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ビデオ通話する',
            cancelButtonText: '拒否する',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            html: $("<div class='col-xs-5'>"
                +    "<img class='img-circle' src='/static/img/user/" + w_profile_img_file + "' onerror='this.src='/static/img/user/noimage.png'' style='width:100px'/>"
                +    "<h3 class='profile-username text-center'>" + w_user_nm + "</h3>"
                +    "<button class='btn btn-app' style='width:100%; margin:3px;padding:0px;'>"
                +       w_call_type_btn
                +    "</button>"
                + "</div>"
                + "<div class='col-xs-2' style='height:300px;display: flex;justify-content: center;align-items: center;'>"
                +      "<span><i class='fa fa-arrows-h fa-3x' aria-hidden='true'></i></span>"
                + "</div>"
                + "<div class='col-xs-5'>"
                +    "<button id='res_audio' class='btn btn-app' style='width:100%;margin:3px;padding:0px;background-color:#337ab7;color:#fff'>"
                +    "<i class='fa fa-phone' aria-hidden='true'></i> 音声を共有し応答"
                +    "</button>"
                +    "<button id='res_audio_video' class='btn btn-app' style='width:100%;margin:3px;padding:0px;background-color:#337ab7;color:#fff'>"
                +    "<i class='fa fa-video-camera' aria-hidden='true'></i> 音声とカメラを共有し応答"
                +    "</button>"
                +    "<button id='res_screen' class='btn btn-app' style='width:100%;margin:3px;padding:0px;background-color:#337ab7;color:#fff'>"
                +    "<i class='fa fa-window-restore' aria-hidden='true'></i> 画面を共有し応答"
                +    "</button>"
                +    "<button id='res_screen_audio' class='btn btn-app' style='width:100%;margin:3px;padding:0px;background-color:#337ab7;color:#fff'>"
                +       "<i class='fa fa-window-restore' aria-hidden='true'>"
                +       "<span style='font-size: 10px'>+</span>"
                +       "<i class='fa fa-phone' aria-hidden='true'></i>"
                +       "</i> 画面と音声を共有し応答"
                +    "</button>"
                +    "<button id='res_only' class='btn btn-app' style='width:100%;margin:3px;padding:0px;background-color:#337ab7;color:#fff'>"
                +       "何も共有しないで応答"
                +    "</button>"
                + "</div>"
                 )
        }).then(function () {
        }, function (dismiss) {
            // 拒否した場合
            if (dismiss === 'cancel') {
                // 効果音を消す
                _EFFECT_SOUND.pause()

                _SOK.emit('sok_cli_index_video_call_resver_cancel', {
                     org_id  : w_org_id
                    ,user_id : w_user_id
                });
            }
        })
        /* ---------------------------------------------- */
        /* [着信応答イベント]音声通話の応答                     */
        /* ---------------------------------------------- */
        $("#res_audio").on('click', function () {
            /* ---------------------------------------------- */
            /* 事前処理                                        */
            /* ---------------------------------------------- */
            _EFFECT_SOUND.pause()
            swal.close()
            fnc_start_video_timer()
            $("#their-video-h").empty()
            $("#their-video-h").append("<span>" + w_user_nm + "のビデオ</span>")
            /* ---------------------------------------------- */
            /* メディアの取得                                     */
            /* ---------------------------------------------- */
            navigator.getUserMedia({audio: true, video: false}
                ,function(stream){

                      window.localStream = stream;

                      /* ---------------------------------------------- */
                      /* DB登録                                         */
                      /* ---------------------------------------------- */
                      _SOK.emit('sok_cli_index_video_call_start', {
                           call_org_id   : w_org_id
                          ,call_user_id  : w_user_id
                          ,resv_type     : 'AUDIO'
                      });

                      /* ---------------------------------------------- */
                      /* 自分のメディア処理                                  */
                      /* ---------------------------------------------- */
                      $('#my-video').prop('src', URL.createObjectURL(window.localStream));

                      /* ---------------------------------------------- */
                      /* 相手に応答する                                    */
                      /* ---------------------------------------------- */
                      window.tmpCall.answer(window.localStream);
                      if (window.existingCall) {
                          window.existingCall.close();
                      }
                      window.tmpCall.on('stream', function(stream){
                          $('#their-video').prop('src', URL.createObjectURL(stream));
                      });
                      window.existingCall = window.tmpCall;

                      /* ---------------------------------------------- */
                      /* レイアウト処理                                     */
                      /* ---------------------------------------------- */
                      if (_LAYOUT_USER_MODE_STATUS == 1) {
                          _LAYOUT_USER_MODE_STATUS = 3
                      } else if (_LAYOUT_USER_MODE_STATUS == 2) {
                          _LAYOUT_USER_MODE_STATUS = 4
                      }
                      fnc_layout_ctl()
                      $('#user_boxh_' + w_org_id + '_' + w_user_id).click();
                 }
                /* ---------------------------------------------- */
                /* メディア取得エラー発生時                              */
                /* ---------------------------------------------- */
                ,function(err) {
                      swal({
                           title: '音声通話を使用できません'
                          ,text: "マイクを認識できませんでした"
                          ,type: 'error'
                      })
                      return
                 })
        })
        /* ---------------------------------------------- */
        /* [着信応答イベント]ビデオ通話の応答                     */
        /* ---------------------------------------------- */
        $("#res_audio_video").on('click', function () {

            /* ---------------------------------------------- */
            /* 事前処理                                        */
            /* ---------------------------------------------- */
            _EFFECT_SOUND.pause()
            swal.close()
            fnc_start_video_timer()
            $("#their-video-h").empty()
            $("#their-video-h").append("<span>" + w_user_nm + "のビデオ</span>")
            /* ---------------------------------------------- */
            /* メディアの取得                                     */
            /* ---------------------------------------------- */
            navigator.getUserMedia({audio: true, video: true}
                ,function(stream){

                      window.localStream = stream;

                      /* ---------------------------------------------- */
                      /* DB登録                                         */
                      /* ---------------------------------------------- */
                      _SOK.emit('sok_cli_index_video_call_start', {
                           call_org_id   : w_org_id
                          ,call_user_id  : w_user_id
                          ,resv_type     : 'VIDEO'
                      });

                      /* ---------------------------------------------- */
                      /* 自分のメディア処理                                  */
                      /* ---------------------------------------------- */
                      $('#my-video').prop('src', URL.createObjectURL(window.localStream));

                      /* ---------------------------------------------- */
                      /* 相手に応答する                                    */
                      /* ---------------------------------------------- */
                      window.tmpCall.answer(window.localStream);
                      if (window.existingCall) {
                          window.existingCall.close();
                      }
                      window.tmpCall.on('stream', function(stream){
                          $('#their-video').prop('src', URL.createObjectURL(stream));
                      });
                      window.existingCall = window.tmpCall;

                      /* ---------------------------------------------- */
                      /* レイアウト処理                                     */
                      /* ---------------------------------------------- */
                      if (_LAYOUT_USER_MODE_STATUS == 1) {
                          _LAYOUT_USER_MODE_STATUS = 3
                      } else if (_LAYOUT_USER_MODE_STATUS == 2) {
                          _LAYOUT_USER_MODE_STATUS = 4
                      }
                      fnc_layout_ctl()
                      $('#user_boxh_' + w_org_id + '_' + w_user_id).click();
                 }
                /* ---------------------------------------------- */
                /* メディア取得エラー発生時                              */
                /* ---------------------------------------------- */
                ,function(err) {
                      swal({
                           title: 'ビデオ通話を使用できません'
                          ,text: "マイク又はカメラを認識できませんでした"
                          ,type: 'error'
                      })
                      return
                 })
        })

        /* ---------------------------------------------- */
        /* [着信応答イベント]画面共有の応答                     */
        /* ---------------------------------------------- */
        $("#res_screen").on('click', function () {
            /* ---------------------------------------------- */
            /* 事前処理                                        */
            /* ---------------------------------------------- */
            _EFFECT_SOUND.pause()
            swal.close()
            fnc_start_video_timer()
            $("#their-video-h").empty()
            $("#their-video-h").append("<span>" + w_user_nm + "のビデオ</span>")

            if(screen.isEnabledExtension()){
                screen.startScreenShare({
                },function (stream){

                    window.localStream = stream;

                    /* ---------------------------------------------- */
                    /* DB登録                                         */
                    /* ---------------------------------------------- */
                    _SOK.emit('sok_cli_index_video_call_start', {
                         call_org_id   : w_org_id
                        ,call_user_id  : w_user_id
                        ,resv_type     : 'SCREEN'
                    });

                    /* ---------------------------------------------- */
                    /* 自分のメディア処理                                  */
                    /* ---------------------------------------------- */
                    $('#my-video').prop('src', URL.createObjectURL(window.localStream));

                    /* ---------------------------------------------- */
                    /* 相手に応答する                                    */
                    /* ---------------------------------------------- */
                    window.tmpCall.answer(window.localStream);
                    if (window.existingCall) {
                        window.existingCall.close();
                    }
                    window.tmpCall.on('stream', function(stream){
                        $('#their-video').prop('src', URL.createObjectURL(stream));
                    });
                    window.existingCall = window.tmpCall;

                    /* ---------------------------------------------- */
                    /* レイアウト処理                                     */
                    /* ---------------------------------------------- */
                    if (_LAYOUT_USER_MODE_STATUS == 1) {
                        _LAYOUT_USER_MODE_STATUS = 3
                    } else if (_LAYOUT_USER_MODE_STATUS == 2) {
                        _LAYOUT_USER_MODE_STATUS = 4
                    }
                    fnc_layout_ctl()
                    $('#user_boxh_' + w_org_id + '_' + w_user_id).click();

                },function(error){
                    console.log(error);
                },function(){
                    console.log("screen end");
                });
            }else{
                swal({
                     title: '画面共有を使用できません'
                    ,text: "画面共有に必要なソフトがインストールされていません"
                    ,type: 'error'
                })
                return
            }
        })
        /* ---------------------------------------------- */
        /* [着信応答イベント]画面共有+音声通話の応答             */
        /* ---------------------------------------------- */
        $("#res_screen_audio").on('click', function () {
            /* ---------------------------------------------- */
            /* 事前処理                                        */
            /* ---------------------------------------------- */
            _EFFECT_SOUND.pause()
            swal.close()
            fnc_start_video_timer()
            $("#their-video-h").empty()
            $("#their-video-h").append("<span>" + w_user_nm + "のビデオ</span>")

            if(screen.isEnabledExtension()){
                screen.startScreenShare({
                },function (stream){

                    navigator.getUserMedia({ audio: true, video: false }
                       ,function(audiostream) {

                            audiostream.addTrack(stream.getVideoTracks()[0]);
                            window.localStream = audiostream;

                            /* ---------------------------------------------- */
                            /* DB登録                                         */
                            /* ---------------------------------------------- */
                            _SOK.emit('sok_cli_index_video_call_start', {
                                 call_org_id   : w_org_id
                                ,call_user_id  : w_user_id
                                ,resv_type     : 'SCREEN_AUDIO'
                            });

                            /* ---------------------------------------------- */
                            /* 自分のメディア処理                                  */
                            /* ---------------------------------------------- */
                            $('#my-video').prop('src', URL.createObjectURL(window.localStream));

                            /* ---------------------------------------------- */
                            /* 相手に応答する                                    */
                            /* ---------------------------------------------- */
                            window.tmpCall.answer(window.localStream);
                            if (window.existingCall) {
                                window.existingCall.close();
                            }
                            window.tmpCall.on('stream', function(stream){
                                $('#their-video').prop('src', URL.createObjectURL(stream));
                            });
                            window.existingCall = window.tmpCall;

                            /* ---------------------------------------------- */
                            /* レイアウト処理                                     */
                            /* ---------------------------------------------- */
                            if (_LAYOUT_USER_MODE_STATUS == 1) {
                                _LAYOUT_USER_MODE_STATUS = 3
                            } else if (_LAYOUT_USER_MODE_STATUS == 2) {
                                _LAYOUT_USER_MODE_STATUS = 4
                            }
                            fnc_layout_ctl()
                            $('#user_boxh_' + w_org_id + '_' + w_user_id).click();

                        }
                       ,function(err) {
                             swal({
                                  title: '音声通話を使用できません'
                                 ,text: "マイクを認識できませんでした"
                                 ,type: 'error'
                             })
                             return
                        })
                },function(error){
                    console.log(error);
                },function(){
                    console.log("screen_audio end");
                });
            }else{
                swal({
                     title: '画面共有を使用できません'
                    ,text: "画面共有に必要なソフトがインストールされていません"
                    ,type: 'error'
                })
                return
            }

        })

        /* ---------------------------------------------- */
        /* [着信応答イベント]共有しないの応答                     */
        /* ---------------------------------------------- */
        $("#res_only").on('click', function () {
            /* ---------------------------------------------- */
            /* 事前処理                                        */
            /* ---------------------------------------------- */
            _EFFECT_SOUND.pause()
            swal.close()
            fnc_start_video_timer()
            $("#their-video-h").empty()
            $("#their-video-h").append("<span>" + w_user_nm + "のビデオ</span>")

            /* ---------------------------------------------- */
            /* DB登録                                         */
            /* ---------------------------------------------- */
            _SOK.emit('sok_cli_index_video_call_start', {
                 call_org_id   : w_org_id
                ,call_user_id  : w_user_id
                ,resv_type     : 'NONE'
            });

            /* ---------------------------------------------- */
            /* 相手に応答する                                    */
            /* ---------------------------------------------- */
            window.tmpCall.answer();
            if (window.existingCall) {
                window.existingCall.close();　// 通話終了
            }
            window.tmpCall.on('stream', function(stream){
                $('#their-video').prop('src', URL.createObjectURL(stream));
            });
            window.existingCall = window.tmpCall;

            /* ---------------------------------------------- */
            /* レイアウト処理                                     */
            /* ---------------------------------------------- */
            if (_LAYOUT_USER_MODE_STATUS == 1) {
                _LAYOUT_USER_MODE_STATUS = 3
            } else if (_LAYOUT_USER_MODE_STATUS == 2) {
                _LAYOUT_USER_MODE_STATUS = 4
            }
            fnc_layout_ctl()
            $('#user_boxh_' + w_org_id + '_' + w_user_id).click();
        })
    })

    /* ---------------------------------------------- */
    /* [発信イベント]                                    */
    /* ---------------------------------------------- */
    _SOK.on('sok_srv_index_video_get_target_peer_id', function(msg) {
        var w_peer_id = msg.peer_id
        var w_org_id  = msg.org_id
        var w_user_id = msg.user_id
        var w_user_nm = msg.user_nm

        // ピアIDがNULLの場合、通話できない旨表示する
        if (w_peer_id) {
            /* ---------------------------------------------- */
            /* [発信イベント]ビデオ通話                             */
            /* ---------------------------------------------- */
            if (_MY_MEDIA_TYPE == 'AUDIO') {
                /* ---------------------------------------------- */
                /* メディア取得                                      */
                /* ---------------------------------------------- */
                navigator.getUserMedia({audio: true, video: false}
                    ,function(stream){

                        window.localStream = stream;

                        /* ---------------------------------------------- */
                        /* 事前処理                                        */
                        /* ---------------------------------------------- */
                        _EFFECT_SOUND = new Audio('/static/audio/notice_hassin.mp3');
                        _EFFECT_SOUND.loop = 'true';
                        _EFFECT_SOUND.play();
                        fnc_start_video_timer()
                        $("#their-video-h").empty()
                        $("#their-video-h").append("<span>" + w_user_nm + "のビデオ</span>")

                        /* ---------------------------------------------- */
                        /* 自分のメディア処理                                  */
                        /* ---------------------------------------------- */
                        $('#my-video').prop('src', URL.createObjectURL(window.localStream));

                        /* ---------------------------------------------- */
                        /* 相手に発信する                                    */
                        /* ---------------------------------------------- */
                        var w_options = {
                          'constraints' : {
                            'offerToReceiveAudio' : true,
                            'offerToReceiveVideo' : true,
                          }
                        }
                        window.tmpCall = peer.call(w_peer_id, window.localStream, w_options);
                        if (window.existingCall) {
                            window.existingCall.close();
                        }
                        window.tmpCall.on('stream', function(stream){
                            _EFFECT_SOUND.pause();
                            $('#their-video').prop('src', URL.createObjectURL(stream));
                        });
                        window.existingCall = window.tmpCall;

                        /* ---------------------------------------------- */
                        /* レイアウト処理                                     */
                        /* ---------------------------------------------- */
                        swal({
                             title: '<i class="fa fa-refresh fa-spin fa-3x"></i><br><br>' + w_user_nm + '   を呼出中です'
                            ,showConfirmButton: false
                            ,showCancelButton: true
                            ,cancelButtonText: '取消'
                            ,allowOutsideClick: false
                            ,allowEscapeKey: false
                            ,allowEnterKey: false
                        }).then(function () {} ,function (dismiss) {
                            if (dismiss === 'cancel') {
                                _EFFECT_SOUND.pause()
                                fnc_end_modal_video()
                                _SOK.emit('sok_cli_index_video_call_caller_cancel', {
                                     org_id  : w_org_id
                                    ,user_id : w_user_id
                                });
                            }
                        })
                     }
                    ,function(err) {
                        swal({
                             title: '音声通話を使用できません'
                            ,text: "マイクを認識できませんでした"
                            ,type: 'error'
                        })
                        return
                    })

            /* ---------------------------------------------- */
            /* [発信イベント]音声通話                             */
            /* ---------------------------------------------- */
            } else if(_MY_MEDIA_TYPE == 'VIDEO') {
                /* ---------------------------------------------- */
                /* メディア取得                                      */
                /* ---------------------------------------------- */
                navigator.getUserMedia({audio: true, video: true}
                    ,function(stream){

                        window.localStream = stream;

                        /* ---------------------------------------------- */
                        /* 事前処理                                        */
                        /* ---------------------------------------------- */
                        _EFFECT_SOUND = new Audio('/static/audio/notice_hassin.mp3');
                        _EFFECT_SOUND.loop = 'true';
                        _EFFECT_SOUND.play();
                        fnc_start_video_timer()
                        $("#their-video-h").empty()
                        $("#their-video-h").append("<span>" + w_user_nm + "のビデオ</span>")

                        /* ---------------------------------------------- */
                        /* 自分のメディア処理                                  */
                        /* ---------------------------------------------- */
                        $('#my-video').prop('src', URL.createObjectURL(window.localStream));

                        /* ---------------------------------------------- */
                        /* 相手に発信する                                    */
                        /* ---------------------------------------------- */
                        var w_options = {
                          'constraints' : {
                            'offerToReceiveAudio' : true,
                            'offerToReceiveVideo' : true,
                          }
                        }
                        window.tmpCall = peer.call(w_peer_id, window.localStream, w_options);
                        if (window.existingCall) {
                            window.existingCall.close();
                        }
                        window.tmpCall.on('stream', function(stream){
                            _EFFECT_SOUND.pause();
                            $('#their-video').prop('src', URL.createObjectURL(stream));
                        });
                        window.existingCall = window.tmpCall;

                        /* ---------------------------------------------- */
                        /* レイアウト処理                                     */
                        /* ---------------------------------------------- */
                        swal({
                             title: '<i class="fa fa-refresh fa-spin fa-3x"></i><br><br>' + w_user_nm + '   を呼出中です'
                            ,showConfirmButton: false
                            ,showCancelButton: true
                            ,cancelButtonText: '取消'
                            ,allowOutsideClick: false
                            ,allowEscapeKey: false
                            ,allowEnterKey: false
                        }).then(function () {} ,function (dismiss) {
                            if (dismiss === 'cancel') {
                                _EFFECT_SOUND.pause()
                                fnc_end_modal_video()
                                _SOK.emit('sok_cli_index_video_call_caller_cancel', {
                                     org_id  : w_org_id
                                    ,user_id : w_user_id
                                });
                            }
                        })
                     }
                    ,function(err) {
                        swal({
                             title: 'ビデオ通話を使用できません'
                            ,text: "カメラを認識できませんでした"
                            ,type: 'error'
                        })
                        return
                    })

            /* ---------------------------------------------- */
            /* [発信イベント]画面共有                             */
            /* ---------------------------------------------- */
            } else if(_MY_MEDIA_TYPE == 'SCREEN') {

                if(screen.isEnabledExtension()){
                    screen.startScreenShare({
                    },function (stream){

                        window.localStream = stream;

                        /* ---------------------------------------------- */
                        /* 事前処理                                        */
                        /* ---------------------------------------------- */
                        _EFFECT_SOUND = new Audio('/static/audio/notice_hassin.mp3');
                        _EFFECT_SOUND.loop = 'true';
                        _EFFECT_SOUND.play();
                        fnc_start_video_timer()
                        $("#their-video-h").empty()
                        $("#their-video-h").append("<span>" + w_user_nm + "のビデオ</span>")

                        /* ---------------------------------------------- */
                        /* 自分のメディア処理                                  */
                        /* ---------------------------------------------- */
                        $('#my-video').prop('src', URL.createObjectURL(window.localStream));

                        /* ---------------------------------------------- */
                        /* 相手に発信する                                    */
                        /* ---------------------------------------------- */
                        var w_options = {
                          'constraints' : {
                            'offerToReceiveAudio' : true,
                            'offerToReceiveVideo' : true,
                          }
                        }
                        window.tmpCall = peer.call(w_peer_id, window.localStream, w_options);
                        if (window.existingCall) {
                            window.existingCall.close();
                        }
                        window.tmpCall.on('stream', function(stream){
                            _EFFECT_SOUND.pause();
                            $('#their-video').prop('src', URL.createObjectURL(stream));
                        });
                        window.existingCall = window.tmpCall;

                        swal({
                             title: '<i class="fa fa-refresh fa-spin fa-3x"></i><br><br>' + w_user_nm + '   を呼出中です'
                            ,showConfirmButton: false
                            ,showCancelButton: true
                            ,cancelButtonText: '取消'
                            ,allowOutsideClick: false
                            ,allowEscapeKey: false
                            ,allowEnterKey: false
                        }).then(function () {} ,function (dismiss) {
                            if (dismiss === 'cancel') {
                                _EFFECT_SOUND.pause()
                                fnc_end_modal_video()
                                _SOK.emit('sok_cli_index_video_call_caller_cancel', {
                                     org_id  : w_org_id
                                    ,user_id : w_user_id
                                });
                            }
                        })

                    },function(error){
                        console.log(error);
                    },function(){
                        console.log("screen_audio end");
                    });
                }else{
                    swal({
                         title: '画面共有を使用できません'
                        ,text: '画面共有に必要なソフトがインストールされていません'
                        ,type: 'error'
                    })
                    return
                }
            /* ---------------------------------------------- */
            /* [発信イベント]画面共有+音声通話                     */
            /* ---------------------------------------------- */
            } else if(_MY_MEDIA_TYPE == 'SCREEN_AUDIO') {

                if(screen.isEnabledExtension()){
                    screen.startScreenShare({
                    },function (stream){

                    /* ---------------------------------------------- */
                    /* メディア取得                                      */
                    /* ---------------------------------------------- */
                    navigator.getUserMedia({ audio: true, video: false }
                       ,function(audiostream) {

                            audiostream.addTrack(stream.getVideoTracks()[0]);
                            window.localStream = audiostream;

                            /* ---------------------------------------------- */
                            /* 事前処理                                        */
                            /* ---------------------------------------------- */
                            _EFFECT_SOUND = new Audio('/static/audio/notice_hassin.mp3');
                            _EFFECT_SOUND.loop = 'true';
                            _EFFECT_SOUND.play();
                            fnc_start_video_timer()
                            $("#their-video-h").empty()
                            $("#their-video-h").append("<span>" + w_user_nm + "のビデオ</span>")

                            /* ---------------------------------------------- */
                            /* 自分のメディア処理                                  */
                            /* ---------------------------------------------- */
                            $('#my-video').prop('src', URL.createObjectURL(window.localStream));

                            /* ---------------------------------------------- */
                            /* 相手に発信する                                    */
                            /* ---------------------------------------------- */
                            var w_options = {
                              'constraints' : {
                                'offerToReceiveAudio' : true,
                                'offerToReceiveVideo' : true,
                              }
                            }
                            window.tmpCall = peer.call(w_peer_id, window.localStream, w_options);
                            if (window.existingCall) {
                                window.existingCall.close();
                            }
                            window.tmpCall.on('stream', function(stream){
                                _EFFECT_SOUND.pause();
                                $('#their-video').prop('src', URL.createObjectURL(stream));
                            });
                            window.existingCall = window.tmpCall;


                            swal({
                                 title: '<i class="fa fa-refresh fa-spin fa-3x"></i><br><br>' + w_user_nm + '   を呼出中です'
                                ,showConfirmButton: false
                                ,showCancelButton: true
                                ,cancelButtonText: '取消'
                                ,allowOutsideClick: false
                                ,allowEscapeKey: false
                                ,allowEnterKey: false
                            }).then(function () {} ,function (dismiss) {
                                if (dismiss === 'cancel') {
                                    _EFFECT_SOUND.pause()
                                    fnc_end_modal_video()
                                    _SOK.emit('sok_cli_index_video_call_caller_cancel', {
                                         org_id  : w_org_id
                                        ,user_id : w_user_id
                                    });
                                }
                            })
                        }
                       ,function(err) {
                             swal({
                                  title: '音声通話を使用できません'
                                 ,text: "マイクを認識できませんでした"
                                 ,type: 'error'
                             })
                             return
                        })

                    },function(error){
                        console.log(error);
                    },function(){
                        console.log("screen_audio end");
                    });
                }else{
                    swal({
                         title: '画面共有を使用できません'
                        ,text: '画面共有に必要なソフトがインストールされていません'
                        ,type: 'error'
                    })
                    return
                }
            }
        }　else {
            swal({
                 title: 'メディアを使用できません'
                ,text: "通話相手がメディアを使用できない状況です"
                ,type: 'error'
            })
            return
        }
    })

    _SOK.on('sok_srv_index_video_call_start', function(msg) {
        var w_msg  = msg.msg
        fnc_unset_overlay()

        // 相手のビデオを設定したタイミングでレイアウト変更
        if (_LAYOUT_USER_MODE_STATUS == 1) {
            _LAYOUT_USER_MODE_STATUS = 3
        } else if (_LAYOUT_USER_MODE_STATUS == 2) {
            _LAYOUT_USER_MODE_STATUS = 4
        }
        fnc_layout_ctl()

        // 効果音
        _EFFECT_SOUND.pause();
    })


    _SOK.on('sok_srv_index_video_call_end', function(msg) {
        var w_msg  = msg.msg
        // 終了したタイミングでレイアウト変更
        _LAYOUT_MODE              = 'USER'
        _LAYOUT_USER_MODE_STATUS　 = 1
        fnc_layout_ctl()
        fnc_end_modal_video()
        // 効果音消す
        _EFFECT_SOUND.pause()
        swal({
             title: '相手がビデオ通話を終了しました'
            ,type: 'error'
        })
    })

    // 発信したけど相手が拒否した場合
    _SOK.on('sok_srv_index_video_call_resver_cancel', function(msg) {
        var w_msg  = msg.msg
        fnc_unset_overlay()
        // 効果音消す
        _EFFECT_SOUND.pause()
        swal({
             title: '相手がビデオ通話を拒否しました'
            ,type: 'error'
        })
    })


    // 着信きたけど相手が取消しした場合
    _SOK.on('sok_srv_index_video_call_caller_cancel', function(msg) {
        var w_org_id  = msg.org_id
        var w_user_id = msg.user_id
        // モーダルを閉じる
        fnc_unset_overlay()
        // ビデオの着信履歴を残す
        var cnt = 1
        if ($('#video_info_' + w_org_id + '_' + w_user_id)[0]) {
            str_cnt = $('#video_info_' + w_org_id + '_' + w_user_id).text()
            cnt = Number(str_cnt) + 1;
        } else {
            $('#user_box_tool_' + w_org_id + '_' + w_user_id).append(
                "<span id='video_info_" + w_org_id + "_" + w_user_id+ "'"
              + "class='label label-danger'>"
              + "</span>"
            )
        }
        $('#video_info_' + w_org_id + '_' + w_user_id).empty()
        $('#video_info_' + w_org_id + '_' + w_user_id).append(cnt)
        // トークの着信履歴を残す
        var cnt = 1
        if ($('#talk_info_' + w_org_id + '_' + w_user_id)[0]) {
            str_cnt = $('#talk_info_' + w_org_id + '_' + w_user_id).text()
            cnt = Number(str_cnt) + 1;
        } else {
            $('#user_box_tool_' + w_org_id + '_' + w_user_id).append(
                "<span id='talk_info_" + w_org_id + "_" + w_user_id+ "'"
              + "class='label label-warning'>"
              + "</span>"
            )
        }
        $('#talk_info_' + w_org_id + '_' + w_user_id).empty()
        $('#talk_info_' + w_org_id + '_' + w_user_id).append(cnt)

        // 効果音消す
        _EFFECT_SOUND.pause()

    })


})

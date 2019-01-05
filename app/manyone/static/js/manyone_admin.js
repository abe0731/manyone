/* ------------------------------------------ */
/* グローバル変数                                 */
/* ------------------------------------------ */
_SELECT_ADMIN_MENU_1 = ""
_SELECT_ADMIN_MENU_2 = ""
_ADMIN_LAYOUT_MODE   = ""
/* ------------------------------------------ */
/* DOMツリー構築後処理                           */
/* ------------------------------------------ */
$(document).ready(function () {

    /* ------------------------------------------ */
    /* レイアウト制御                  　              */
    /* ------------------------------------------ */
    function fnc_admin_layout_ctl() {
        var w_height        = $(window).height();
        var w_scroll_h      = w_height - 105
        var w_sidebar_h     = w_height - 10
        var w_scroll_h_harf = (w_height / 2) - 75
        var w_scroll_h_body = w_height - 145
        var w_scroll_h_list = w_height - 162
        var w_scroll_h_edit = w_height - 236

        $('#select_user_box').css("display","none")
        $('#nav_my_menu').css("display","none")

        // 高さ調整
        $("#admin_nobody_scroll_content").css("height", w_scroll_h + "px");
        $("#admin_menu_scroll_content").parent().css("height", w_scroll_h + "px");
        $("#admin_user_list_scroll_content").parent().css("height", w_scroll_h_list + "px");
        $("#admin_user_edit_scroll_content").parent().css("height", w_scroll_h_edit + "px");
        $("#admin_grp_edit_scroll_content").parent().css("height", w_scroll_h_list + "px");
        $("#admin_grp_user_edit_scroll_content").parent().css("height", w_scroll_h_list + "px");
        $("#admin_cost_scroll_content").parent().css("height", w_scroll_h + "px");
        $("#admin_data_scroll_content").parent().css("height", w_scroll_h_body + "px");
        $("#admin_summary_scroll_content_left").parent().css("height", w_scroll_h + "px");
        $("#admin_summary_scroll_content_right").parent().css("height", w_scroll_h + "px");
        $("#admin_link_scroll_content").css("height", w_scroll_h + "px");

        $("#admin_data_scroll_content").parent().css("width", "100%");

        if (_ADMIN_LAYOUT_MODE == 'USER_ADMIN_LIST') {
            $('#col-admin-nobody').css("display","none")
            $('#col-admin-user-list').css("display","")
            $('#col-admin-user-edit').css("display","none")
            $('#col-admin-grp-edit').css("display","none")
            $('#col-admin-grp-user-edit').css("display","none")
            $('#col-admin-cost').css("display","none")
            $('#col-admin-data').css('display','none')
            $('#col-admin-summary').css("display","none")
            $('#col-admin-link').css("display","none")
        } else if (_ADMIN_LAYOUT_MODE == 'USER_ADMIN_EDIT'){
            $('#col-admin-nobody').css("display","none")
            $('#col-admin-user-list').css("display","none")
            $('#col-admin-user-edit').css("display","")
            $('#col-admin-grp-edit').css("display","none")
            $('#col-admin-grp-user-edit').css("display","none")
            $('#col-admin-cost').css("display","none")
            $('#col-admin-data').css('display','none')
            $('#col-admin-summary').css("display","none")
            $('#col-admin-link').css("display","none")
        } else if (_ADMIN_LAYOUT_MODE == 'GRP_ADMIN_GRP'){
            $('#col-admin-nobody').css("display","none")
            $('#col-admin-user-list').css("display","none")
            $('#col-admin-user-edit').css("display","none")
            $('#col-admin-grp-edit').css("display","")
            $('#col-admin-grp-user-edit').css("display","none")
            $('#col-admin-cost').css("display","none")
            $('#col-admin-data').css('display','none')
            $('#col-admin-summary').css("display","none")
            $('#col-admin-link').css("display","none")
        } else if (_ADMIN_LAYOUT_MODE == 'GRP_ADMIN_GRP_USER'){
            $('#col-admin-nobody').css("display","none")
            $('#col-admin-user-list').css("display","none")
            $('#col-admin-user-edit').css("display","none")
            $('#col-admin-grp-edit').css("display","none")
            $('#col-admin-grp-user-edit').css("display","")
            $('#col-admin-cost').css("display","none")
            $('#col-admin-data').css('display','none')
            $('#col-admin-summary').css("display","none")
            $('#col-admin-link').css("display","none")
        } else if (_ADMIN_LAYOUT_MODE == 'COST_ADMIN'){
            $('#col-admin-nobody').css("display","none")
            $('#col-admin-user-list').css("display","none")
            $('#col-admin-user-edit').css("display","none")
            $('#col-admin-grp-edit').css("display","none")
            $('#col-admin-grp-user-edit').css("display","none")
            $('#col-admin-cost').css("display","")
            $('#col-admin-data').css('display','none')
            $('#col-admin-summary').css("display","none")
            $('#col-admin-link').css("display","none")
        } else if (_ADMIN_LAYOUT_MODE == 'DATA_ADMIN'){
            $('#col-admin-nobody').css("display","none")
            $('#col-admin-user-list').css("display","none")
            $('#col-admin-user-edit').css("display","none")
            $('#col-admin-grp-edit').css("display","none")
            $('#col-admin-grp-user-edit').css("display","none")
            $('#col-admin-cost').css("display","none")
            $('#col-admin-data').css('display','')
            $('#col-admin-summary').css("display","none")
            $('#col-admin-link').css("display","none")
        } else if (_ADMIN_LAYOUT_MODE == 'SUMMARY_ANALYZE'){
            $('#col-admin-nobody').css("display","none")
            $('#col-admin-user-list').css("display","none")
            $('#col-admin-user-edit').css("display","none")
            $('#col-admin-grp-edit').css("display","none")
            $('#col-admin-grp-user-edit').css("display","none")
            $('#col-admin-cost').css("display","none")
            $('#col-admin-data').css('display','none')
            $('#col-admin-summary').css("display","")
            $('#col-admin-link').css("display","none")
        } else if (_ADMIN_LAYOUT_MODE == 'LINK_ANALYZE'){
            $('#col-admin-nobody').css("display","none")
            $('#col-admin-user-list').css("display","none")
            $('#col-admin-user-edit').css("display","none")
            $('#col-admin-grp-edit').css("display","none")
            $('#col-admin-grp-user-edit').css("display","none")
            $('#col-admin-cost').css("display","none")
            $('#col-admin-data').css('display','none')
            $('#col-admin-summary').css("display","none")
            $('#col-admin-link').css("display","")
        } else {
            $('#col-admin-nobody').css("display","")
            $('#col-admin-user-list').css("display","none")
            $('#col-admin-user-edit').css("display","none")
            $('#col-admin-grp-edit').css("display","none")
            $('#col-admin-grp-user-edit').css("display","none")
            $('#col-admin-cost').css("display","none")
            $('#col-admin-data').css('display','none')
            $('#col-admin-summary').css("display","none")
            $('#col-admin-link').css("display","none")
        }
    }

    /* ------------------------------------------ */
    /* [管理メニュー]ホバー設定                         */
    /* ------------------------------------------ */
    $("[id^=admin_select_list_]").hover(
      function () {
        if ( _SELECT_ADMIN_MENU_1 == this.id.split("_")[3] && _SELECT_ADMIN_MENU_2 == this.id.split("_")[4]) {
            $(this).css("background","rgba(255, 0, 0, 0.2)");
        } else {
            $(this).css("background","#EEEEEE");
        }
      },
      function () {
        if ( _SELECT_ADMIN_MENU_1 == this.id.split("_")[3] && _SELECT_ADMIN_MENU_2 == this.id.split("_")[4]) {
            $(this).css("background","rgba(255, 0, 0, 0.3)");
        } else {
            $(this).css("background","#fff");
        }
      }
    );

    /* ------------------------------------------ */
    /* [管理メニュー]管理メニュー選択                    */
    /* ------------------------------------------ */
    $("[id^=admin_select_list_]").on('click', function () {
        // 選択ユーザー情報を変数に設定
        _SELECT_ADMIN_MENU_1 = this.id.split("_")[3];
        _SELECT_ADMIN_MENU_2 = this.id.split("_")[4];
        var w_admin_menu     = _SELECT_ADMIN_MENU_1 + "_" + _SELECT_ADMIN_MENU_2
        var w_admin_menu_id  = "admin_select_list_" + _SELECT_ADMIN_MENU_1 + "_" + _SELECT_ADMIN_MENU_2

        // 他MENUの色調整
        $("[id^=admin_select_list_]").css({
             'background-color':'white'
            ,'opacity': 1
            ,'color':'#444'
        })
        // 選択MENUの色調整
        $("#" + w_admin_menu_id ).css({
             'background-color':'rgba(255,0,0,0.3)'
            ,'color':'white'
        })
        // レイアウト調整
        if ( w_admin_menu == 'user_admin') {
            $('#table_admin_user_list_body').empty()
            _SOK.emit('sok_cli_admin_user_list_get',{});
            _ADMIN_LAYOUT_MODE   = 'USER_ADMIN_LIST'
            fnc_admin_layout_ctl()
        } else if (w_admin_menu == 'grp_admin') {
            $('#table_admin_grp_edit_body').empty()
            _SOK.emit('sok_cli_admin_grp_list_get',{});
            _ADMIN_LAYOUT_MODE   = 'GRP_ADMIN_GRP'
            fnc_admin_layout_ctl()
        } else if (w_admin_menu == 'cost_admin') {
            // コスト取得
            $('#cost_table_body').empty()
            _SOK.emit('sok_cli_admin_cost_data_get',{});

            _ADMIN_LAYOUT_MODE   = 'COST_ADMIN'
            fnc_admin_layout_ctl()
        } else if (w_admin_menu == 'data_admin') {
            _ADMIN_LAYOUT_MODE   = 'DATA_ADMIN'
            fnc_admin_layout_ctl()
        } else if (w_admin_menu == 'summary_analyze') {
            // ボイス/コメント集計
            $('#admin_all_voice_tatal_box').empty()
            $('#admin_all_voice_tatal_box').append(
                "<canvas id='admin_all_voice_tatal'></canvas>"
            )
            _SOK.emit('sok_cli_admin_all_voice_tatal_get',{});

            // トーク集計
            $('#admin_all_talk_tatal_box').empty()
            $('#admin_all_talk_tatal_box').append(
                "<canvas id='admin_all_talk_tatal'></canvas>"
            )
            _SOK.emit('sok_cli_admin_all_talk_tatal_get',{});

            // ビデオ集計
            $('#admin_all_video_tatal_box').empty()
            $('#admin_all_video_tatal_box').append(
                "<canvas id='admin_all_video_tatal'></canvas>"
            )
            _SOK.emit('sok_cli_admin_all_video_tatal_get',{});

            _ADMIN_LAYOUT_MODE   = 'SUMMARY_ANALYZE'
            fnc_admin_layout_ctl()
        } else if (w_admin_menu == 'link_analyze') {
            _ADMIN_LAYOUT_MODE   = 'LINK_ANALYZE'
            fnc_admin_layout_ctl()
        }
    })


    /* ------------------------------------------ */
    /* [ユーザー管理]リストモード切替      　              */
    /* ------------------------------------------ */
    $("#chg_admin_user_list_mode").on('click',function() {
        _ADMIN_LAYOUT_MODE   = 'USER_ADMIN_LIST'
        fnc_admin_layout_ctl()
    })
    /* ------------------------------------------ */
    /* [ユーザー管理]追加編集モード切替                 */
    /* ------------------------------------------ */
    $("#chg_admin_user_edit_mode").on('click',function() {
        _ADMIN_LAYOUT_MODE   = 'USER_ADMIN_EDIT'
        fnc_admin_layout_ctl()
    })

    /* ------------------------------------------ */
    /* [グループ管理]グループメンバー追加編集モード切替       */
    /* ------------------------------------------ */
    $("#chg_admin_grp_user_edit_mode").on('click',function() {
        _ADMIN_LAYOUT_MODE   = 'GRP_ADMIN_GRP_USER'
        fnc_admin_layout_ctl()
    })
    /* ------------------------------------------ */
    /* [グループ管理]グループ追加編集モード切替      　     */
    /* ------------------------------------------ */
    $("#chg_admin_grp_edit_mode").on('click',function() {
        _ADMIN_LAYOUT_MODE   = 'GRP_ADMIN_GRP'
        fnc_admin_layout_ctl()
    })


    /* ------------------------------------------ */
    /* レイアウト設定                  　              */
    /* ------------------------------------------ */
    // 初期表示レイアウト
    fnc_admin_layout_ctl()
    $(window).resize(function() {
        // ウィンドウリサイズ時
        fnc_admin_layout_ctl()
    });

    /* ------------------------------------------ */
    /* [使用状況全体分析]ボイス数受信                  */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_all_voice_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#all_voice_cnt').empty()
        $('#all_voice_cnt').append(w_count)
    })
    /* ------------------------------------------ */
    /* [使用状況全体分析]コメント数受信                  */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_all_voice_comment_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#all_voice_comment_cnt').empty()
        $('#all_voice_comment_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [使用状況全体分析]トーク数(送信)受信             */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_all_talk_send_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#all_talk_send_cnt').empty()
        $('#all_talk_send_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [使用状況全体分析]トーク数(受信)受信             */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_all_talk_resv_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#all_talk_resv_cnt').empty()
        $('#all_talk_resv_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [使用状況全体分析]ビデオ集計受信(通話時間)        */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_all_video_tatal_get_time', function(msg) {
        var w_sum_dtm     = msg.sum_dtm
        $('#all_video_tatal_time').empty()
        $('#all_video_tatal_time').append(w_sum_dtm)
    })

    /* ------------------------------------------ */
    /* [使用状況全体分析]通話 発信着信数              */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_all_video_tatal_get_call_resv_cnt', function(msg) {
        var w_call_count     = msg.call_count
        var w_resv_count     = msg.resv_count
        $('#all_video_call_resv_cnt').empty()
        $('#all_video_call_resv_cnt').append(w_call_count + '/' + w_resv_count)
    })

    /* ------------------------------------------ */
    /* [使用状況個別分析]ボイス数受信                  */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_user_voice_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#user_voice_cnt').empty()
        $('#user_voice_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [使用状況個別分析]コメント数受信                  */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_user_voice_comment_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#user_voice_comment_cnt').empty()
        $('#user_voice_comment_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [使用状況個別分析]トーク数(送信)受信             */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_user_talk_send_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#user_talk_send_cnt').empty()
        $('#user_talk_send_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [使用状況個別分析]トーク数(受信)受信             */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_user_talk_resv_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#user_talk_resv_cnt').empty()
        $('#user_talk_resv_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [使用状況個別分析]ビデオ集計受信(通話時間)        */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_user_video_tatal_get_time', function(msg) {
        var w_sum_dtm     = msg.sum_dtm
        // if (w_sum_dtm == null) {return}
        $('#user_video_tatal_time').empty()
        $('#user_video_tatal_time').append(w_sum_dtm)
    })

    /* ------------------------------------------ */
    /* [使用状況個別分析]通話 発信着信数              */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_user_video_tatal_get_cuser_resv_cnt', function(msg) {
        var w_call_count     = msg.call_count
        var w_resv_count     = msg.resv_count
        $('#user_video_call_resv_cnt').empty()
        $('#user_video_call_resv_cnt').append(w_call_count + '/' + w_resv_count)
    })




    /* ------------------------------------------ */
    /* [使用状況全体分析]ボイス集計受信                */
    /* ------------------------------------------ */
    var w_all_voice_labels       = []
    var w_all_voice_data         = []
    var w_all_voice_comment_data = []
    _SOK.on('sok_srv_admin_all_voice_tatal_get', function(msg) {
        var w_type     = msg.type
        var w_year     = msg.year
        var w_month    = msg.month
        var w_count    = msg.count
        var w_last_flg = msg.last_flg

        if (w_all_voice_labels.indexOf(w_year + "/" + w_month) == -1) {
            w_all_voice_labels.push(w_year + "/" + w_month);
            w_all_voice_data.push(0);
            w_all_voice_comment_data.push(0);
        }

        if ( w_type == 'voice') {
            w_all_voice_data.pop();
            w_all_voice_data.push(w_count);
        } else if ( w_type == 'comment') {
            w_all_voice_comment_data.pop();
            w_all_voice_comment_data.push(w_count);
        }

        if (w_last_flg == 1) {
            var barChartData = {
                labels: w_all_voice_labels,
                datasets: [{
                    label: 'ボイス数',
                    backgroundColor: '#00c0ef',
                    borderColor: '#BBBBBB',
                    borderWidth: 1,
                    data: w_all_voice_data
                }, {
                    label: 'コメント数',
                    backgroundColor: '#3c8dbc',
                    borderColor: '#BBBBBB',
                    borderWidth: 1,
                    data: w_all_voice_comment_data
                }]
            };
            var all_voice_tatal = document.getElementById("admin_all_voice_tatal").getContext("2d");
            window.myBar = new Chart(all_voice_tatal, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend: false,
                    title: {
                        display: true,
                        text: '月別ボイス数'
                    }
                }
            });
        }
    })

    /* ------------------------------------------ */
    /* [使用状況全体分析]トーク集計受信                 */
    /* ------------------------------------------ */
    var w_all_talk_labels    = []
    var w_all_talk_send_data = []
    var w_all_talk_resv_data = []
    _SOK.on('sok_srv_admin_all_talk_tatal_get', function(msg) {
        var w_type     = msg.type
        var w_year     = msg.year
        var w_month    = msg.month
        var w_count    = msg.count
        var w_last_flg = msg.last_flg

        if (w_all_talk_labels.indexOf(w_year + "/" + w_month) == -1) {
            w_all_talk_labels.push(w_year + "/" + w_month);
            w_all_talk_send_data.push(0);
            w_all_talk_resv_data.push(0);
        }
        if ( w_type == 'send') {
            w_all_talk_send_data.pop();
            w_all_talk_send_data.push(w_count);
        } else if ( w_type == 'resv') {
            w_all_talk_resv_data.pop();
            w_all_talk_resv_data.push(w_count);
        }

        if (w_last_flg == 1) {
            var barChartData = {
                    labels: w_all_talk_labels,
                    datasets: [{
                        label: '送信数',
                        backgroundColor: '#00a65a',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_all_talk_send_data
                    }, {
                        label: '受信数',
                        backgroundColor: '#f39c12',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_all_talk_resv_data
                    }]
                }
            var all_talk_tatal = document.getElementById("admin_all_talk_tatal").getContext("2d");
            window.myBar = new Chart(all_talk_tatal, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend: false,
                    title: {
                        display: true,
                        text: '月別トーク数'
                    }
                }
            });
        }
    })

    /* ------------------------------------------ */
    /* [使用状況全体分析]ビデオ集計受信(通話回数)       */
    /* ------------------------------------------ */
    var w_all_video_labels        = []
    var w_all_video_call_data     = []
    var w_all_video_resv_data     = []
    _SOK.on('sok_srv_admin_all_video_tatal_get_cnt', function(msg) {
        var w_type     = msg.type
        var w_year     = msg.year
        var w_month    = msg.month
        var w_count    = msg.count
        var w_last_flg = msg.last_flg

        if (w_all_video_labels.indexOf(w_year + "/" + w_month) == -1) {
            w_all_video_labels.push(w_year + "/" + w_month);
            w_all_video_call_data.push(0);
            w_all_video_resv_data.push(0);
        }
        if ( w_type == 'call') {
            w_all_video_call_data.pop();
            w_all_video_call_data.push(w_count);
        } else if ( w_type == 'resv') {
            w_all_video_resv_data.pop();
            w_all_video_resv_data.push(w_count);
        }

        if (w_last_flg == 1) {

            var barChartData = {
                labels: w_all_video_labels,
                    datasets: [{
                        label: '発信数',
                        backgroundColor: '#dd4b39',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_all_video_call_data
                    }, {
                        label: '着信数',
                        backgroundColor: '#800080',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_all_video_resv_data
                    }]
               }

            var all_video_tatal = document.getElementById("admin_all_video_tatal").getContext("2d");
            window.myBar = new Chart(all_video_tatal, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend: false,
                    title: {
                        display: true,
                        text: '月別通話回数'
                    }
                }
            });
        }
    })

    /* ------------------------------------------ */
    /* [使用状況個別分析]ボイス集計受信                */
    /* ------------------------------------------ */
    var w_user_voice_labels       = []
    var w_user_voice_data         = []
    var w_user_voice_comment_data = []
    _SOK.on('sok_srv_admin_user_voice_tatal_get', function(msg) {
        var w_type     = msg.type
        var w_year     = msg.year
        var w_month    = msg.month
        var w_count    = msg.count
        var w_last_flg = msg.last_flg

        if (w_user_voice_labels.indexOf(w_year + "/" + w_month) == -1) {
            w_user_voice_labels.push(w_year + "/" + w_month);
            w_user_voice_data.push(0);
            w_user_voice_comment_data.push(0);
        }

        if ( w_type == 'voice') {
            w_user_voice_data.pop();
            w_user_voice_data.push(w_count);
        } else if ( w_type == 'comment') {
            w_user_voice_comment_data.pop();
            w_user_voice_comment_data.push(w_count);
        }


        if (w_last_flg == 1) {
            var barChartData = {
                labels: w_user_voice_labels,
                datasets: [{
                    label: 'ボイス数',
                    backgroundColor: '#00c0ef',
                    borderColor: '#BBBBBB',
                    borderWidth: 1,
                    data: w_user_voice_data
                }, {
                    label: 'コメント数',
                    backgroundColor: '#3c8dbc',
                    borderColor: '#BBBBBB',
                    borderWidth: 1,
                    data: w_user_voice_comment_data
                }]

            };

            var user_voice_tatal      = document.getElementById("admin_user_voice_tatal").getContext("2d");
            w_user_voice_labels       = []
            w_user_voice_data         = []
            w_user_voice_comment_data = []
            window.myBar = new Chart(user_voice_tatal, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend: false,
                    title: {
                        display: true,
                        text: '月別ボイス数'
                    }
                }
            });
        }
    })

    /* ------------------------------------------ */
    /* [使用状況個別分析]トーク集計受信                 */
    /* ------------------------------------------ */
    var w_user_talk_labels    = []
    var w_user_talk_send_data = []
    var w_user_talk_resv_data = []
    _SOK.on('sok_srv_admin_user_talk_tatal_get', function(msg) {
        var w_type     = msg.type
        var w_year     = msg.year
        var w_month    = msg.month
        var w_count    = msg.count
        var w_last_flg = msg.last_flg

        if (w_user_talk_labels.indexOf(w_year + "/" + w_month) == -1) {
            w_user_talk_labels.push(w_year + "/" + w_month);
            w_user_talk_send_data.push(0);
            w_user_talk_resv_data.push(0);
        }
        if ( w_type == 'send') {
            w_user_talk_send_data.pop();
            w_user_talk_send_data.push(w_count);
        } else if ( w_type == 'resv') {
            w_user_talk_resv_data.pop();
            w_user_talk_resv_data.push(w_count);
        }

        if (w_last_flg == 1) {
            var barChartData = {
                    labels: w_user_talk_labels,
                    datasets: [{
                        label: '送信数',
                        backgroundColor: '#00a65a',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_user_talk_send_data
                    }, {
                        label: '受信数',
                        backgroundColor: '#f39c12',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_user_talk_resv_data
                    }]
                }
            var user_talk_tatal = document.getElementById("admin_user_talk_tatal").getContext("2d");
            w_user_talk_labels    = []
            w_user_talk_send_data = []
            w_user_talk_resv_data = []
            window.myBar = new Chart(user_talk_tatal, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend: false,
                    title: {
                        display: true,
                        text: '月別トーク数'
                    }
                }
            });
        }
    })

    /* ------------------------------------------ */
    /* [使用状況個別分析]ビデオ集計受信(通話回数)       */
    /* ------------------------------------------ */
    var w_user_video_labels        = []
    var w_user_video_call_data     = []
    var w_user_video_resv_data     = []
    _SOK.on('sok_srv_common_user_video_tatal_get_cnt', function(msg) {
        var w_type     = msg.type
        var w_year     = msg.year
        var w_month    = msg.month
        var w_count    = msg.count
        var w_last_flg = msg.last_flg

        if (w_user_video_labels.indexOf(w_year + "/" + w_month) == -1) {
            w_user_video_labels.push(w_year + "/" + w_month);
            w_user_video_call_data.push(0);
            w_user_video_resv_data.push(0);
        }
        if ( w_type == 'call') {
            w_user_video_call_data.pop();
            w_user_video_call_data.push(w_count);
        } else if ( w_type == 'resv') {
            w_user_video_resv_data.pop();
            w_user_video_resv_data.push(w_count);
        }

        if (w_last_flg == 1) {

            var barChartData = {
                labels: w_user_video_labels,
                    datasets: [{
                        label: '発信数',
                        backgroundColor: '#dd4b39',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_user_video_call_data
                    }, {
                        label: '着信数',
                        backgroundColor: '#800080',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_user_video_resv_data
                    }]
               }

            var user_video_tatal = document.getElementById("admin_user_video_tatal").getContext("2d");
            w_user_video_labels        = []
            w_user_video_call_data     = []
            w_user_video_resv_data     = []

            window.myBar = new Chart(user_video_tatal, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend: false,
                    title: {
                        display: true,
                        text: '月別通話回数'
                    }
                }
            });
        }
    })

    /* ------------------------------------------ */
    /* [データ管理]ボイス受信                           */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_voice_get', function(msg) {
        var w_voice_id      = msg.voice_id
        var w_voice_dtm     = msg.voice_dtm
        var w_voice         = msg.voice
        var w_hide_user_nm  = msg.hide_user_nm
        if (w_hide_user_nm == null) {
            w_hide_user_nm  = '(更新者なし)'
        }
        var w_hide_flg      = msg.hide_flg
        var w_last_flg      = msg.last_flg

        if (w_hide_flg == 0) {
            var hide_btn_class = "btn-primary"
            var hide_btn_text  = "表示中"
            var hide_btn_flg   = 0
        } else {
            var hide_btn_class = "btn-danger"
            var hide_btn_text  = "非表示"
            var hide_btn_flg   = 1
        }

        $('#table_admin_body').append(
            "<tr>"
          +     "<td class='text-center'>" + w_voice_id + "</td>"
          +     "<td class='text-center'>"
          +        "<button id='" + w_voice_id + "' type='button' class='btn " + hide_btn_class + "'>"
          +        hide_btn_text
          +        "</button>"
          +     "</td>"
          +     "<td class='text-center'>" + w_voice_dtm + "</td>"
          +     "<td class='text-left'>" + w_voice + "</td>"
          +     "<td class='text-center'>" + w_hide_user_nm + "</td>"
          + "</tr>"
        );
        $("#" + w_voice_id).click(function() {
            if ($("#" + w_voice_id).hasClass('btn-primary')) {
                $("#" + w_voice_id).removeClass('btn-primary');
                $("#" + w_voice_id).addClass('btn-danger');
                $("#" + w_voice_id).text("非表示");
                // hide_btn_flg   = 1
                _SOK.emit('sok_cli_admin_voice_hide', {
                    voice_id:   w_voice_id
                });
            } else {
                $("#" + w_voice_id).removeClass('btn-danger');
                $("#" + w_voice_id).addClass('btn-primary');
                $("#" + w_voice_id).text("表示中");
                // hide_btn_flg   = 0
                _SOK.emit('sok_cli_admin_voice_disp', {
                    voice_id:   w_voice_id
                });
            }
        })
        if (w_last_flg == 1) {
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_admin").DataTable();
        }
    })


    /* ------------------------------------------ */
    /* [データ管理]グループトーク受信                      */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_get_admin_grp_talk', function(msg) {
        var w_grp_talk_id  = msg.grp_talk_id
        var w_grp_talk_dtm = msg.grp_talk_dtm
        var w_grp_talk     = msg.grp_talk
        var w_hide_flg     = msg.hide_flg
        if (w_hide_flg == 0) {
            var hide_btn_class = "btn-primary"
            var hide_btn_text  = "表示中"
            var hide_btn_flg   = 0
        } else {
            var hide_btn_class = "btn-danger"
            var hide_btn_text  = "非表示"
            var hide_btn_flg   = 1
        }
        var w_hide_user_nm = msg.hide_user_nm
        if (w_hide_user_nm == null) {
            w_hide_user_nm  = '(更新者なし)'
        }
        var w_last_flg     = msg.last_flg

        $('#table_admin_body').append(
            "<tr>"
          +     "<td class='text-center'>" + w_grp_talk_id + "</td>"
          +     "<td class='text-center'>"
          +        "<button id='" + w_grp_talk_id + "' type='button' class='btn " + hide_btn_class + "'>"
          +        hide_btn_text
          +        "</button>"
          +     "</td>"
          +     "<td class='text-center'>" + w_grp_talk_dtm + "</td>"
          +     "<td class='text-left'>" + w_grp_talk + "</td>"
          +     "<td class='text-center'>" + w_hide_user_nm + "</td>"
          + "</tr>"
        );

        $("#" + w_grp_talk_id).click(function() {
            if ($("#" + w_grp_talk_id).hasClass('btn-primary')) {
                $("#" + w_grp_talk_id).removeClass('btn-primary');
                $("#" + w_grp_talk_id).addClass('btn-danger');
                $("#" + w_grp_talk_id).text("非表示");
                _SOK.emit('sok_cli_admin_grp_talk_hide', {
                    grp_talk_id:   w_grp_talk_id
                });
            } else {
                $("#" + w_grp_talk_id).removeClass('btn-danger');
                $("#" + w_grp_talk_id).addClass('btn-primary');
                $("#" + w_grp_talk_id).text("表示中");
                _SOK.emit('sok_cli_admin_grp_talk_disp', {
                    grp_talk_id:   w_grp_talk_id
                });
            }
        })
        if (w_last_flg == 1) {
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_admin").DataTable();
        }
    })

    /* ------------------------------------------ */
    /* [データ管理]グループトーク受信                      */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_get_admin_voice_comment', function(msg) {
        var w_voice_id          = msg.voice_id
        var w_org_id            = msg.org_id
        var w_user_id           = msg.user_id
        var w_voice_comment_dtm = msg.voice_comment_dtm
        var w_voice_comment     = msg.voice_comment
        var w_hide_flg     = msg.hide_flg
        if (w_hide_flg == 0) {
            var hide_btn_class = "btn-primary"
            var hide_btn_text  = "表示中"
            var hide_btn_flg   = 0
        } else {
            var hide_btn_class = "btn-danger"
            var hide_btn_text  = "非表示"
            var hide_btn_flg   = 1
        }
        var w_hide_user_nm = msg.hide_user_nm
        if (w_hide_user_nm == null) {
            w_hide_user_nm  = '(更新者なし)'
        }
        var w_last_flg     = msg.last_flg

        $('#table_admin_body').append(
            "<tr>"
          +     "<td class='text-center'>" + w_voice_comment_dtm + "</td>"
          +     "<td class='text-center'>"
          +        "<button id='" + w_voice_id + "_"+ w_org_id + "_" + w_user_id +"' type='button' class='btn " + hide_btn_class + "'>"
          +        hide_btn_text
          +        "</button>"
          +     "</td>"
          +     "<td class='text-left'>" + w_voice_comment + "</td>"
          +     "<td class='text-center'>" + w_hide_user_nm + "</td>"
          + "</tr>"
        );

        $("#" + w_voice_id + "_" + w_org_id + "_" + w_user_id).click(function() {
            if ($("#" + w_voice_id + "_" + w_org_id + "_" + w_user_id).hasClass('btn-primary')) {
                $("#" + w_voice_id + "_" + w_org_id + "_" + w_user_id).removeClass('btn-primary');
                $("#" + w_voice_id + "_" + w_org_id + "_" + w_user_id).addClass('btn-danger');
                $("#" + w_voice_id + "_" + w_org_id + "_" + w_user_id).text("非表示");
                _SOK.emit('sok_cli_admin_voice_comment_hide', {
                    voice_id:   w_voice_id
                   ,org_id:   w_org_id
                   ,user_id:   w_user_id
                });
            } else {
                $("#" + w_voice_id + "_" + w_org_id + "_" + w_user_id).removeClass('btn-danger');
                $("#" + w_voice_id + "_" + w_org_id + "_" + w_user_id).addClass('btn-primary');
                $("#" + w_voice_id + "_" + w_org_id + "_" + w_user_id).text("表示中");
                _SOK.emit('sok_cli_admin_voice_comment_disp', {
                    voice_id:   w_voice_id
                   ,org_id:   w_org_id
                   ,user_id:   w_user_id
                });
            }
        })
        if (w_last_flg == 1) {
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_admin").DataTable();
        }
    })

    /* ------------------------------------------ */
    /* [ユーザー管理]状態クリックイベント                   */
    /* ------------------------------------------ */
    $("#admin_user_edit_status").click(function() {
        if ($("#admin_user_edit_status").hasClass('btn-primary')) {
            $("#admin_user_edit_status").removeClass('btn-primary');
            $("#admin_user_edit_status").addClass('btn-danger');
            $("#admin_user_edit_status").text("停止中");
            // hide_btn_flg   = 1
        } else {
            $("#admin_user_edit_status").removeClass('btn-danger');
            $("#admin_user_edit_status").addClass('btn-primary');
            $("#admin_user_edit_status").text("使用可能");
            // hide_btn_flg   = 0
        }
    })

    /* ------------------------------------------ */
    /* [グループ管理]状態クリックイベント                   */
    /* ------------------------------------------ */
    $("#admin_grp_edit_status").click(function() {
        if ($("#admin_grp_edit_status").hasClass('btn-primary')) {
            $("#admin_grp_edit_status").removeClass('btn-primary');
            $("#admin_grp_edit_status").addClass('btn-danger');
            $("#admin_grp_edit_status").text("停止中");
        } else {
            $("#admin_grp_edit_status").removeClass('btn-danger');
            $("#admin_grp_edit_status").addClass('btn-primary');
            $("#admin_grp_edit_status").text("使用可能");
        }
    })


    /* ------------------------------------------ */
    /* [データ管理]トーク受信                           */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_talk_get', function(msg) {
        var w_talk_id      = msg.talk_id
        var w_talk_dtm     = msg.talk_dtm
        var w_talk         = msg.talk
        var w_hide_user_nm = msg.hide_user_nm
        if (w_hide_user_nm == null) {
            w_hide_user_nm  = '(更新者なし)'
        }
        var w_hide_flg     = msg.hide_flg
        var w_last_flg     = msg.last_flg

        if (w_hide_flg == 0) {
            var hide_btn_class = "btn-primary"
            var hide_btn_text  = "表示中"
        } else {
            var hide_btn_class = "btn-danger"
            var hide_btn_text  = "非表示"
        }

        $('#table_admin_body').append(
            "<tr>"
          +     "<td class='text-center'>" + w_talk_id + "</td>"
          +     "<td class='text-center'>"
          +        "<button id='" + w_talk_id + "' type='button' class='btn " + hide_btn_class + "'>"
          +        hide_btn_text
          +        "</button>"
          +     "</td>"
          +     "<td class='text-center'>" + w_talk_dtm + "</td>"
          +     "<td class='text-left'>" + w_talk + "</td>"
          +     "<td class='text-center'>" + w_hide_user_nm + "</td>"
          + "</tr>"
        );
        $("#" + w_talk_id).click(function() {
            if ($("#" + w_talk_id).hasClass('btn-primary')) {
                $("#" + w_talk_id).removeClass('btn-primary');
                $("#" + w_talk_id).addClass('btn-danger');
                $("#" + w_talk_id).text("非表示");
                _SOK.emit('sok_cli_admin_talk_hide', {
                    talk_id:   w_talk_id
                });
            } else {
                $("#" + w_talk_id).removeClass('btn-danger');
                $("#" + w_talk_id).addClass('btn-primary');
                $("#" + w_talk_id).text("表示中");
                _SOK.emit('sok_cli_admin_talk_disp', {
                    talk_id:   w_talk_id
                });
            }
        })
        if (w_last_flg == 1) {
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_admin").DataTable();
        }
    })

    /* ------------------------------------------ */
    /* [データ管理]データ検索ボタン押下                   */
    /* ------------------------------------------ */
    $('#admin_mng_btn').click(function() {
        var w_select  = escapeHTML($('#admin_mng_select').val());
        var w_text    = escapeHTML($('#admin_mng_text').val());
        $('#admin_table_box').empty()
        $('#admin_table_box').append("<strong>対象:" + w_select + "<br>検索条件:" + w_text + "</strong><br><br>")
        $('#admin_table_box').append("<table id='table_admin' class='table table-bordered'></table>")
        // 部分一致
        if (w_select.indexOf('ボイス') > -1) {
            $('#table_admin').append(
                "<thead id='table_admin_head'>"
              +     "<tr>"
              +         "<th class='col-xs-1 text-center'>ID</th>"
              +         "<th class='col-xs-1 text-center'>状態</th>"
              +         "<th class='col-xs-2 text-center'>日時</th>"
              +         "<th class='col-xs-6 text-center'>内容</th>"
              +         "<th class='col-xs-2 text-center'>最終更新者</th>"
              +     "</tr>"
              + "</thead>"
              + "<tbody id='table_admin_body'>"
              + "</tbody>"
            );
            /* ------------------------------------------ */
            /* [データ管理]ボイス取得                           */
            /* ------------------------------------------ */
            _SOK.emit('sok_cli_admin_voice_get', {
                 text:   encodeURIComponent(w_text)
            });
        } else if (w_select.indexOf('グループトーク') > -1) {
            $('#table_admin').append(
                "<thead id='table_admin_head'>"
              +     "<tr>"
              +         "<th class='col-xs-1 text-center'>ID</th>"
              +         "<th class='col-xs-1 text-center'>状態</th>"
              +         "<th class='col-xs-2 text-center'>日時</th>"
              +         "<th class='col-xs-6 text-center'>内容</th>"
              +         "<th class='col-xs-2 text-center'>最終更新者</th>"
              +     "</tr>"
              + "</thead>"
              + "<tbody id='table_admin_body'>"
              + "</tbody>"
            );
            /* ------------------------------------------ */
            /* [データ管理]グループトーク取得                      */
            /* ------------------------------------------ */
            _SOK.emit('sok_srv_get_admin_grp_talk', {
                 text:   encodeURIComponent(w_text)
            });
        } else if (w_select.indexOf('トーク') > -1) {
            $('#table_admin').append(
                "<thead id='table_admin_head'>"
              +     "<tr>"
              +         "<th class='col-xs-1 text-center'>ID</th>"
              +         "<th class='col-xs-1 text-center'>状態</th>"
              +         "<th class='col-xs-2 text-center'>日時</th>"
              +         "<th class='col-xs-6 text-center'>内容</th>"
              +         "<th class='col-xs-2 text-center'>最終更新者</th>"
              +     "</tr>"
              + "</thead>"
              + "<tbody id='table_admin_body'>"
              + "</tbody>"
            );
            /* ------------------------------------------ */
            /* [データ管理]トーク取得                          */
            /* ------------------------------------------ */
            _SOK.emit('sok_cli_admin_talk_get', {
                 text:   encodeURIComponent(w_text)
            });
        } else if (w_select.indexOf('コメント') > -1) {
            $('#table_admin').append(
                "<thead id='table_admin_head'>"
              +     "<tr>"
              +         "<th class='col-xs-2 text-center'>日時</th>"
              +         "<th class='col-xs-1 text-center'>状態</th>"
              +         "<th class='col-xs-7 text-center'>内容</th>"
              +         "<th class='col-xs-2 text-center'>最終更新者</th>"
              +     "</tr>"
              + "</thead>"
              + "<tbody id='table_admin_body'>"
              + "</tbody>"
            );
            /* ------------------------------------------ */
            /* [データ管理]コメント取得                          */
            /* ------------------------------------------ */
            _SOK.emit('sok_srv_get_admin_voice_comment', {
                 text:   encodeURIComponent(w_text)
            });
        }
    })

    /* ------------------------------------------ */
    /* [ユーザー管理]ユーザーリスト受信                   */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_user_list_get', function(msg) {
        var w_user_id               = msg.user_id
        var w_user_nm               = msg.user_nm
        var w_user_auth_nm          = msg.user_auth_nm
        if (w_user_auth_nm == null) {
            w_user_auth_nm  = '一般ユーザー'
        }
        var w_profile_work          = msg.profile_work
        if (w_profile_work == null) {
            w_profile_work  = '(未設定)'
        }
        var w_profile_msg           = msg.profile_msg
        var w_profile_img_file      = msg.profile_img_file
        var w_stop_flg              = msg.stop_flg
        if (w_stop_flg == 1) {
            var w_status = "停止中"
        } else {
            var w_status = "使用可能"
        }
        var w_upd_user_nm           = msg.upd_user_nm
        if (w_upd_user_nm == null) {
            w_upd_user_nm  = '(更新者なし)'
        }
        var w_upd_dtm               = msg.upd_dtm
        var w_last_flg              = msg.last_flg


        $('#table_admin_user_list_body').append(
            "<tr>"
          +     "<td class='text-center'>" + w_user_id + "</td>"
          +     "<td class='text-center'>" + w_user_nm + "</td>"
          +     "<td class='text-center'>" + w_user_auth_nm + "</td>"
          +     "<td class='text-center'>" + w_profile_work + "</td>"
          +     "<td class='text-center'>" + w_status + "</td>"
          +     "<td class='text-center'>" + w_upd_user_nm + "</td>"
          +     "<td class='text-center'>" + w_upd_dtm + "</td>"
          + "</tr>"
        );

        if (w_last_flg == 1) {
            // 2回目以降は意味なし。。10個にまとまらない
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_admin_user_list").DataTable();
        }
    })


    /* ------------------------------------------ */
    /* [グループ管理]グループリスト受信                   */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_admin_grp_list_get', function(msg) {
        var w_grp_id       = msg.grp_id
        var w_grp_nm       = msg.grp_nm
        var w_stop_flg     = msg.stop_flg
        if (w_stop_flg == 1) {
            var w_grp_status = "停止中"
        } else {
            var w_grp_status = "使用可能"
        }
        var w_last_flg              = msg.last_flg

        $('#table_admin_grp_edit_body').append(
            "<tr>"
          +     "<td class='text-center'>" + w_grp_id + "</td>"
          +     "<td class='text-center'>" + w_grp_nm + "</td>"
          +     "<td class='text-center'>" + w_grp_status + "</td>"
          + "</tr>"
        );

        if (w_last_flg == 1) {
            // 2回目以降は意味なし。。10個にまとまらない
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_admin_grp_list").DataTable();
        }
    })


    /* ------------------------------------------ */
    /* [形態素解析]サンプルデータ        　              */
    /* ------------------------------------------ */
    /*
    var sample_data = [
      {"value": 100, "name": "alpha"},
      {"value": 70, "name": "beta"},
      {"value": 40, "name": "gamma"},
      {"value": 15, "name": "delta"},
      {"value": 15, "name": "a"},
      {"value": 15, "name": "b"},
      {"value": 15, "name": "c"},
      {"value": 15, "name": "d"},
      {"value": 15, "name": "e"},
      {"value": 15, "name": "f"},
      {"value": 15, "name": "g"},
      {"value": 15, "name": "h"},
      {"value": 5, "name": "epsilon"},
      {"value": 1, "name": "zeta"}
    ]
    var visualization = d3plus.viz()
      .container("#viz")  // container DIV to hold the visualization
      .data(sample_data)  // data to use with the visualization
      .type("tree_map")   // visualization type
      .id("name")         // key for which our data is unique on
      .size("value")      // sizing of blocks
      .draw()             // finally, draw the visualization!
    */
})

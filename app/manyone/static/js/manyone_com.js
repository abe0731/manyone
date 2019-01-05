/* ------------------------------------------ */
/* グローバル変数                                 */
/* ------------------------------------------ */
_SOK = io.connect('//' + document.domain + ':' + location.port + '/sok');
/* ------------------------------------------ */
/* DOMツリー構築後処理                           */
/* ------------------------------------------ */
$(document).ready(function () {

    /* ------------------------------------------ */
    /* select2 セレクトBOX            　              */
    /* ------------------------------------------ */
    $(".select2").select2()
    // タイトルを削除する
    $('.select2-selection__rendered').removeAttr('title');
    $('.select2').on('change', function(evt) {
        $('.select2-selection__rendered').removeAttr('title');
    });
    $('.scrollbar-macosx').scrollbar();

    /* ------------------------------------------ */
    /* 二重ログイン受信                　              */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_disconnect', function(msg) {
        var w_message      = msg.message
        swal({
             title: 'エラーが発生しました'
            ,text: w_message
            ,type: 'error'
            ,allowOutsideClick: false
            ,allowEscapeKey: false
            ,allowEnterKey: false
            ,showConfirmButton: false
        })
    })

    /* ------------------------------------------ */
    /* [ユーザー]ユーザー情報受信                       */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_get_m_user', function(msg) {
        var w_org_nm           = msg.org_nm
        var w_user_nm          = msg.user_nm
        if (!msg.profile_work) {
            var w_profile_work     = "(未設定)"
        } else {
            var w_profile_work     = msg.profile_work
        }
        if (!msg.profile_msg) {
            var w_profile_msg     = "(未設定)"
        } else {
            var w_profile_msg     = msg.profile_msg
            var w_profile_msg     = w_profile_msg.replace(/\r?\n/g, '<br>');
        }
        if (!msg.profile_img_file) {
            var w_profile_img_file = "noimage.png"
        } else {
            var w_profile_img_file = msg.profile_img_file
        }
        $('#modal_h').append(
             "<div class='text-center'>"
          +     "<h3>プロフィール</h3>"
          +  "</div>"
        );
        $('#modal_b').append(
            "<div class='text-center'>"
          +     "<img class='img-circle' src='/static/img/user/" + w_profile_img_file + "' onerror=this.src='/static/img/user/noimage.png' style='width:200px'/>"
          + "</div>"
          + "<br>"
          + "<div class='text-center'>"
          +     "<h3 id='prof_user_nm' class='profile-username text-center'>"
          +         w_user_nm
          +     "</h3>"
          +     "<strong>組織</strong>"
          +     "<p>"
          +         w_org_nm
          +     "</p>"
          +     "<br>"
          +     "<strong>仕事</strong>"
          +     "<p id='prof_user_work' style='width:100%;'>"
          +         w_profile_work
          +     "</p>"
          +     "<br>"
          +     "<strong>メッセージ</strong>"
          +     "<p id='prof_user_msg' style='width:100%;'>"
          +         w_profile_msg
          +     "</p>"
          + "</div>"
        );
        $('#modal_f').append(
            "<div class='text-center'>" +
                "<button type='button' class='btn btn-primary' data-dismiss='modal' onclick='fnc_start_modal_video()'>" +
                "ビデオ通話" +
                "</button>" +
                /*
                "<button id='save' type='button' class='btn btn-primary' data-dismiss='modal' onclick='screen_modal()'>" +
                "<i class='fa fa-window-restore'></i> 画面共有する" +
                "</button>" +
                */
            "</div>"
        );
    })


    /* ------------------------------------------ */
    /* サイドバーのレイアウト                            */
    /* ------------------------------------------ */
    // 初期値
    var w = $(window).width();
    $("#my_user_sidebar").css("width", w/2 + "px");
//    $(".container").css("width", w + "px");

    // リサイズイベント
    $(window).resize(function() {
        var w = $(window).width();
        $("#my_user_sidebar").css("width", w/2 + "px");
//        $(".container").css("width", w + "px");
    });


    /* ------------------------------------------ */
    /* [個人集計]ボイス数受信                         */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_common_my_voice_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#my_voice_cnt').empty()
        $('#my_voice_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [個人集計]ボイスコメント数受信                    */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_common_my_voice_comment_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#my_voice_comment_cnt').empty()
        $('#my_voice_comment_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [個人集計]トーク数(送信)受信                    */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_common_my_talk_send_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#my_talk_send_cnt').empty()
        $('#my_talk_send_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [個人集計]トーク数(受信)受信                    */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_common_my_talk_resv_cnt_get', function(msg) {
        var w_count     = msg.count
        $('#my_talk_resv_cnt').empty()
        $('#my_talk_resv_cnt').append(w_count)
    })

    /* ------------------------------------------ */
    /* [個人集計]ビデオ集計受信(通話時間)               */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_common_my_video_tatal_get_time', function(msg) {
        var w_sum_dtm     = msg.sum_dtm
        $('#my_video_tatal_time').empty()
        $('#my_video_tatal_time').append(w_sum_dtm)
    })

    /* ------------------------------------------ */
    /* [個人集計]通話 発信着信数                        */
    /* ------------------------------------------ */
    _SOK.on('sok_srv_common_my_video_tatal_get_call_resv_cnt', function(msg) {
        var w_call_count     = msg.call_count
        var w_resv_count     = msg.resv_count
        $('#my_video_tatal_call_resv_cnt').empty()
        $('#my_video_tatal_call_resv_cnt').append(w_call_count + '/' + w_resv_count)
    })



    /* ------------------------------------------ */
    /* [個人集計]ボイス集計受信                       */
    /* ------------------------------------------ */
    var w_my_voice_labels       = []
    var w_my_voice_data         = []
    var w_my_voice_comment_data = []
    _SOK.on('sok_srv_common_my_voice_tatal_get', function(msg) {
        var w_type     = msg.type
        var w_year     = msg.year
        var w_month    = msg.month
        var w_count    = msg.count
        var w_last_flg = msg.last_flg

        if (w_my_voice_labels.indexOf(w_year + "/" + w_month) == -1) {
            w_my_voice_labels.push(w_year + "/" + w_month);
            w_my_voice_data.push(0);
            w_my_voice_comment_data.push(0);
        }
        if ( w_type == 'voice') {
            w_my_voice_data.pop();
            w_my_voice_data.push(w_count);
        } else if ( w_type == 'comment') {
            w_my_voice_comment_data.pop();
            w_my_voice_comment_data.push(w_count);
        }

        if (w_last_flg == 1) {

            var barChartData = {
                    labels: w_my_voice_labels,
                    datasets: [{
                        label: 'ボイス数',
                        backgroundColor: '#00c0ef',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_my_voice_data
                    }, {
                        label: 'コメント数',
                        backgroundColor: '#3c8dbc',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_my_voice_comment_data
                    }]
                }
            var my_voice_tatal = document.getElementById("my_voice_tatal").getContext("2d");
            window.myBar = new Chart(my_voice_tatal, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend:　false,
                    title: {
                        display: true,
                        text: '月別ボイス数'
                    }
                }
            });
        }
    })

    /* ------------------------------------------ */
    /* [個人集計]トーク集計受信                        */
    /* ------------------------------------------ */
    var w_my_talk_labels    = []
    var w_my_talk_send_data = []
    var w_my_talk_resv_data = []
    _SOK.on('sok_srv_common_my_talk_tatal_get', function(msg) {
        var w_type     = msg.type
        var w_year     = msg.year
        var w_month    = msg.month
        var w_count    = msg.count
        var w_last_flg = msg.last_flg

        if (w_my_talk_labels.indexOf(w_year + "/" + w_month) == -1) {
            w_my_talk_labels.push(w_year + "/" + w_month);
            w_my_talk_send_data.push(0);
            w_my_talk_resv_data.push(0);
        }
        if ( w_type == 'send') {
            w_my_talk_send_data.pop();
            w_my_talk_send_data.push(w_count);
        } else if ( w_type == 'resv') {
            w_my_talk_resv_data.pop();
            w_my_talk_resv_data.push(w_count);
        }

        if (w_last_flg == 1) {
            var barChartData = {
                    labels: w_my_talk_labels,
                    datasets: [{
                        label: '送信数',
                        backgroundColor: '#00a65a',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_my_talk_send_data
                    }, {
                        label: '受信数',
                        backgroundColor: '#f39c12',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_my_talk_resv_data
                    }]
                }
            var my_talk_tatal = document.getElementById("my_talk_tatal").getContext("2d");
            window.myBar = new Chart(my_talk_tatal, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend:　false,
                    title: {
                        display: true,
                        text: '月別トーク数'
                    }
                }
            });
        }
    })

    /* ------------------------------------------ */
    /* [個人集計]ビデオ集計受信(通話回数)               */
    /* ------------------------------------------ */
    var w_my_video_labels        = []
    var w_my_video_call_data     = []
    var w_my_video_resv_data     = []
    _SOK.on('sok_srv_common_my_video_tatal_get_cnt', function(msg) {
        var w_type     = msg.type
        var w_year     = msg.year
        var w_month    = msg.month
        var w_count    = msg.count
        var w_last_flg = msg.last_flg

        if (w_my_video_labels.indexOf(w_year + "/" + w_month) == -1) {
            w_my_video_labels.push(w_year + "/" + w_month);
            w_my_video_call_data.push(0);
            w_my_video_resv_data.push(0);
        }
        if ( w_type == 'call') {
            w_my_video_call_data.pop();
            w_my_video_call_data.push(w_count);
        } else if ( w_type == 'resv') {
            w_my_video_resv_data.pop();
            w_my_video_resv_data.push(w_count);
        }

        if (w_last_flg == 1) {

            var barChartData = {
                labels: w_my_video_labels,
                    datasets: [{
                        label: '発信数',
                        backgroundColor: '#dd4b39',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_my_video_call_data
                    }, {
                        label: '着信数',
                        backgroundColor: '#800080',
                        borderColor: '#BBBBBB',
                        borderWidth: 1,
                        data: w_my_video_resv_data
                    }]
               }

            var my_video_tatal = document.getElementById("my_video_tatal").getContext("2d");
            window.myBar = new Chart(my_video_tatal, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend:　false,
                    title: {
                        display: true,
                        text: '月別通話回数'
                    }
                }
            });
        }
    })

    /* ------------------------------------------ */
    /* [個人管理]トーク受信                           */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_get_my_talk', function(msg) {
        var w_talk_id      = msg.talk_id
        var w_talk_dtm     = msg.talk_dtm
        var w_talk         = msg.talk
        var w_send_user_nm = msg.send_user_nm
        var w_resv_user_nm = msg.resv_user_nm
        var w_last_flg     = msg.last_flg
        $('#table_com_body').append(
            "<tr>"
          +     "<td>" + w_send_user_nm + "</td>"
          +     "<td>" + w_resv_user_nm + "</td>"
          +     "<td>" + w_talk_dtm + "</td>"
          +     "<td>" + w_talk + "</td>"
          + "</tr>"
        );
        if (w_last_flg == 1) {
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_com").DataTable();
        }
    })
    /* ------------------------------------------ */
    /* [個人管理]グループトーク受信                           */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_get_my_grp_talk', function(msg) {
        var w_grp_talk_id  = msg.grp_talk_id
        var w_grp_talk_dtm = msg.grp_talk_dtm
        var w_grp_talk     = msg.grp_talk
        var w_grp_nm       = msg.grp_nm
        var w_last_flg     = msg.last_flg
        $('#table_com_body').append(
            "<tr>"
          +     "<td>" + w_grp_nm + "</td>"
          +     "<td>" + _LOGIN_USER_NM + "</td>"
          +     "<td>" + w_grp_talk_dtm + "</td>"
          +     "<td>" + w_grp_talk + "</td>"
          + "</tr>"
        );
        if (w_last_flg == 1) {
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_com").DataTable();
        }
    })
    /* ------------------------------------------ */
    /* [個人管理]ボイス受信                           */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_get_my_voice', function(msg) {
        var w_voice_id      = msg.voice_id
        var w_voice_dtm     = msg.voice_dtm
        var w_voice         = msg.voice
        var w_user_nm       = msg.user_nm
        var w_last_flg      = msg.last_flg
        $('#table_com_body').append(
            "<tr>"
          +     "<td>" + w_user_nm + "</td>"
          +     "<td>" + w_voice_dtm + "</td>"
          +     "<td>" + w_voice + "</td>"
          + "</tr>"
        );
        if (w_last_flg == 1) {
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_com").DataTable();
        }
    })
    /* ------------------------------------------ */
    /* [個人管理]ボイスコメント受信                      */
    /* ------------------------------------------ */
    _SOK.on('sok_cli_get_my_voice_comment', function(msg) {
        var w_voice_id          = msg.voice_id
        var w_voice_comment_dtm = msg.voice_comment_dtm
        var w_voice_comment     = msg.voice_comment
        var w_user_nm           = msg.user_nm
        var w_last_flg          = msg.last_flg
        $('#table_com_body').append(
            "<tr>"
          +     "<td>" + _LOGIN_USER_NM + "</td>"
          +     "<td>" + w_user_nm + "</td>"
          +     "<td>" + w_voice_comment_dtm + "</td>"
          +     "<td>" + w_voice_comment + "</td>"
          + "</tr>"
        );
        if (w_last_flg == 1) {
            $.extend( $.fn.dataTable.defaults, {
                language: { url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json" }
            });
            $("#table_com").DataTable();
        }
    })

    /* ------------------------------------------ */
    /* [個人管理]データ検索ボタン押下                   */
    /* ------------------------------------------ */
    $('#my_mng_btn').click(function() {
        var w_select  = escapeHTML($('#my_mng_select').val());
        var w_text    = escapeHTML($('#my_mng_text').val());
        $('#table_box').empty()
        $('#table_box').append("<strong>対象:" + w_select + "<br>検索条件:" + w_text + "</strong><br><br>")
        $('#table_box').append("<table id='table_com' class='table table-bordered'></table>")
        // 部分一致
        if (w_select.indexOf('ボイス') > -1) {
            $('#table_com').append(
                "<thead id='table_com_head'>"
              +     "<tr>"
              +         "<th class='col-xs-3'>発信者</th>"
              +         "<th class='col-xs-3'>日時</th>"
              +         "<th class='col-xs-6'>内容</th>"
              +     "</tr>"
              + "</thead>"
              + "<tbody id='table_com_body'>"
              + "</tbody>"
            );
            /* ------------------------------------------ */
            /* [個人管理]ボイス取得                           */
            /* ------------------------------------------ */
            _SOK.emit('sok_srv_get_my_voice', {
                 text:   encodeURIComponent(w_text)
            });
        } else if (w_select.indexOf('グループトーク') > -1) {
            $('#table_com').append(
                "<thead id='table_com_head'>"
              +     "<tr>"
              +         "<th class='col-xs-2'>グループ名</th>"
              +         "<th class='col-xs-2'>受信者</th>"
              +         "<th class='col-xs-3'>日時</th>"
              +         "<th class='col-xs-5'>内容</th>"
              +     "</tr>"
              + "</thead>"
              + "<tbody id='table_com_body'>"
              + "</tbody>"
            );
            /* ------------------------------------------ */
            /* [個人管理]グループトーク取得                      */
            /* ------------------------------------------ */
            _SOK.emit('sok_srv_get_my_grp_talk', {
                 text:   encodeURIComponent(w_text)
            });
        } else if (w_select.indexOf('トーク') > -1) {
            $('#table_com').append(
                "<thead id='table_com_head'>"
              +     "<tr>"
              +         "<th class='col-xs-2'>送信者</th>"
              +         "<th class='col-xs-2'>受信者</th>"
              +         "<th class='col-xs-3'>日時</th>"
              +         "<th class='col-xs-5'>内容</th>"
              +     "</tr>"
              + "</thead>"
              + "<tbody id='table_com_body'>"
              + "</tbody>"
            );
            /* ------------------------------------------ */
            /* [個人管理]トーク取得                           */
            /* ------------------------------------------ */
            _SOK.emit('sok_srv_get_my_talk', {
                 text:   encodeURIComponent(w_text)
            });
        } else if (w_select.indexOf('コメント') > -1) {
            $('#table_com').append(
                "<thead id='table_com_head'>"
              +     "<tr>"
              +         "<th class='col-xs-2'>コメント者</th>"
              +         "<th class='col-xs-2'>発信者</th>"
              +         "<th class='col-xs-3'>日時</th>"
              +         "<th class='col-xs-5'>内容</th>"
              +     "</tr>"
              + "</thead>"
              + "<tbody id='table_com_body'>"
              + "</tbody>"
            );
            /* ------------------------------------------ */
            /* [個人管理]トーク取得                           */
            /* ------------------------------------------ */
            _SOK.emit('sok_srv_get_my_voice_comment', {
                 text:   encodeURIComponent(w_text)
            });
        }
    })
    /* ------------------------------------------ */
    /* [個人管理]カラム選択                           */
    /* ------------------------------------------ */
    /*
    $('#table_com td').on('click',function(){
        var cur_td     = $(this).text();
        var cur_tr     = $(this).parent().text();
        var cur_tr_csv = $(this).parent().text().replace(/<td>/g,'').replace(/<\/td>/g,',');
        alert(cur_td)
        alert(cur_tr)
        alert(cur_tr_csv)
    })
    */


})


/**
 * @return {string}
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return '';
}

function go_url(url, act) {
    if (url === undefined || url === '') {
        return;
    }
    if (act !== undefined) {
        window.location.href = url;
    } else {
        window.open(url);
    }
}

//切换接口类型
function switch_interface_type(e) {
    var target = $(e).data('target_change');
    var connect_type = $("#" + target);
    switch ($(e).val()) {
        case "WAN":
            connect_type.val('PPPoE');
            switch_connect_type(connect_type);
            break;
        case "CMCC":
            connect_type.val('Static');
            switch_connect_type(connect_type);
            break;
        default:
            connect_type.val('DHCP');
            switch_connect_type(connect_type);
            break;
    }
}

//切换上网方式
function switch_connect_type(e) {
    var pppoe_div = $("#" + $(e).data("target_pppoe"));
    var static_ip_div = $("#" + $(e).data("target_static_ip"));
    var dhcp_div = $("#" + $(e).data("target_dhcp"));
    switch ($(e).val()) {
        case "PPPoE":
            pppoe_div.show();
            static_ip_div.hide();
            dhcp_div.hide();
            break;
        case "Static":
            static_ip_div.show();
            pppoe_div.hide();
            dhcp_div.hide();
            break;
        default:
            dhcp_div.show();
            pppoe_div.hide();
            static_ip_div.hide();
            break;
    }
}

// 新建、编辑主机
function host_action(h_id, act) {
    var action = '';
    var m_title = '';
    if (act != undefined && act == "a") {
        m_title = '从日志新建主机';
        action = '/devices/xrouter/' + h_id + '/addHostFromLogcat';
    }
    else if (h_id != undefined) {
        m_title = '编辑主机';
        action = '/devices/xrouter/' + h_id + '/edit';
    } else {
        m_title = '新建主机';
        action = '/devices/xrouter/create?';
    }
    $.get(action, {id: h_id}, function (data) {
        if (data != undefined) {
            $("#blackJack_dialog").addClass("modal-lg");
            $("#blackJack_modal_title").text(m_title);
            $("#blackJack_modal_body").html(data);
            $("#blackJack").modal("show");

            $("#myEditHostForm").validate({
                rules: {
                    'data[host_name]': "required",
                },
                submitHandler: function (form) {
                    $(form).ajaxSubmit({
                        success: function (data, textStatus, jqXHR) {
                            alert(data.message);
                            if (data.code == 1) {
                                location.reload();
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(errorThrown);
                        }
                    });
                }
            });
        } else {
            $("#blackJack_modal_title").html("");
            $("#blackJack_modal_body").html("");
            alert('无法读取主机记录');
        }
    });
}

// 编辑接口
function interface_action(v_id, act) {
    $("#blackJack").removeClass("modal-lg");
    var m_title;
    var m_action;
    if (act != undefined && act == "a") {
        m_title = '增加接口';
        m_action = '/devices/xrouter/createInterface?';

    } else {
        m_title = '编辑接口　';
        m_action = '/devices/xrouter/' + v_id + '/editInterface';
    }
    if (v_id != undefined && v_id != "") {
        $.get(m_action, function (data) {
            if (data != undefined) {
                $("#blackJack_modal_body").html(data);
                $("#blackJack_modal_title").text(m_title + $("#my_interface_name").val());
                if (act != undefined && act == "a") {
                    $('#if_host_id').val(v_id);
                    $("#div_my_pppoe_group").show();
                }
                $("#blackJack").modal("show");

                $("#myEditInterfaceForm").validate({
                    rules: {
                        'data[host_id]': "required",
                        'data[interface_name]': "required",
                    },
                    submitHandler: function (form) {
                        $(form).ajaxSubmit({
                            beforeSubmit: function () {
                                if ($("#if_host_id").val() == '') {
                                    alert('异常，没有对应的主机ID');
                                    return false;
                                }
                            },
                            success: function (data, textStatus, jqXHR) {
                                alert(data.message);
                                if (data.code == 1) {
                                    location.reload();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(errorThrown);
                            }
                        });
                    }
                });

            } else {
                $("#blackJack_title").html("");
                $("#blackJack_body").html("");
                alert('无法读取接口记录');
            }
        });
    }
}

function delete_interface() {
    var m_interface_id = $('#modal_editInterface_id');
    if (m_interface_id === undefined || m_interface_id.val() === '') {
        alert('接口ID为空，请刷新页面。');
    } else {
        if (confirm('确认删除此接口？')) {
            $.post("/devices/xrouter/deleteOldInterface", {
                    interface_id: m_interface_id.val(),
                },
                function (data) {
                    alert(data.message);
                    if (data.code === 1) {
                        $('#modal_editInterface_id').val('');
                        $('#editInterfaceModal').modal('hide');
                        window.location.reload();
                    }
                });
        }
    }
}

$(document).ready(function () {

    $('.ed_interface').on('click', function () {
        interface_action($(this).data('interface_id'));
    });

    $('.ed_host').on('click', function () {
        host_action($(this).data('host_id'));
    });

    $('#blackJack').on('hide.bs.modal', function () {
        $("#blackJack_modal_title").html("");
        $("#blackJack_modal_body").html("");
        $("#blackJack_dialog").removeClass("modal-lg");
    });

    // 模态框确认按钮提交
    $("#blackJack_modal_submit").click(function () {
        $("#blackJack form:first").submit();
    });

});


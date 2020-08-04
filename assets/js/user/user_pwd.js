$(function() {
    var form = layui.form;
    var layer = layui.layer;
    //为form表单增加验证规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新旧密码不能相同!';
            }
        },
        rePwd: function(value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '两次密码不一致!';
            }
        }
    });

    // 发起请求实现重置密码的功能
    $('.layui-form').on('submit', function(e) {
        //阻止表单默认提交事件
        e.preventDefault();
        //发送ajax请求更新密码
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败!');
                }
                layer.msg('更新密码成功!');
                //重置表单
                $('.layui-form')[0].reset();
            }
        });
    });
})
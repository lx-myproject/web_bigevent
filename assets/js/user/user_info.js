$(function() {
    var form = layui.form;
    var layer = layui.layer;
    // 初始化个人信息
    initUserInfo();
    // 为昵称表单增加验证规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间!';
            }
        }
    });

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!');
                }
                form.val('formUserInfo', res.data);
            }
        });
    }

    //重置表单数据阻止表单的默认重置行为，再重新获取用户信息即可
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })

    //监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        //阻止表单默认的提交行为
        e.preventDefault();
        //发送ajax请求更新用户信息
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg('更新用户信息成功');
                // 注意： <iframe> 中的子页面，如果想要调用父页面中的方法，使用 window.parent 即可。
                // 调用父页面的getUserInfo()函数更新用户头像和用户信息
                window.parent.getUserInfo();
            }
        });
    })

})
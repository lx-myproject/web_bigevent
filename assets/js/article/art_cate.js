$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }
    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    });

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        //阻止表单默认提交行为
        e.preventDefault();
        //发送ajax请求添加文章分类
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败!');
                }
                layer.msg('新增分类成功!');
                //重新获取文章分类列表更新页面
                initArtCateList();
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    });

    //通过代理的形式为btn-edit编辑按钮绑定点击事件,因为按钮是动态生成的
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        //点击或弹出一个可以修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        // 在展示弹出层之后，根据 id 的值发起请求获取文章分类的数据，并填充到表单中
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                //给表单赋值
                form.val('form-edit', res.data);
            }
        });
        // 通过代理的形式，为修改分类的表单绑定 submit 事件
        $('body').on('submit', '#form-edit', function(e) {
            //阻止表单的默认提交行为
            e.preventDefault();
            //发送ajax请求更新文章分类信息
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类信息失败！');
                    }
                    layer.msg('更新分类信息成功！');
                    //关闭小窗口
                    layer.close(indexEdit);
                    //更新分类数据
                    initArtCateList();
                }
            });
        });
    });

    //通过代理的形式为btn-delete删除按钮绑定点击事件,因为按钮是动态生成的
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！');
                    }
                    layer.msg('删除文章分类成功！');
                    //关闭小窗口
                    layer.close(index);
                    //从新获取文章分类列表
                    initArtCateList();
                }
            });

        });
    });
})
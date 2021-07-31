$(function() {
  var layer = layui.layer
  var form = layui.form
  // 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
  aspectRatio: 400 / 280,
  preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options)
$('#btnChooseImage').on('click', function() {
	$('#coverFile').click()
})
  initCate()
  initEditor()
  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用 form.render() 方法
        form.render()
      }
    })
  }
  $('#btnChooseImage').on('click', function() {
    $('#coverFile').click()
  })
  $('#coverFile').on('change',function(e){
    const files=e.target.files
    if(files.length===0){
      return
    }
    const newImgURL=URL.createObjectURL(files[0])
    $image
    .cropper('destroy')
    .attr('src',newImgURL)
    .cropper(options)
  })
  var art_state = '已发布'
  $('#btnSave2').on('click', function() {
    art_state = '草稿'
})
$('#form-pub').on('submit',function(e){
  e.preventDefault
  const fd=new FormData($(this)[0])
  fd.append('state',art)
  $image
  .cropper('getCroppedCanvas', {
    // 创建一个 Canvas 画布
    width: 400,
    height: 280
  })
  .toBlob(function(blob) {
    // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
    // 5. 将文件对象，存储到 fd 中
    
    fd.append('cover_img', blob)
    for(const formDatum of fd){
      console.log(formDatum);
    }
    // 6. 发起 ajax 数据请求
    publishArt(fd)
  })
})
function publishArt(fd){
  $.ajax({
    method:'POST',
    url:'/my/article/add',
    data:fd,
    contentType:false,
    processData:false,
    success(res){
      console.log(res);
      if(res.status!==0){return layer.msg(res.message)}
      layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
    }
  })
}
})
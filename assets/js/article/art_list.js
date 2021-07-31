$(function(){
  const laypage=layui.laypage
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)
  
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
  
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
  
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  
  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  initTable()
  function initTable(){
    $.ajax({
      method:'GET',
      url:'/my/article/list',
      data:q,
      success:function(res){
        if(res.status!==0){
          return layer.msg('获取文章列表失败！')
        }const htmlStr=template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }
  initCate()

// 初始化文章分类的方法
function initCate() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success: function(res) {
      if (res.status !== 0) {
        return layer.msg('获取分类数据失败！')
      }
      const form=layui.form
      
      const htmlStr = template('tpl-cate', res)
      $('[name=cate_id]').html(htmlStr)
     
      
      form.render()
     
    }
  })
}
$('#form-search').on('submit', function(e) {
  e.preventDefault()
  
  const cate_id = $('[name=cate_id]').val()
  const state = $('[name=state]').val()
  
  q.cate_id = cate_id
  q.state = state
 
  initTable()
})

function renderPage(total) {
 
  laypage.render({
    elem: 'pageBox',
    count: total,
    limit: q.pagesize, 
    curr: q.pagenum ,
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    limits: [1,2, 3, 5, 10],
    jump: function(obj, first) {
     
      console.log(first)
      console.log(obj.curr)
      
      q.pagenum = obj.curr
      q.pagesize = obj.limit
      if (!first) {
        initTable()
      }
    }
  })}
  $('tbody').on('click', '.btn-delete', function() {
   
    const id = $(this).attr('data-id')
   const len=$('.btn-delete').length
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          if(len===1){
            q.pagenum=q.pagenum===1?1:q.pagenum-1
          }
          initTable()
        }
      })

      layer.close(index)
    })
})
})

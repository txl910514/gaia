 var _ip = 'http://121.42.187.170';
 // var _ip = 'http://192.168.6.23:8080';
 // var _ip = 'http://10.0.1.156:8080';

/*----------
 * 头部页面头部
 *-----------------------------*/
// ，消息<span>2</span>
if (!$('.login-box').length) {
    var header = new Vue({
        el:'#header',
        data:{
            datas: '<div class="right-user"><div class="right t" id="headusername">小丽</div>' +
            '<div class="head-down"><ul><li><a href="edit-pwd.html">修改密码</a></li><li><a onclick="loginOut()">退出系统</a></li></ul></div><div>'
        }
    });
    /*----------
     * 侧边导航
     *-----------------------------*/
    var aside = new Vue({
        el:'#aside',
        data:{
            datas: '<aside class="aside"> <div class="logo">运营平台</div><ul class="menu">'+

            '<li id="promanage"><div class="menu-first"><i class="project"></i>项目管理</div>'+
            '<dl class="menu-second">'+
            '<dd><a href="mems-pro-list.html" id="prolit">项目列表</a></dd>'+
            '</dl>'+
            '</li>'+
            '<li id="needmange"><div class="menu-first"><i class="need"></i>需求管理</div>'+
            '<dl class="menu-second">'+
            '<dd><a href="pm-need-list.html" id="needlist">需求池</a></dd>'+
            '<dd><a href="pm-bug-list.html" id="buglist">缺陷池</a></dd>'+
            '</dl>'+
            '</li>'+
            '<li id="system"><div class="menu-first"><i class="system"></i>系统配置</div>'+
            '<dl class="menu-second">'+
            '<dd><a href="user-manage.html" id="usermanage">用户管理</a></dd>'+
            '<dd><a href="organize-architecture.html" id="organize">组织架构</a></dd>'+
            '<dd><a href="tag-manage.html" id="tagmanage">标签管理</a></dd>'+
            '</dl>'+
            '</li>'+
            '<li id="documentmanage"><div class="menu-first"><i class="project"></i>文档管理</div>'+
            '<dl class="menu-second">'+
            '<dd><a href="doc-manage.html" id="documentmanage">文档管理</a></dd>'+
            '</dl>'+
            '</li>'+
            '</ul></aside>'
        }
    });
    /*----------
     * 判断是否登陆
     *-----------------------------*/
    var globleUserId;
    function isLogin(){
        var url = _ip + '/user/getLoginUserInfo';
        $.ajax({
            url:url,
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            dataType: 'json',
            contentType:'application/json',
            jsonpCallback: 'login',
            success: function(json) {
                if(!json.success){
                    location.href = 'user-login.html';
                }
                else {
                    $.cookie('username',json.data.userName);
                    $.cookie('userid',json.data.id);
                }
            }
        })
    }

    isLogin();
    globleUserId = parseInt($.cookie('userid'));
}
$('#headusername').html($.cookie('username'));

function loginOut(){
    var url = _ip + '/loginOut';
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        contentType: 'application/json',
        jsonpCallback: 'loginOut',
        success: function (json) {
            if (json.success) {
                location.href = 'user-login.html';
            }
        }
    })
}


function modityAsideCurrent(){
    var pathname = location.pathname;

    var obj = {

        promanage:{
            prolit:['mems-pro-list','mems-pro-list-myself','mems-pro-creat-1','mems-pro-detail-baseinfo','mems-pro-creat-1','mems-pro-creat-2','mems-pro-creat-3']
        }, //项目管理文件列表
        needmange:{
            needlist:['pm-need-list','pm-need-commite','pm-need-list-meme','pm-need-commite-pm','pm-need-detail-pm','pm-need-commite','pm-commite-relative','pm-need-detail-mems'],
            buglist:['pm-bug-list','pm-bug-commite','pm-bug-detail','pm-bug-detail-edit']
        },   //需求管理文件列表
        system:{
            usermanage:['user-manage'],
            organize:['organize-architecture'],
            tagmanage:['tag-manage']
        },      //系统配置文件列表
        documentmanage:{
            docmanage:['doc-manage']
        }   //文档管理文件列表
    }

    for(var k in obj){
        var first = obj[k];
        for(var i in first){
            var second = first[i];
            for(var j = 0, jj = second.length; j < jj; j++){
                var pagename = second[j];
                if(pathname.indexOf(pagename) > -1){
                    $('#'+k).find('div.menu-first').addClass('current');
                    $('#'+i).addClass('current');
                    break;
                }

            }
        }
    }

}

modityAsideCurrent();    



/*----------
 * 弹框相关的通用样式
 *-----------------------------*/
var $$ = {}
/*----------
 * 显示遮罩层
 * @ param {number} zIndex
 * @ return {jqueryDom} 弹出层jQuery对象
 *-----------------------------*/
$$.showMask = function(zIndex, config) {
    config = config || {};
    if ( $$._maskDom ) $$.hideMask();
    var setting = {
        background: config.background ? config.background : 'rgba(0,0,0,0.5)'
    };
    zIndex = zIndex || 500;
    var mask = document.createElement("div"),
        h =  (document.body.scrollHeight >= window.screen.availHeight)?document.body.scrollHeight:window.screen.availHeight;
    mask.id = "JS_mask";
    mask.style.cssText = "height:"+h+"px;width:100%;position:absolute;background:"+setting.background+";top:0;left:0;z-index:"+zIndex;
    $$._maskDom = $(mask);

    $("body").append($$._maskDom);
    return $$._maskDom;
}
/*----------
 * 漂浮弹框
 * @ param  {string} html    弹出的html代码{=id} 为当前dom id
 * @ param  {Object} buttons 按钮对象{'确定':function(){},'关闭':'close'}
 * @ param  {number}  zIndex
 * @ param  {String}  style 最外框样式
 * @ param  {Boolean} showMask 是否显示遮罩层
 * @ param  {String}  clasName 最外框class
 * @ return {Dom Object}     自身Dom,非jQueryDom
 *-----------------------------*/
$$.layer = function(html, config) {
    config = config || {};
    var setting = {
        zIndex: config.zIndex || 500,
        fixedBoxTop: config.fixedBoxTop || 200,
        contentBoxWidth: config.contentBoxWidth || '90%',
        isShowMask: config.isShowMask || false

    };

    setting.fixedBoxTop = setting.fixedBoxTop + 'px';
    setting.fixedBoxTop = parseInt(setting.fixedBoxTop.replace(/px/g, ''));

    var
        Dom = document.createElement("div"),
        t = new Date(),
        scrollTop = $(window).scrollTop(),
        tmpId = t.getTime().toString(36),
        focus = true,
        id = "JS_lightBox_" + tmpId;

    Dom.id = id;
    Dom.className = 'mob_ligthBox';
    Dom.style.cssText = 'width:100%;position:absolute;left:0;';
    Dom.style.top = setting.fixedBoxTop + scrollTop + 'px';
    Dom.style.zIndex = setting.zIndex;
    Dom.innerHTML = '<div class="mob-layer-content" style="margin-left:auto;margin-right:auto;width:'+setting.contentBoxWidth+'">'+html+'</div>';
    document.body.appendChild(Dom);
    Dom._showMask = config.isShowMask;

    if ( setting.isShowMask ) $$.showMask(setting.zIndex - 1,'rgb(,1,12,)');

    $$.layerBoxId = id; //一个全局id
    $$.layerBoxTempId = tmpId;
    return Dom;
}

/*----------
 * 关闭弹框
 * @ param {String} id  关闭弹框的ID，默认为最后打开的弹框id
 * @ param {Function} callback 回调函数
 * @ return {undefined}
 *-----------------------------*/
$$.closeLayer = function(id, callback) {
    if ( !id ) id = $$.layerBoxId;
    id = "JS_lightBox_" + ( (id+"").replace("JS_lightBox_","") );
    var dom = $("#"+id);
    if ( dom.length ) {
        if ( dom[0]._showMask ) $$.hideMask();
        dom.remove();
    }
    if ( typeof callback == 'function' ) callback(id);
}
/*----------
 * 移除遮罩层
 * @ return {undefined}
 *-----------------------------*/
$$.hideMask = function(){
    if ( $$._maskDom ) {
        $$._maskDom.remove();
        $$._maskDom = null;
    }
}


/*----------
 * 获取url上的参数
 * @ return {para}
 *-----------------------------*/

 $$.getUrlParaObj = function(k){
    var search = location.search;
    if(search != "" && search.length >= 1){
        var search = search.split('?')[1];

        var param  = {}; 
        var arr = search.split('&');
        for(var k = 0, kk = arr.length; k < kk ; k++){
            var d = arr[k].split('=');
            param[d[0]] = decodeURI(d[1])
        }
    }
    return param;
 }

/*----------
 * 获取url上的id
 * @ return {id}
 *-----------------------------*/
function getUrlId(){
    var param = $$.getUrlParaObj();
    return  param['id'];
}



/*----------
 * 通用API
 * @ return {_API}
 *-----------------------------*/
var _api = function(){
    this.getListFirst = function(url,id,defaultId,isSelect,callback){
        $.ajax({
            url:url,
            type: 'GET',
            dataType: 'jsonp',
            contentType:'application/json',
            jsonpCallback: callback,
            success: function(json) {
                var json = json.data;
                var h = '';
                if (isSelect) {
                    h += '<option value="">请选择</option>';
                }

                for(var k = 0 , kk = json.length; k < kk; k++){
                    h += '<option value="'+json[k].id+'" '+  (json[k].id == defaultId?"selected":""  ) +'>'+json[k].name+'</option>'
                }            
                $('#'+id).html(h);
            }
        })
    },
    this.getListSecond = function(url,id,defaultId,isSelect,callback){
        $.ajax({
            url:url,
            type: 'GET',
            dataType: 'jsonp',
            contentType:'application/json',
            jsonpCallback: callback,
            success: function(json) {
                var json = json.data;
                var h = '';
                if (isSelect) {
                    h += '<option value="">请选择</option>';
                }
                for(var k = 0 , kk = json.length; k < kk; k++){
                     h += '<option value="'+json[k]+'" '+  (json[k] == defaultId?"selected":""  ) +'>'+json[k]+'</option>';
                }            
                $('#'+id).html(h);
            }
        })
    }
}
_api.prototype = {
    getNeedSource: function(id,defaultId,isSelect){  //1. 获取来源列表
        var url = _ip+'/common/getProjectNameList';
        this.getListFirst.apply(this,[url,id,defaultId,isSelect,'needsource']);
        return this;
    },
    getComeSource: function(id, defaultId,isSelect,proId){ // 2. 获取需求方列表
        var url = _ip+'/cus/select?id='+proId;
        this.getListFirst.apply(this,[url,id,defaultId,isSelect,'sourcec']);
        return this;
    },
    getPlatformList: function(id, defaultId,isSelect){ // 3. 获取平台列表
        var url = _ip+'/common/getPlatList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'platform']);
        return this;
    },
    getFunctionList: function(id, defaultId,isSelect,productList){ // 4. 获取功能列表 get,与产品相关联
        
        var plat = $('#'+productList).val() || '运营平台';
        var url = _ip+'/common/getFeatureList?key='+plat;
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'fun']);
        return this;
    },
    getTypeList: function(id, defaultId,isSelect){ // 5. 获取需求类别 get
        var url = _ip+'/common/getRequireTypeList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'type']);
        return this;
    },
    getLevelList: function(id, defaultId,isSelect){ // 6. 获取紧急程度 get
        var url = _ip+'/common/getLevelList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'level']);
        return this;
    },
    getProductList: function(id, defaultId,isSelect){ // 7. 获取产品列表
        var url = _ip+'/common/getProductList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'pro']);
        return this;
    },
    getStatusList: function(id, defaultId,isSelect){ // 8-1. 获取处理状态:原始需求
        var url = _ip+'/common/getStatusList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'stat']);
        return this;
    },
    getStatusListPm: function(id, defaultId,isSelect){ // 8-2. 获取处理状态:产品需求
        var url = _ip+'/common/getProductStatusList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'statpm']);
        return this;
    },
    getPriorityList: function(id, defaultId,isSelect){ // 9. 获取优先级列表
        var url = _ip+'/common/getPriorityList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'pri']);
        return this;
    },
    getIssueStatusList: function(id, defaultId,isSelect){ // 10. 获取缺陷状态
        var url = _ip+'/common/getIssueStatusList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'IssueStatus']);
        return this;
    },
    getIssueType: function(id, defaultId,isSelect){ // 11. 获取缺陷类型
        var url = _ip+'/common/getIssueTypeList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'IssueStatus']);
        return this;
    },
    getNetWorkList: function(id, defaultId,isSelect){ // 12. 获取网络类型
        var url = _ip+'/common/getNetWorkList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'network']);
        return this;
    },
    getDptList: function(id, defaultId,isSelect) { // 13. 获取组织架构
        var url = _ip+'/dpt/user';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'Ocp']);
        return this;
    },
    getPSegmentationList: function(id, defaultId,isSelect) { // 14. 项目管理：获取segmentation
        var url = _ip+'/common/getPSegmentationList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'Segmentation']);
        return this;
    },
    getPLevelList: function(id, defaultId,isSelect) { // 15. 项目管理：获取级别
        var url = _ip+'/common/getPLevelList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'PLevel']);
        return this;
    },
    getPBussTypeList: function(id, defaultId,isSelect) { // 16. 项目管理：商务阶段
        var url = _ip+'/common/getPBussTypeList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'PBuss']);
        return this;
    },
    getSellType: function(id, defaultId,isSelect){   //17. 项目管理：获取销售方式
        var url = _ip+'/common/getSaleType';
        this.getListFirst.apply(this,[url,id,defaultId,isSelect,'seltt']);
        return this;
    },
    getVisitTypeList: function(id, defaultId,isSelect) { // 18. 项目管理：拜访方式
        var url = _ip+'/common/getVisitTypeList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'ty']);
        return this;
    },
    getVisitStatusList: function(id, defaultId,isSelect) { // 19. 项目管理：拜访状态
        var url = _ip+'/common/getVisitStatusList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'sr']);
        return this;
    },
    getVisitResultList: function(id, defaultId,isSelect) { // 20. 项目管理：拜访结果
        var url = _ip+'/common/getVisitResultList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'re']);
        return this;
    },
    getEmergencyList: function(id, defaultId,isSelect) { // 21. 项目管理：紧急程度
        var url = _ip+'/common/getEmergencyList';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'em']);
        return this;
    },
    getProNameList: function(id, defaultId,isSelect) { // 21. 项目管理：项目名称列表
        var url = _ip+'/project/name';
        this.getListFirst.apply(this,[url,id,defaultId,isSelect,'pname']);
        return this;
    },
    getDistrict: function(id, defaultId,isSelect){ //获取大区
        var url = _ip+'/common/getDistrict';
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'getDistrict'+(new Date).getTime()]);
        return this;
    },
    getPrivence: function(id, defaultId,isSelect,areaPra){ //获取省
        var url = _ip+'/common/getPrivence?area='+areaPra;
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'getPrivence'+(new Date).getTime()]);
        return this;
    },
    getCity: function(id, defaultId,isSelect,areaPra,provicePra){ //获取市
        var url = _ip+'/common/getCity?area='+areaPra+'&privence='+provicePra;
        this.getListSecond.apply(this,[url,id,defaultId,isSelect,'getCity'+(new Date).getTime()]);
        return this;
    },
    dynamicDistrick: function(id1,id2,id3){
        var _id1 = $('#'+id1),
            _id2 = $('#'+id2),
            _id3 = $('#'+id3);
        _API.getDistrict(id1,0,true);
        _id1.on('change',function(){
            _API.getPrivence(id2,0,true,_id1.val());
            _id3.html('<option>请选择</option>');
        })
        _id2.on('change',function(){
            _API.getCity(id3,0,true,_id1.val(),_id2.val());
        })
        return this;
    }


}
var _API = new _api();




/*----------
 * 上传附件
 * @ param {fileUpload} 点击上传的按钮
 * @ return {fileName} 文件名
 * @ return {addAttachmentList} 文件列表
 * @ return {isDetail} 是否是详情页
 *-----------------------------*/
function attachment(config){
    this.init = function(config){
        this.config = $.extend({
            type:"base"
        },config);
        if(!this.config.isDetail) this.analysisName();
        return this;
    };
    this.analysisName = function(){
        var that = this;
        this.config.fileUpload.on("change","input[type='file']",function(){
            var filePath=$(this).val();
            if(that.config.noFormat) {
                if(filePath){
                    // var arr=filePath.split('\\');
                    // var fileName=arr[arr.length-1];
                    // that.config.fileName.html(fileName);
                    that.uploadFile();

                }else{
                    // that.config.fileName.html("");
                    alert("您未上传文件!");
                    return false;
                }
            }
            else {
                if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("png")!=-1 || filePath.indexOf("docx")!=-1 || filePath.indexOf("zip")!=-1){
                    var arr=filePath.split('\\');
                    var fileName=arr[arr.length-1];
                    // that.config.fileName.html(fileName);
                    that.uploadFile();

                }else{
                    // that.config.fileName.html("");
                    alert("您未上传文件，或者您上传文件类型有误！");
                    return false
                }
            }
        })
    };
    this.uploadFile = function(){

        var that = this;
        var formData = new FormData();
        
        formData.append('file', $('#file')[0].files[0]);
        $.ajax({
            url:  that.config.url ||_ip+'/file/upload',
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        })
        .done(function(res) {
            if(res.success){
                if(that.config.success) {
                    that.config.success(res);
                    return false;
                }
                var name = res.data[0].split('__')[1];
                var h = '<li rel='+res.data[0] +'><div>'+name+'<span class="delete">删除</span></div></li>';
                that.config.addAttachmentList.append(h);
                that.deleteFile();
            }
        })
        .fail(function(res) {
            alert('上传失败！');
        });
    }
    this.deleteFile = function(){
        var that = this;
        that.config.addAttachmentList.on('click','span.delete',function(){
            $(this).parent('div').parent('li').remove();
            var len = that.config.addAttachmentList.find('li').length; 
            if(len<=0){
                // that.config.fileName.html('尚未上传文件！');
            }
        })
    }
    this.getAttachmentList = function(attachmentList){
        var h = '';
        var that = this;
        if(attachmentList.length >= 1){
          for(var k = 0 ; k < attachmentList.length; k++){
            if(attachmentList[k].indexOf('__') <= -1) return;
            var name = attachmentList[k].split('__')[1];
            h += '<li rel="'+attachmentList[k]+'"><div>'+name+(that.config.isDetail?'<a class="delete" href="'+_ip+'/file/download?path='+attachmentList[k]+'">下载</a>':'<span class="delete">删除</span>')+'</div></li>';
          }
          that.config.addAttachmentList.append(h); 
        }
    }

}
var attachment = new attachment();





//初始化七牛云存储
$(function(){
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
        uptoken_url: '/admin/qiniu/upToken',
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://obp5wb3op.bkt.clouddn.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: 'upContainer',           //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '150mb',           //最大文件体积限制
        flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
        max_retries: 3,                   //上传失败最大重试次数
        dragdrop: true,                   //开启可拖曳上传
        drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
            mime_types : [
                {title : "Image files", extensions: "jpg,jpeg,gif,png"}
            ]
        },
        multi_selection : false,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                var res = jQuery.parseJSON(info);
                picUploadedCallBack("",domain,res);

            },
            'Error': function(up, err, errTip) {
                //上传出错时,处理相关的事情
            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = "";
                // do something with key here
                return key
            }
        }
    });

    // var uploader2 = Qiniu.uploader({
    //     runtimes: 'html5,flash,html4',    //上传模式,依次退化
    //     browse_button: 'mvkfiles',       //上传选择的点选按钮，**必需**
    //     uptoken_url: '/admin/qiniu/upToken',
    //     //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
    //     // uptoken : '<Your upload token>',
    //     //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
    //     unique_names: true,
    //     // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
    //     save_key: true,
    //     // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
    //     domain: 'http://obp5wb3op.bkt.clouddn.com/',
    //     //bucket 域名，下载资源时用到，**必需**
    //     container: 'upContainer',           //上传区域DOM ID，默认是browser_button的父元素，
    //     max_file_size: '150mb',           //最大文件体积限制
    //     flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
    //     max_retries: 3,                   //上传失败最大重试次数
    //     dragdrop: true,                   //开启可拖曳上传
    //     drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
    //     chunk_size: '4mb',                //分块上传时，每片的体积
    //     auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    //     filters: {
    //         mime_types : [
    //             { title : "mp4 files", extensions : "mp4" }
    //         ]
    //     },
    //     multi_selection : false,
    //     init: {
    //         'FilesAdded': function(up, files) {
    //             plupload.each(files, function(file) {
    //                 // 文件添加进队列后,处理相关的事情
    //             });
    //         },
    //         'BeforeUpload': function(up, file) {
    //             // 每个文件上传前,处理相关的事情
    //         },
    //         'UploadProgress': function(up, file) {
    //             // 每个文件上传时,处理相关的事情
    //         },
    //         'FileUploaded': function(up, file, info) {
    //             var domain = up.getOption('domain');
    //             var res = jQuery.parseJSON(info);
    //             mvloadedCallBack("",domain,res);

    //         },
    //         'Error': function(up, err, errTip) {
    //             //上传出错时,处理相关的事情
    //         },
    //         'UploadComplete': function() {
    //             //队列文件处理完毕后,处理相关的事情
    //         },
    //         'Key': function(up, file) {
    //             // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
    //             // 该配置必须要在 unique_names: false , save_key: false 时才生效
    //             var key = "";
    //             // do something with key here
    //             return key
    //         }
    //     }
    // });
})

function picUploadedCallBack(positon, domain, res){
    var imgsrc = domain + res.key;
    $("#picUploadedPath").val(imgsrc);
    $("#pickfilesShow").attr("src", imgsrc);
}

function mvloadedCallBack(positon, domain, res){
    var mvsrc = domain + res.key;
    alert("视频上传成功！！！！");
    $("#mvUploadedPath").val(mvsrc);
}

function submitForm(){
    var flag = true;
    console.log($("#inputTitle").val());
    console.log($("#yuvUploadedPathInput").val());
    console.log($("#movieTIInput").val());
    console.log($("#movieSIInput").val());
    
    if($("#inputTitle").val() == "" || $("#yuvUploadedPathInput").val() == ""){
        flag = false;
    }
    if(flag){
        $("#movieCateAddForm").submit();
    } else {
        alert("Name and Video can not be null");
    }

    // if(flag){
    //     $("#movieCateAddForm").submit();
    //     var period = 500; // 1 second
    //     //$('#commentModal').modal('show');
    //     var interval = setInterval(function() {
    //         $.ajax({
    //             url: '/movie/uploadBaseMvStatus',
    //             type: 'post',
    //             //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
    //             //data: datas,
    //             cache: false,
    //             success: function(data) {
    //                 console.log("data = " + JSON.stringify(data));
    //                 $('#pBar').css("width",data.status);
    //                 $('#commentModal One').text(data.msg);
    //                 $('#commentModal Two').text(data.status);
    //                 //$('#commentModal').modal('show');
    //                 //clearInterval(interval);
    //                 if (data.status !== "0%") {
    //                     $('#commentModal').modal('show');
    //                 }

    //                 if (data.status === "100%") {
    //                     console.log("finish");
    //                     clearInterval(interval);
    //                     $('#okButton').removeClass("disabled");
    //                 }
    //             },
    //             error: function() {
    //             }
    //         });
    //     }, period);
    // } else {
    //     alert("所有字段都不能为空");
    // } 
    
}

function uploadMV(){
    $("#yuvFileRealInput").trigger("click");

    
}

$(document).ready(function () {
    $("#yuvFileRealInput").change(function () {
        var path = $(this).val();
        var arr = path.split('\\'); 
        var my = arr[arr.length-1]; 

        var period = 500; // 1 second
        // $('#pBar').css("width","20%");
        // $('#commentModal One').text("正在上传视频...");
        // $('#commentModal Two').text("20%");
        $('#commentModal').modal('show');
        //$('#commentModal').modal({backdrop: 'static', keyboard: false});
        var interval = setInterval(function() {
            $.ajax({
                url: '/movie/uploadBaseMvStatus',
                type: 'post',
                //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
                //data: datas,
                cache: false,
                success: function(data) {
                    console.log("data = " + JSON.stringify(data));
                    $('#pBar').css("width",data.status);
                    $('#commentModal One').text(data.msg);
                    $('#commentModal Two').text(data.status);
                    //$('#commentModal').modal('show');
                    //clearInterval(interval);
                    // if (data.status !== "0%") {
                    //     $('#commentModal').modal('show');
                    // }

                    if (data.status === "100%") {
                        console.log("finish");
                        clearInterval(interval);
                        $('#okButton').removeClass("disabled");
                    }
                },
                error: function() {
                }
            });
        }, period);

        var formData = new FormData($( "#yuvUpForom" )[0]);  
         $.ajax({  
              url: '/movie/baseMovieUpload' ,  
              type: 'POST',  
              data: formData,  
              async: true,  
              cache: false,  
              contentType: false,  
              processData: false,  
              success: function (returndata) { 
                    var data = returndata.result;
                    //var path = returndata.path;
                    // var datas = {
                    //     'id': id,
                    //     'clarity': clarity,
                    //     'loadSpeed': loadSpeed,
                    //     'quality': quality
                    // }

                    // $.ajax({  
                    //     url: '/movie/baseMovieUpload' ,  
                    //     type: 'POST',  
                    //     data: formData,  
                    //     async: false,  
                    //     cache: false,  
                    //     contentType: false,  
                    //       processData: false,  
                    //       success: function (returndata) { 
                    //             var data = returndata.result;
                    //             var path = returndata.path;
                    //             var datas = {
                    //                 'id': id,
                    //                 'clarity': clarity,
                    //                 'loadSpeed': loadSpeed,
                    //                 'quality': quality
                    //             }
                    //             //var tisidata = returndata.tisidata;
                    //             if(data != 0){
                    //                 $("#yuvUploadedPathInput").val(data);  
                    //                 $("#movieTIInput").val(tisidata.maxTI);
                    //                 $("#movieSIInput").val(tisidata.maxSI);
                    //                 //alert("上传成功");
                    //             } else {
                    //                 alert("上传失败");
                    //             }
                    //       },  
                    //       error: function (returndata) {  
                    //          alert("上传失败");
                    //       }  
                    //  }); 

                    var tisidata = returndata.tisidata;
                    if(data != 0){
                        $("#yuvUploadedPathInput").val(data);  
                        $("#movieTIInput").val(tisidata.maxTI);
                        $("#movieSIInput").val(tisidata.maxSI);
                        //alert("上传成功");
                    } else {
                        alert("上传失败");
                        $('#commentModal').modal('hide');

                    }
              },  
              error: function (returndata) {  
                 alert("上传失败");
                 $('#commentModal').modal('hide');
              }  
         }); 
    });
});

////////添加一行、删除一行封装方法///////
/**
* 为table指定行添加一行
*
* tab 表id
* row 行数，如：0->第一行 1->第二行 -2->倒数第二行 -1->最后一行
* trHtml 添加行的html代码
*
*/
function addTr(tab, row, trHtml){
     //获取table最后一行 $("#tab tr:last")
     //获取table第一行 $("#tab tr").eq(0)
     //获取table倒数第二行 $("#tab tr").eq(-2)
     var $tr=$("#"+tab+" tr").eq(row);
     if($tr.size()==0){
            alert("指定的table id或行数不存在！");
            return;
     }
     $tr.after(trHtml);
}

function delTr(ckb){
 //获取选中的复选框，然后循环遍历删除
    var ckbs=$("input[name="+ckb+"]:checked");
    if(ckbs.size()==0){
        alert("要删除指定行，需选中要删除的行！");
        return;
    }

    ckbs.each(function(){
        $(this).parent().parent().remove();
    });
}

/**
* 全选
* 
* allCkb 全选复选框的id
* items 复选框的name
*/
function allCheck(allCkb, items){
    $("#"+allCkb).click(function(){
        $('[name='+items+']:checkbox').attr("checked", this.checked );
    });
}

////////添加一行、删除一行测试方法///////
$(function(){
    //全选
    allCheck("allCkb", "ckb");
});

function addTr2(tab, row){
    var trHtml="<tr><td width='5%'><input type='checkbox' name='ckb'/></td><td onclick='tdclick(this)'></td><td onclick='tdclick(this)'></td><td onclick='editTable(this)')><button type='button'  class='btn btn-success'>Edit</button></td><td onclick='delLine(this)')><button type='button'  class='btn btn-danger'>Delete</button></td></tr>";
    addTr(tab, row, trHtml);
}

function delTr2(){
    delTr('ckb');
}

function editTable(obj) {
    str = $(this).val()=="Edit"?"OK":"EDit";  
    $(this).val(str);   // 按钮被点击后，在“编辑”和“确定”之间切换
    $(this).parent().siblings("td").each(function() {  // 获取当前行的其他单元格
        obj_text = $(this).find("input:text");    // 判断单元格下是否有文本框
        if(!obj_text.length)   // 如果没有文本框，则添加文本框使之可以编辑
            $(this).html("<input type='text' value='"+$(this).text()+"'>");
        else   // 如果已经存在文本框，则将其显示为文本框修改的值
            $(this).html(obj_text.val()); 
    });
}

function delLine(tdobject){
    var td=$(tdobject);  
    td.parents("tr").remove(); 
}
    

function indexFormatter(value, row, index) {  
    return index+1;  
}


function tdclick(tdobject){  
    var td=$(tdobject);  
    td.attr("onclick", "");  
    //1,取出当前td中的文本内容保存起来  
    var text=td.text();  
    //2,清空td里面的内容  
    td.html(""); //也可以用td.empty();  
    //3，建立一个文本框，也就是input的元素节点  
    var input=$("<input>");  
    //4，设置文本框的值是保存起来的文本内容  
    input.attr("value",text);  
    input.bind("blur",function(){  
        var inputnode=$(this);  
        var inputtext=inputnode.val();  
        var tdNode=inputnode.parent();  
        tdNode.html(inputtext);  
        tdNode.click(tdclick);  
        td.attr("onclick", "tdclick(this)");  
    });  
    input.keyup(function(event){  
        var myEvent =event||window.event;  
        var kcode=myEvent.keyCode;  
        if(kcode==13){  
            var inputnode=$(this);  
            var inputtext=inputnode.val();  
            var tdNode=inputnode.parent();  
            tdNode.html(inputtext);  
            tdNode.click(tdclick);  
        }  
    });  
  
    //5，将文本框加入到td中  
    td.append(input);  
    var t =input.val();  
    input.val("").focus().val(t);  
//              input.focus();  
  
    //6,清除点击事件  
    td.unbind("click");  
} 

function save_para_table(){  
  
    var tableinfo = gettableinfo();  
    alert(tableinfo);  
  
  
}  
//get table infomation  
function gettableinfo(){  
    var key = "";  
    var value = "";  
    var tabledata = [];  
    var table = $("#tabTISI");  
    var tbody = table.children();  
    var trs = tbody.children();  
    for(var i=1;i<trs.length;i++){  
        var tds = trs.eq(i).children();  
        var ti, si; 
        if(tds.eq(1).text()==null||tds.eq(1).text()==""){  
            ti = "0";  
        } else {
            ti = tds.eq(1).text();
        }
        

        if(tds.eq(2).text()==null||tds.eq(2).text()==""){  
            si = "0";
        } else {
            si =  tds.eq(2).text();
        } 

        var tisi = {'ti':ti, 'si':si};
        tabledata.push(tisi);
        // if(i==trs.length-1){  
        //     tabledata += "{\""+key+"\",\""+value+"\"}";  
        // }else{  
        //     tabledata += "{\""+key+"\",\""+value+"\"},";  
        // }  
    }  
    return tabledata;  
}  

function submitForm(){
    var tisiArr = gettableinfo();
    var title = $("#inputTitle").val();
    var data = {'title':title, 'tisiArr':tisiArr};

    $.ajax({  
        url: '/gl/movieCate/save' ,  
        type: 'POST',  
        data: data,    
        cache: false,  
        success: function (data) {
            console.log("----" + data);
            location.href = '/gl/movieCate';
            // var data = returndata.result;
            // var tisidata = returndata.tisidata;
            // var pic = returndata.pic;
            // if(data != 0){
            //     $("#mvUploadedPathInput").val(data); 
            //     $("#picUploadedPath").val(pic); 
            //     $("#movieTIInput").val(tisidata.maxTI);
            //     $("#movieSIInput").val(tisidata.maxSI);
            //     $("#movieEDistance").val(tisidata.eDistance);
                
            //     var typeId = tisidata.typeId;
            //     console.log("typeId = " + typeId);
            //     //$(".movieType").checked = false;
            //     var objs = $(".movieType");
            //     for (var i = objs.length - 1; i >= 0; i--) {
            //         if (objs[i].value == typeId) {
            //             objs[i].checked = true;
            //         }
            //     }
                // objs[0].checked = true;
                // console.log(objs[0].checked);
                // console.log($(".movieType[value=typeId]"));
                // $("input[value=typeId]").checked = true;
                //$(".movieType")[value=typeId].attr("checked", true);

                //alert("上传成功");
            // } else {
            //     alert("添加失败");
            //     //$('#commentModal').modal('hide');
            // }

        },  
        error: function (returndata) {  
            alert("添加失败");
            // $('#commentModal').modal('hide');
        }  
    }); 
}

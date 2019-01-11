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
    // alert("视频上传成功！");
    $("#mvUploadedPath").val(mvsrc);
}

function submitForm(){
    var flag = true;
    console.log($("#inputTitle").val());
    console.log($("#inputOrigin").val());
    console.log($("#picUploadedPath").val());
    console.log($("#mvUploadedPath").val());
    console.log($("#inputContent").val());
    
    if($("#inputTitle").val() == "" || $("#mvUploadedPath").val() == ""){
        flag = false;
    }
    if(flag){
        $("#movieAddForm").submit();
    } else {
        alert("name and path can not be null");
    } 
    
}

function uploadMV(){
    $("#mvFileRealInput").trigger("click");
    
}

$(document).ready(function () {
    $("#mvFileRealInput").change(function () {
        var path = $(this).val();
        var arr = path.split('\\'); 
        var my = arr[arr.length-1]; 

        var period = 500; // 1 second
        $('#pBar').css("width","1%");
        $('#commentModal One').text("准备就绪...");
        $('#commentModal Two').text("1%");
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
                        $('#okButton').removeClass("disabled");
                        //$('#okButton').addClass("active");
                        //$('#okButton').prop("disabled", "false");
                        clearInterval(interval);
                    }
                },
                error: function() {
                }
            });
        }, period);

        var formData = new FormData($( "#mvUpForom" )[0]);  
         $.ajax({  
              url: '/movie/mvUpload' ,  
              type: 'POST',  
              data: formData,  
              async: true,  
              cache: false,  
              contentType: false,  
              processData: false,  
              success: function (returndata) {
                    var data = returndata.result;
                    var params = returndata.params;
                    var pic = returndata.pic;
                    if(data != 0){
                        $("#mvUploadedPathInput").val(data); 
                        $("#picUploadedPath").val(pic); 
                        $("#movieTIInput").val(params.maxTI);
                        $("#movieSIInput").val(params.maxSI);
                        $("#movieEDistance").val(params.eDistance);

                        //movie info
                        $("#inputMVDuration").val(params.movieInfo.duration);
                        $("#inputMVSize").val(params.movieInfo.size);
                        $("#inputMVWidth").val(params.movieInfo.width);
                        $("#inputMVHeight").val(params.movieInfo.height);
                        $("#inputMVFrate").val(params.movieInfo.fps);
                        $("#inputMVBrate").val(params.movieInfo.bps);
                        $("#inputMVCodec").val(params.movieInfo.codec_name);
                        $("#inputMVPFormat").val(params.movieInfo.pix_fmt);
                        $("#inputMVFormat").val(params.movieInfo.format_name);
                        
                        var typeId = params.typeId;
                        console.log("typeId = " + typeId);
                        //$(".movieType").checked = false;
                        var objs = $(".movieType");
                        for (var i = objs.length - 1; i >= 0; i--) {
                            if (objs[i].value == typeId) {
                                objs[i].checked = true;
                            }
                        }
                        // objs[0].checked = true;
                        // console.log(objs[0].checked);
                        // console.log($(".movieType[value=typeId]"));
                        // $("input[value=typeId]").checked = true;
                        //$(".movieType")[value=typeId].attr("checked", true);

                        //alert("上传成功");
                    } else {
                        alert("failed");
                        $('#commentModal').modal('hide');
                    }

              },  
              error: function (returndata) {  
                 alert("failed");
                 $('#commentModal').modal('hide');
              }  
         }); 
    });
});

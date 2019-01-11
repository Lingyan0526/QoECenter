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
                url: '/gl/dash/uploadBaseMvStatus',
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
              url: '/gl/dash/mvUpload' ,  
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
                        $("#movieTypeId").val(params.typeId);
                        
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
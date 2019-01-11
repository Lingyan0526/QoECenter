// var event = require("../../app/controllers/events");
var newPath = "";

function submitForm(){
	// var subEvent = event.SingletonEvent.getInstance();


	// cat.on("NetWorkSave", function (activity) {
	//     console.log("progress : " + activity);
	//     $('#pBar').css("width",activity);
	// 	$('#commentModal Two').text(activity);
	//     $('#commentModal').modal('show');
	// });

    var flag = true;
    // console.log($("#inputTitle").val());
    // console.log($("#inputOrigin").val());
    // console.log($("#inputAuthor").val());
    // console.log($("#picUploadedPath").val());
    // console.log($("#mvUploadedPath").val());
    // console.log($("#inputContent").val());
    
    // if($("#inputBandwidth").val() == "" || $("#inputTimedelay").val() == ""){
    //     flag = false;
    // }
    if(flag){
        $("#NetWork").submit();
        $('#commentModal').modal('show');
        var period = 1000; // 1 second
        //$('#commentModal').modal('show');
		var interval = setInterval(function() {
		    $.ajax({
		        url: '/movie/saveNetworkStatus',
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
		            if (data.status === "100%") {
		            	newPath = data.newDir;
		            	console.log("finish");
						$('#okButton').removeClass("disabled");
						clearInterval(interval);
						location.href = '/gl/movie';
					}
		        },
		        error: function() {
		        }
    		});
		}, period);
    } else {
        alert("field can not be null");
    } 

    return;

}

function submitOK() {
	location.href = '/gl/movie';
	// $.ajax({
 //        url: '/gl/movie/analysisList/'+newPath,
 //        type: 'get',
 //        //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
 //        //data: datas,
 //        cache: false,
 //        success: function(data) {
 //        	console.log("data = " + JSON.stringify(data));
 //        },
 //        error: function() {
 //        }
	// });
}

function updateMovie() {
	$("#UpdateMovieInfo").submit();
	// $.ajax({
 //        url: '/gl/movie/update/'+movie._id,
 //        type: 'get',
 //        //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
 //        //data: datas,
 //        cache: false,
 //        success: function(data) {
 //        	console.log("data = " + JSON.stringify(data));
 //        },
 //        error: function() {
 //        }
	// });
}
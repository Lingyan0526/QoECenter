// var event = require("../../app/controllers/events");
var newPath = "";

function submitForm(){
    var flag = true;

    if(flag){
        $("#NetWork").submit();
        $('#commentModal').modal('show');
        var period = 1000; // 1 second
		var interval = setInterval(function() {
		    $.ajax({
		        url: '/gl/dash/saveNetworkStatus',
		        type: 'post',
		        cache: false,
		        success: function(data) {
		        	console.log("data = " + JSON.stringify(data));
			    	$('#pBar').css("width",data.status);
			    	$('#commentModal One').text(data.msg);
					$('#commentModal Two').text(data.status);

		            if (data.status === "100%") {
		            	newPath = data.newDir;
		            	console.log("finish");
						$('#okButton').removeClass("disabled");
						clearInterval(interval);
						location.href = '/gl/dash';
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
	location.href = '/gl/dash';
}

function updateMovie() {
	$("#UpdateMovieInfo").submit();
}
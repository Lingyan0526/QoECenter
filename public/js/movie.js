

$(function(){
	$(".del").click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-'+id);

		$.ajax({
			type:'delete',
			url:'/gl/movie/delete/'+id
		}).done(function(results){
			if(results.success === 1){
				if(tr.length > 0 ){
					tr.remove();
				}
			}
		})
	})
})

//下载所有的视频信息
function createVideosInfomation() {
	$.ajax({
        url: '/gl/movie/createVideosInfomation',
        type: 'get',
        //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
        cache: false,
        success: function(data) {
            location.href = '/gl/movieInfos/videosInfomation.xlsx';
            console.log("data = " + JSON.stringify(data));
        },
        error: function() {
        }
    });
}

//下载homepage的访问信息
function getHomePagePVInfo() {
    $.ajax({
        url: '/gl/movie/getHomePagePVInfo',
        type: 'get',
        //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
        cache: false,
        success: function(data) {
            location.href = '/visit/homepageVisitInfo.xlsx';
            console.log("data = " + JSON.stringify(data));
        },
        error: function() {
        }
    });
}

//下载userpage的访问信息
function getUserPagePVInfo() {
    $.ajax({
        url: '/gl/movie/getUserPagePVInfo',
        type: 'get',
        //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
        cache: false,
        success: function(data) {
            location.href = '/visit/userpageVisitInfo.xlsx';
            console.log("data = " + JSON.stringify(data));
        },
        error: function() {
        }
    });
}

//下载全部的comments信息
function getAllComments() {
	$.ajax({
        url: '/gl/movie/getAllComments',
        type: 'get',
        //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
        cache: false,
        success: function(data) {
            location.href = '/gl/commentsInfo/' + data.filename;;
            console.log("data = " + JSON.stringify(data));
        },
        error: function() {
        }
    });
}

//下载特定视频的comments
function getVideoComments(id) {
	$.ajax({
        url: '/gl/movie/getVideoComments/'+id,
        type: 'get',
        //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
        cache: false,
        success: function(data) {
            location.href = '/gl/commentsInfo/' + data.filename;
            console.log("data = " + JSON.stringify(data));
        },
        error: function() {
        }
    });
}


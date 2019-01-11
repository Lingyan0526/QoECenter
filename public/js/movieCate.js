$(function(){
	// $(".del").click(function(e){
		
	// })

	
})

function delMovieCate(id){
		// var target = $(e.target);
		// var id = target.data('id');
		var tr = $('.item-id-'+id);
		$.ajax({
			type:'delete',
			url:'/gl/movieCate/delete/'+id
		}).done(function(results){
			if(results.success === 1){
				if(tr.length > 0 ){
					tr.remove();
					$('#delModal').modal('hide');
				}
			}
		})
	}

function showModal(id){
	$('#delModal').modal('show');
	$("#doBtn").attr("onclick","delMovieCate('"+id+"')");
}
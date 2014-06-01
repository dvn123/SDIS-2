$(function(){
	$('#profileModal').modal({
		keyboard: true,
		backdrop: "static",
		show:false,
	}).on('show.bs.modal', function(){ //subscribe to show method

		var sessionUsername = "123"; //IR BUSCAR ID DO SESSION START ?

        var actionUrl = "./getCustomer.php";
       	//make your ajax call populate items or what even you need
       	//$(this).find('#orderDetails').html($('<b> Order Id selected: ' + getIdFromRow  + '</b>'));       	
       	autoCompletion(sessionUsername, actionUrl, function(output){			
       	 	var keys = Object.keys(output);
       	 	//console.log(keys);
       	 	for (var i = 1; i < keys.length; i++) { 
       	 		if(keys[i] == "username" || keys[i] == "email" || keys[i] == "gamesplayed") {
       	 			//console.log("Entered: " + keys[i] + " and: " + output[keys[i]]);
       	 			document.getElementById(keys[i]).innerHTML = output[keys[i]];
       	 		}
       	 			
			}
       	});
    });
	function autoCompletion(rowid, autoCompleteUrl, handleData){
		
		//IR BUSCAR DADOS DO USER

		$.ajax({
			type:'GET',
			url: autoCompleteUrl, 
			data: "&username="+rowid
			}).done(function(result) {
				console.log("Login successful" + result);
				handleData(result[0]);
			}).fail(function(jqXHR, textStatus) {
				console.log("Error login user: "+jqXHR.status);
				console.log(textStatus);
				alert("Invalid login");
			});	
	}	
});	
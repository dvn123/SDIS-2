function registerPlayer()
{
	var data = $('#register_form').find(".form-control");

	if(data[2].value!=data[3].value)
		alert("passwords are different!");
	else{
	
		var user = {
			username : data[0].value,
			email : data[1].value,
			password : data[2].value
		};
		
		console.log("b4");
		$.ajax({
		url: "http://2048.fe.up.pt" + ":3000/database",
		type: "PUT",
		data: user,
		processData: true
		})
		.done(function() {
		console.log("after");
		return true;
		})
		.fail(function( jqXHR, textStatus ) {
			console.log("Error putting game state - " + textStatus);
		});
	}
};

function loginPlayer()
{
	alert("WASSSSSSS UP!!");
}
function registerPlayer()
{
	var data = $('#register_form').find(".form-control");

	if(data[2].value!=data[3].value)
		console.log("passwords are different!");
	else{
	
		var user = {
			username : data[0].value,
			email : data[1].value,
			password : data[2].value
		};
		
		$.ajax({
        type: "POST",
        url:"./registerUser.php",
        data: {"username": data[0].value,"email": data[1].value,"password": data[2].value}
		}).done(function(result) {
			console.log("SUCESS");
			$("#registerModal").modal('hide');
			loginPlayer();
		}).fail(function(jqXHR, textStatus,errorThrown) {
			console.log("Error register user: "+jqXHR.status);
			console.log(textStatus);
			alert("Something went wrong\nError: "+jqXHR.status+" : "+errorThrown);
	});
	}
};

function loginPlayer()
{

	var data = $('#login_form').find(".form-control");

	var user = {
		username : data[0].value,
		password : data[1].value
	};
		
	$.ajax({
        type: "GET",
        url:"./getCustomer.php",
        data: "&username="+data[0].value
		}).done(function(result) {
			if(result[0].password==user.password)
			{
				console.log("SUCESS");
				$("#loginModal").modal('hide');
			}
			if(SessionUsername!="")
				location.reload();
		}).fail(function(jqXHR, textStatus) {
			console.log("Error login user: "+jqXHR.status);
			console.log(textStatus);
			alert("Invalid login");
	});	
};
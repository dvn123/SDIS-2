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
		
		console.log({username: data[0].value,email: data[1].value,password: data[2].value});
		/*
		$.post( "./registerUser.php", { username: data[0].value,email: data[1].value,password: data[2].value })
		.done(function(  ) {
			alert( "Sucess" );
		})
		.always(function(){
			alert("halt");
		});
		*/
		$.ajax({
        type: "POST",
        url:"./registerUser.php",
		data: {username: data[0].value,email: data[1].value,password: data[2].value}})
        .done(function(data) { alert("success"); $("#registerModal").modal('hide');})		
	  }
	  
};

function loginPlayer()
{

	var data = $('#login_form').find(".form-control");

	var user = {
		username : data[0].value,
		password : data[1].value
	};
		
	console.log("teste"+SessionUsername);
	$.ajax({
        type: "POST",
        url:"./getCustomer.php",
        data: {username: data[0].value, password: data[1].value}
		}).done(function(result) {
			console.log(result);
			console.log("SUCESS");
			$("#loginModal").modal('hide');
			location.reload();
			
		}).fail(function(jqXHR, textStatus) {
			console.log("Error login user: "+jqXHR.status);
			console.log(textStatus);
			alert("Invalid login");
	});	
};
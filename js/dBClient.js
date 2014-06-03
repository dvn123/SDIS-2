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
		$.ajax({
        type: "POST",
        url:"./registerUser.php",
		data: {username: data[0].value,email: data[1].value,password: data[2].value},
        success:function(result)
        {
         alert("pause");
			console.log("SUCESS");
			alert("Congratz you have registered");
			//$("#registerModal").modal('hide');
        },
		error: function(){
			console.log("Error register user: "+jqXHR.status);
			console.log(textStatus);
			alert("hmm");
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
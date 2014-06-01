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
		url: "http://2048.fe.up.pt" + ":3000/database",
		type: "PUT",
		data: user,
		processData: true,
		async:   false
		})
		.done(function(data) {
			alert(data);
			console.log("ajax register done");
			console.log(data);
		return true;
		})
		.fail(function(jqXHR, textStatus,errorThrown) {
			alert("Error!"+jqXHR.status+", "+textStatus+", "+errorThrown );
			console.log("Error registering user");
			if(jqXHR.status == 406)
				console.log(errorThrown);
			console.log(textStatus);
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
				writeCookie('sessionId', user.username, 1);
				$("#loginModal").modal('hide');
			}
		return true;
		}).fail(function(jqXHR, textStatus) {
			console.log("Error login user: "+jqXHR.status);
			console.log(textStatus);
			alert("Invalid login");
	});	
};

function writeCookie(name,value,days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}
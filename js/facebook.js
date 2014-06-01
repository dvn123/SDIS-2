  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
	  //Ta na BD= se sim -> sesson start and update, else regista
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
     // document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      //document.getElementById('status').innerHTML = 'Please log ' +  'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1426285940971456',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    oauth      : true,
    version    : 'v2.0' // use version 2.0
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('I got: ' + JSON.stringify(response));
      console.log('Successful login for: ' + response.name);
	  var username = response.name;
	  
	  $.ajax({
        type: "GET",
        url:"./getCustomer.php",
        data: "&username="+username
		}).done(function(result) {
		if(SessionUsername!="")
				location.reload();
		return true;
		}).fail(function(jqXHR, textStatus) {
			$.ajax({
				type: "POST",
				url:"./registerUser.php",
				data: {"username": username,"email": "","password": "facebook"}
				}).done(function(result) {
					console.log("SUCESS");
					$.ajax({
						type: "GET",
						url:"./getCustomer.php",
						data: "&username="+username
						}).done(function(result) {
							console.log("SUCESS");
							$("#registerModal").modal('hide');
							if(SessionUsername!="")
				location.reload();
						}).fail(function(jqXHR, textStatus,errorThrown) {
							console.log("Error register user: "+jqXHR.status);
							console.log(textStatus);
							alert("Something went wrong\nError: "+jqXHR.status+" : "+errorThrown);
					});
					$("#registerModal").modal('hide');
					return true;
				}).fail(function(jqXHR, textStatus,errorThrown) {
					console.log("Error register user: "+jqXHR.status);
					console.log(textStatus);
					alert("Something went wrong\nError: "+jqXHR.status+" : "+errorThrown);
			});
	});	
    });
  }

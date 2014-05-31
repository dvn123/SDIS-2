
	console.log("In here!")
	
	var mysql = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '2048sdis'
	});
	
	connection.connect(function(err) {
	  if (err) {
	    console.error('error connecting: ' + err.stack);
	    return;
	  }
	
	  console.log('connected as id ' + connection.threadId);
	});

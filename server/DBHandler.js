
module.exports = function()
{	
	var mysql = require('mysql');
	this.connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'sdis2048',
		database: "sdisdb"
	});
	
	this.connect = function()
	{	
		this.connection.connect();
	};
	
	this.disconnect = function()
	{
		this.connection.disconnect();
	};
	
	this.registerUser = function(user,callback)
	{
		this.connect();
		
		var SQLQuery = 'INSERT INTO `sdisdb`.`users` (`id`, `username`, `password`, `email`, `gamesplayed`) VALUES ('+
		"NULL, '"+user.username+"', '"+user.password+"', '"+user.email+"', '"+0+"')";
		
		this.connection.query(SQLQuery, function(err, results) {
			callback(err,results);
		});
		this.disconnect();
	};

	this.getUser = function(name)
	{
		this.connection.query("SELECT * FROM `users` WHERE `username` = "+name+"'", function(err, rows, fields) {
			if (err) throw err;
			console.log('The database response to the select is: '+ rows	);
		});
		return rows[0];
	};

	this.updateUser = function(user)
	{
		this.connection.query("UPDATE `users` SET `username`=["+user.username+"],`password`=["+user.password+
		"],`email`=["+user.email+"],`gamesplayed`=["+user.gamesplayed+"] WHERE 'id'="+user.id, 
			function(err, rows, fields) {
				if (err) throw err;
				console.log('The database response to the update is: '+ rows	);
			});
		return true;
	}
}
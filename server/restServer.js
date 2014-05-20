var restify = require('restify')
  , userSave = require('save')('user')

var server = restify.createServer({ name: '2048-Rest' })

var gameState;

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())

//Aparece na consola
server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
});

//Retrieve gameState
server.get('/gameState', function (req, res, next) {
	console.log("Request received from rest get verb on /gameState");
	res.send(gameState);
});

//Create gameState
server.put('/gameState', function (req, res, next) {
	console.log("Request received from rest put verb on /gameState");
	console.log("Params: "+req.params);
	gameState = res.params;
});

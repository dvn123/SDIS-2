<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>2048 Co-Op</title>

  	<!-- Bootstrap core CSS -->
    <link href="style/bootstrap.css" rel="stylesheet">

    <!-- Custom Google Web Font -->
    <link href="style/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href='http://fonts.googleapis.com/css?family=Lato:100,300,400,700,900,100italic,300italic,400italic,700italic,900italic' rel='stylesheet' type='text/css'>

    <!-- Add custom CSS here -->
    <link href="style/landing-page.css" rel="stylesheet">
    <link href="style/bootstrap-social.css" rel="stylesheet">
	
  	<link href="style/test.css" rel="stylesheet" type="text/css">
  	<link rel="shortcut icon" href="favicon.ico">
  	<link rel="apple-touch-icon" href="meta/apple-touch-icon.png">
  	<script src="socket.io/socket.io.js"></script>
	
  	<link rel="apple-touch-startup-image" href="meta/apple-touch-startup-image-640x1096.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"> <!-- iPhone 5+ -->
  	<link rel="apple-touch-startup-image" href="meta/apple-touch-startup-image-640x920.png"  media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)"> <!-- iPhone, retina -->
  	<meta name="apple-mobile-web-app-capable" content="yes">
  	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	
  	<meta name="HandheldFriendly" content="True">
  	<meta name="MobileOptimized" content="320">
</head>

<body data-spy="scroll" data-target=".navbar #footer">

    <div id="fb-root"></div>

    <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">2048 Co-Op</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse navbar-right navbar-ex1-collapse">
                <ul class="nav navbar-nav">
                    <li><a href="#about">About</a>
                    </li>
                    <li><a href="#" data-toggle="modal" data-target="#loginModal">Login</a>
                    </li>
                    <li><a href="#" data-toggle="modal" data-target="#registerModal">Register</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

   <div id="game" class="container">
    <div class="heading">
      <h1 class="title">2048</h1>
      <div class="scores-container">
        <div class="score-container">0</div>
        <div class="best-container">0</div>
      </div>
    </div>

    <div class="above-game">
      <p class="game-intro">Join the numbers and get to the <strong>2048 tile!</strong></p>
      <a class="restart-button">New Game</a>
    </div>

	<div class="game">
		<div class="game-container">
		  <div class="game-message">
			<p></p>
			<div class="lower">
				<a class="keep-playing-button">Keep going</a>
			  <a class="retry-button">Try again</a>
			</div>
		  </div>
		  <div class="grid-container">
			<div class="grid-row">
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			</div>
			<div class="grid-row">
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			</div>
			<div class="grid-row">
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			</div>
			<div class="grid-row">
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			  <div class="grid-cell"></div>
			</div>
		  </div>

		  <div class="tile-container">

		  </div>
		</div>
		<div class="game_information">
			<table class="mode_counter">
				<h3 style="margin: 0px;">Game Mode Vote Counter: <h3>
				<tr class ="anarchy_vote_counter"><th style="text-align: left;">Anarchy: </th><td>0</td></tr>
				<tr class ="democracy_vote_counter"><th style="text-align: left;">Democracy: </th><td>0</td></tr>
			</table>
			<div class = "mode_container" style="padding-top: 1.5em;">
				<div class = "anarchy_mode">
					<!-- <span class="message">
						<span class="from">name</span>
						<span class="colon">:</span>
						<span class="content">conteudo1</span>
					</span> -->
				</div>
				<div class = "democracy_mode">
					<table class = "democracy_counter">
						Move Counter
                        <tr id="up-democracy"><td>Up: </td><td>0</td></tr>
                        <tr id="down-democracy"><td>Down: </td><td>0</td></tr>
                        <tr id="left-democracy"><td>Left: </td><td>0</td></tr>
                        <tr id="right-democracy"><td>Right: </td><td>0</td></tr>
					</table>
				</div>
			</div>
		</div>
	</div>

    <a id="democracy-button" class="restart-button" onclick="GM.vote_democracy();">
      Vote Democracy
    </a>
    <a id="current-button" class="restart-button">
      Current Mode: Anarchy  
    </a>
    <a id="anarchy-button" class="restart-button" onclick="GM.vote_anarchy();">
      Vote Anarchy
    </a>
  </div>

    <div id="loginmodal"></div>
    <div id="registermodal"></div>

    <footer>
        <div id="footer" class="container">
            <div class="row">
                <div class="col-lg-12">
                    <ul class="list-inline">
                        <li><a href="#home">Home</a>
                        </li>
                        <li class="footer-menu-divider">&sdot;</li>
                        <li><a href="#about">About</a>
                        </li>
                    </ul>
                    <p class="copyright text-muted small">Made under <a href="http://sigarra.up.pt/feup/pt/web_page.inicial">FEUP</a> rights for the Distributed Systems course.</p>
                </div>
            </div>
        </div>
    </footer>


    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  	<script src="js/bind_polyfill.js"></script>
  	<script src="js/classlist_polyfill.js"></script>
  	<script src="js/animframe_polyfill.js"></script>
  	<script src="js/keyboard_input_manager.js"></script>
  	<script src="js/html_actuator.js"></script>
  	<script src="js/grid.js"></script>
  	<script src="js/tile.js"></script>
  	<script src="js/local_storage_manager.js"></script>
  	<script src="js/game_manager.js"></script>
  	<script src="js/application.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
    <script type="text/javascript" src="js/facebook.js"></script>
    <script> 
    $(document).ready(function(){
        $('#loginmodal').load('loginmodal.php');  
        $('#registermodal').load('registermodal.php');  
    });
    </script>  
 

</body>

</html>

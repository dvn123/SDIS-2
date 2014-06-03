<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>2048 Co-Op</title>

  <link href="style/main.css" rel="stylesheet" type="text/css">
  <link href="style/bootstrap.css" rel="stylesheet" type="text/css">
  <link href="style/bootstrap-social.css" rel="stylesheet" type="text/css">
  <link href="style/overwrite.css" rel="stylesheet" type="text/css"> 
  
  <link rel="shortcut icon" href="favicon.ico">
  <link rel="apple-touch-icon" href="meta/apple-touch-icon.png">

  <link rel="apple-touch-startup-image" href="meta/apple-touch-startup-image-640x1096.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"> <!-- iPhone 5+ -->
  <link rel="apple-touch-startup-image" href="meta/apple-touch-startup-image-640x920.png"  media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)"> <!-- iPhone, retina -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">

  <meta name="HandheldFriendly" content="True">
  <meta name="MobileOptimized" content="320">
</head>
<body>
	<script type="text/javascript">
		var  SessionUsername = <?= isset($_SESSION['username']) ? $_SESSION['username'] : "''" ?>;
	</script>

  <div id="fb-root"></div>

    <nav id"mynavbar" class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" >2048 Co-Op</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse navbar-right navbar-ex1-collapse">
                <ul class="nav navbar-nav">
                	<?php if(isset($_SESSION['username']))
                        echo('<li><a href="#about">Home</a></li><li><a href="/" data-toggle="modal" data-target="#loginModal">Login</a></li><li><a href="#" data-toggle="modal" data-target="#registerModal">Register</a></li>');  
                    else
                        echo('<li><a href="#about">Home</a></li><li><a href="/" data-toggle="modal" data-target="#profileModal">Profile</a></li>');?>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>
  <div id="loginmodal"></div>
  <div id="registermodal"></div>
  <div id="profilemodal"></div>
  
  <div id="game-div" class="container">
    <div class="heading">
      <h1 class="title">2048</h1>
      <div class="scores-container">
        <div class="score-container">0</div>
        <div class="best-container">0</div>
      </div>
    </div>

    <div class="above-game">
      <p class="game-intro">Join the numbers and get to the <strong>2048 tile!</strong></p>
      <!-- <a class="restart-button">New Game</a>-->
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

    <a id="democracy-button" class="mode-button" onclick="GM.vote_democracy();">
      Vote Democracy
    </a>
    <a id="current-button" class="restart-button" >
      Current Mode: Anarchy  
    </a>
    <a id="anarchy-button" class="mode-button" onclick="GM.vote_anarchy();">
      Vote Anarchy
    </a>
  </div>
  <script src="socket.io/socket.io.js"></script>
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
  <script type="text/javascript" src="js/dBClient.js"></script>
  <script> 
    $(document).ready(function(){
        $('#loginmodal').load('loginmodal.php');  
        $('#registermodal').load('registermodal.php');  
        $('#profilemodal').load('profilemodal.php');  
    });
    </script>  
</body>
</html>

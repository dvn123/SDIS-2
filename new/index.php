<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>2048 Co-Op</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">

    <!-- Custom Google Web Font -->
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href='http://fonts.googleapis.com/css?family=Lato:100,300,400,700,900,100italic,300italic,400italic,700italic,900italic' rel='stylesheet' type='text/css'>

    <!-- Add custom CSS here -->
    <link href="css/landing-page.css" rel="stylesheet">
    <link href="css/bootstrap-social.css" rel="stylesheet">

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

    <div id="home" class="intro-header">

        <div class="container">

            <div class="row">
                <div class="col-lg-12">
                    <div class="intro-message">
                        <h1>Having trouble getting to 2048?</h1>
                        <h3>We created a Co-Op version just for you!</h3>
                        <hr class="intro-divider">
                        <ul class="list-inline intro-social-buttons">
                            <li><button type="button" class="btn btn-default btn-lg onclick="connect();"">Play</button></li>
                            <li><button type="button" class="btn btn-default btn-lg" data-toggle="modal" 
                            data-target="#loginModal">Login</button></li>
                            <li><a href="http://gabrielecirulli.github.io/2048/" class="btn btn-default btn-lg">2048 Original</a>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
        <!-- /.container -->

    </div>
    <!-- /.intro-header -->

    <div class="content-section-a">

        <div id="about" class="container">

            <div class="row">
                <div class="col-lg-6 col-sm-6">
                    <hr class="section-heading-spacer">
                    <div class="clearfix"></div>
                    <h2 class="section-heading">About the project: <br> 2048 + "Twitch Plays" </br> </h2>
                    <p class="lead"><a href="http://gabrielecirulli.github.io/2048/">2048</a> became a very popular game in the Computer Science community and there were a lot of versions remade. For our Distributed Systems course we had to come up with an ideia for a project that would implement the <a href="http://en.wikipedia.org/wiki/Representational_state_transfer">REST</a> architecture, so we thought about a Co-Operative version of the game, a little bit like <a href="http://www.twitch.tv/twitchplayspokemon">Twitch Plays Pokemon</a>. 

                    </p>
                </div>
                <div class="col-lg-4 col-lg-offset-1 col-sm-6">
                    <img class="img-responsive" src="img/2048.png" alt="">
                </div>
            </div>

        </div>
        <!-- /.container -->

    </div>
    <!-- /.content-section-a -->

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


    <!-- JavaScript -->
    <script type="text/javascript" src="js/jquery-1.10.2.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
    <script type="text/javascript" src="js/facebook.js"></script>
    <script type="text/javascript" src="js/node-mysql.js"></script> 
    <script> 
    $(document).ready(function(){
        $('#loginmodal').load('loginmodal.php');  
        $('#registermodal').load('registermodal.php');  
    });
    </script>  
 

</body>

</html>

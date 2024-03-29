<?php session_start(); ?>
<div class="modal fade" id="profileModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                 <h4 class="modal-title">Bro, you are our best user!</h4>
            </div>
        <div class="modal-body">
          <table class="table" align="center">
            <tbody>
              <tr>
                <td>Username</td>
                <td id="username"><?php if(isset($_SESSION["username"])) echo $_SESSION["username"]; else echo "Not logged in!" ?></td>
              </tr>
              <tr>
                <td>Email</td>
                <td id="email"><?php if(isset($_SESSION["email"])) echo $_SESSION["email"];  else echo "Not logged in!" ?></td>
              </tr>
              <tr>
                <td>Games Played</td>
                <td id="gamesplayed"><?php if(isset($_SESSION["gamesplayed"])) echo $_SESSION["gamesplayed"];  else echo "Not logged in!" ?></td>   
              </tr>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-default" data-dismiss="modal">Sair</button>
        </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<!-- /.modal -->
<script type="text/javascript" src = "js/autocomplete.js"></script>
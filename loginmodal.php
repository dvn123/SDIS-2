<!-- Modal -->
<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                 <h4 class="modal-title">Do you even Login brah?</h4>
            </div>
            <br>
            <div class = "container">
              <button id="fb-btn" type="button" class="btn btn-primary tn-block btn-social btn-facebook"><i class="fa fa-facebook"></i>Sign in with Facebook</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#registerModal">Register Here</button>
            </div>
            <hr class="divider">
            <div class="modal-body">
                <form id="login_form" role="form" data-toggle="validator" onsubmit="loginPlayer()">
                    <div class="form-group">
                      <label for="inputusername">Username</label>
                      <input type="text" class="form-control" id="inputusername" placeholder="Enter username">
                    </div>
                    <div class="form-group">
                      <label for="inputpassword">Password</label>
                      <input type="password" class="form-control" id="inputpassword" placeholder="Enter password">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary"> Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<!-- /.modal -->

<script>
  $( "form" ).submit(function( event ) {
    var inputs = document.getElementsByTagName('input');
    for(var i = 0; i < inputs.length; i++) {
      //if(inputs[i].type == "password")      
       console.log(inputs[i].value);
    }
    event.preventDefault();
  });
</script>
<script>
(function ($) {
$(function () {
  $("#fb-btn").on("click", function () {
    //Verificar primeiro se o user está ligado!
    FB.login(function(response) {
      if (response.authResponse) {
        //Fazer cenas com isto.
      }
    });
  });
});
})(jQuery);
</script>
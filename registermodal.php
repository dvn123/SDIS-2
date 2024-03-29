<!-- Modal -->
<script src="js/validator.min.js"></script>
<div class="modal fade" id="registerModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" >
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                 <h4 class="modal-title">Do you even Register brah?</h4>
            </div>
            <div class="modal-body">
                <form id="register_form" role="form" data-toggle="validator" onsubmit="registerPlayer()">
                    <div class="form-group">
                      <label for="inputusername">Username</label>
                      <input type="text" class="form-control" id="inputusername" placeholder="Enter username">
                    </div>
                    <div class="form-group">
                      <label for="inputemail">Email</label>
                      <input type="email" class="form-control" id="inputemail" placeholder="Enter email">
                    </div>
                    <div class="form-group">
                      <label for="inputpassword1" class="control-label">Password</label>
                      <input type="password" class="form-control" id="inputpassword1" placeholder="Enter password" data-toggle="validator" data-minlength="6">
					  <span class="help-block">Minimum of 6 characters</span>
                    </div>
                    <div class="form-group">
                      <label for="inputpassword2">Confirm Password</label>
                      <input type="password" class="form-control" id="inputpassword2" placeholder="Re-enter password" data-match="#inputpassword1" data-match-error="Passwords don't match!" required>
					  <div class="help-block with-errors"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button id="submit" class="btn btn-primary" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<!-- /.modal -->
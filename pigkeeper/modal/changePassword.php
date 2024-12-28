<!-- Modal -->
<div class="modal fade" id="changePass" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="changePassTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-2" id="changePassTitle">Change Password</h1>
            </div>
            <div class="modal-body">
                <div class="flex-column">
                    <div class="mb-3">
                        <label for="currentPass" class="form-label">Current Password</label>
                        <input type="password" class="form-control form-control-lg" id="currentPass"
                            placeholder="Enter current password">
                    </div>
                    <div class="mb-3">
                        <label for="newPass" class="form-label">New Password</label>
                        <input type="password" class="form-control form-control-lg" id="newPass"
                            placeholder="Enter new password">
                    </div>
                    <div class="mb-3">
                        <label for="repeatPass" class="form-label">Repeat New Password</label>
                        <input type="password" class="form-control form-control-lg" id="repeatPass"
                            placeholder="Repeat New Password">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="btnCancel" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                <button type="button" id="btnChangePass" class="btn btn-primary">Confirm</button>
            </div>
        </div>
    </div>
</div>
<!-- Modal -->
<div class="modal fade" id="technicianModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="technicianTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="technicianTitle">Technician Management</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="flex-column">
                    <!-- <input type="hidden" class="form-control" id="soldPigID" placeholder=""> -->
                    <div class="mb-3">
                        <label for="fullname" class="form-label">Fullname</label>
                        <input type="text" class="form-control" id="fullname" placeholder="Enter Fullname">
                    </div>
                    <div class="mb-3">
                        <label for="phone" class="form-label">Phone</label>
                        <input type="text" class="form-control" id="phone" placeholder="Enter Phone number">
                    </div>
                    <div class="mb-3">
                        <label for="officeAddress" class="form-label">Office Address</label>
                        <textarea type="text" class="form-control" rows="5" id="officeAddress"
                            placeholder="Enter Office Address"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="officeHours" class="form-label">Office Hours Availability</label>
                        <textarea type="text" class="form-control" rows="5" id="officeHours"
                            placeholder="Enter Office Hours Availability"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <input type="hidden" class="form-control" id="technicianID">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="btnAddtechnician" class="btn btn-primary">Add Technician</button>
                <button type="button" id="btnUpdatetechnician" class="btn btn-primary d-none">Update Technician</button>
            </div>
        </div>
    </div>
</div>
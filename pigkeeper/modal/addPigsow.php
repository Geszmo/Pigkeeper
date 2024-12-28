<!-- Modal -->
<div class="modal fade" id="pigsowModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel1">Add Pigsow</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="flex-column">
                    <div class="mb-3">
                        <label for="sowName" class="form-label">Sow Name</label>
                        <input type="text" class="form-control" id="sowName" placeholder="">
                    </div>
                    <div class="d-flex flex-row gap-3 mb-3">
                        <div class="flex-fill">
                            <label for="sowBirth" class="form-label">Date of Birth</label>
                            <input type="date" class="form-control" id="sowBirth" placeholder="">
                        </div>
                        <div class="flex-fill">
                            <label for="farrowingDate" class="form-label">Farrowing Date</label>
                            <input type="date" class="form-control" id="farrowingDate" placeholder="">
                        </div>
                    </div>
                    <div class="d-flex flex-row gap-3 mb-3">
                        <div class="flex-fill">
                            <label for="breedingStatus" class="form-label">Breeding Status</label>
                            <input type="text" class="form-control" id="breedingStatus" placeholder="">
                        </div>
                        <div class="flex-fill">
                            <label for="numberOfCycles" class="form-label">Number of Cycles</label>
                            <input type="number" class="form-control" value="0" id="numberOfCycles" placeholder="">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label">Notes</label>
                        <textarea type="text" class="form-control" id="pigsowNote" placeholder=""></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="btnSave1" class="btn btn-primary">Save</button>
                <button type="button" id="btnSaveChanges1" class="btn btn-primary d-none">Save Changes</button>
            </div>
        </div>
    </div>
</div>
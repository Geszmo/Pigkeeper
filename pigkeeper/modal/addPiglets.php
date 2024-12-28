<!-- Modal -->
<div class="modal fade" id="pigletsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Piglets</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="flex-column">
                    <div class="d-flex flex-row gap-3">
                        <div class="mb-3">
                            <label for="dateOfBirth" class="form-label">Date of Birth</label>
                            <input type="date" class="form-control" id="dateOfBirth" placeholder="">
                        </div>
                        <div class="mb-3">
                            <label for="batch" class="form-label">Batch</label>
                            <input type="text" class="form-control" id="batch" value="1" placeholder="">
                        </div>
                        <div class="mb-3">
                            <label for="numberOfPig" class="form-label">Number of Pig</label>
                            <input type="number" class="form-control" id="numberOfPig" placeholder="">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label">Notes</label>
                        <textarea type="text" class="form-control" id="notes" placeholder=""></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <input type="hidden" class="form-control" id="pigletsID" placeholder="">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="btnSavePiglets" class="btn btn-primary">Save</button>
                <button type="button" id="btnSaveChanges" class="btn btn-primary d-none">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<script type="module" src="./js/dropdown.js"></script>
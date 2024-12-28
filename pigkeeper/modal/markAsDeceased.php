<!-- Modal -->
<div class="modal fade" id="dateDeceasedModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="deceasedTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deceasedTitle">Date Deceased</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="flex-column">
                    <div class="mb-3">
                        <label for="dateDeceased" class="form-label">Date Sold</label>
                        <input type="date" class="form-control" id="dateDeceased" placeholder="">
                    </div>
                    <div class="mb-3">
                        <label for="numberOfPigDeceased" class="form-label">Number of Pig Deceased</label>
                        <input type="text" class="form-control" id="numberOfPigDeceased" value="1" placeholder="">
                    </div>
                    <div class="mb-3">
                        <label for="deceasedNotes" class="form-label">Notes</label>
                        <textarea type="text" class="form-control" id="deceasedNotes" placeholder=""></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="btnMarkAsDeceased" class="btn btn-primary">Mark as Deceased</button>
            </div>
        </div>
    </div>
</div>
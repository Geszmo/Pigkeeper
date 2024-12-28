<!-- Modal -->
<div class="modal fade" id="dateSoldModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="soldTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="soldTitle">Date Sold</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="flex-column">
                    <!-- <input type="hidden" class="form-control" id="soldPigID" placeholder=""> -->
                    <div class="mb-3">
                        <label for="dateSold" class="form-label">Date Sold</label>
                        <input type="date" class="form-control" id="dateSold" placeholder="">
                    </div>
                    <div class="mb-3">
                        <label for="numberOfPigSold" class="form-label">Number of Pig Sold</label>
                        <input type="text" class="form-control" id="numberOfPigSold" value="1" placeholder="">
                    </div>
                    <div class="mb-3">
                        <label for="pricePerHead" class="form-label">Price Per Head</label>
                        <input type="text" class="form-control" id="pricePerHead" placeholder="">
                    </div>
                    <div class="mb-3">
                        <label for="soldNotes" class="form-label">Notes</label>
                        <textarea type="text" class="form-control" id="soldNotes" placeholder=""></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="btnSold" class="btn btn-danger">Mark as Sold</button>
            </div>
        </div>
    </div>
</div>
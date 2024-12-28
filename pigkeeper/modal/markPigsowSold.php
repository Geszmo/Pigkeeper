<!-- Modal -->
<div class="modal fade" id="markPigsowSold" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="soldPigsowTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="soldPigsowTitle">Sold Pigsow</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="flex-column">
                    <div class="mb-3">
                        <label for="datePigsowSold" class="form-label">Date Sold</label>
                        <input type="date" class="form-control" id="datePigsowSold" placeholder="">
                    </div>
                    <div class="mb-3">
                        <label for="pigsowPrice" class="form-label">Price</label>
                        <input type="text" class="form-control" id="pigsowPrice" placeholder="">
                    </div>
                    <div class="mb-3">
                        <label for="soldPigsowNotes" class="form-label">Notes</label>
                        <textarea type="text" class="form-control" id="soldPigsowNotes" placeholder=""></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="btnSoldPigsow" class="btn btn-danger">Mark as Sold</button>
            </div>
        </div>
    </div>
</div>
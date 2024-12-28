<!-- Modal -->
<div class="modal fade" id="feedingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="feedingTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="feedingTitle">Add Schedule</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="pigFeedDropdown" class="form-label">
                        Select the Pig ID to which the feeding schedule belongs
                    </label>
                    <select class="form-select" id="pigFeedDropdown" aria-label="Default select example">

                    </select>
                </div>
                <div class="mb-3">
                    <label for="feedingType" class="form-label">Feed Type</label>
                    <select class="form-select" id="feedingType" aria-label="Default select example">

                    </select>
                </div>
                <div ss="mb-3">
                    <label for="frequency" class="form-label">Frequency</label>
                    <select class="form-select" id="frequency" aria-label="Default select example">
                        <option selected>3x a Day</option>
                        <option value="2x a Day">2x a Day</option>
                        <option value="1x a Day">1x a Day</option>
                    </select>
                </div>
                <div class="d-flex flex-row gap-3">
                    <div class="mb-3 flex-fill">
                        <label for="dateFrom" class="form-label">From</label>
                        <input type="date" class="form-control" id="dateFrom" placeholder="">
                    </div>
                    <div class="mb-3 flex-fill">
                        <label for="dateTo" class="form-label">To</label>
                        <input type="date" class="form-control" id="dateTo" placeholder="">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="assignedPersonFeeding" class="form-label">Assigned Person</label>
                    <select class="form-select" id="assignedPersonFeeding" aria-label="Default select example">

                    </select>
                </div>
                <div class="mb-3">
                    <label for="feedingNotes" class="form-label">Notes</label>
                    <textarea type="text" class="form-control" id="feedingNotes" placeholder=""></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <input type="hidden" class="form-control" id="feedID" placeholder="">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="btnAddFeed" class="btn btn-primary">Save</button>
                <button type="button" id="btnUpdateFeed" class="btn btn-primary d-none">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<script type="module" src="./js/dropdown.js"></script>
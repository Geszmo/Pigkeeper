<!-- <div class="display-4 mb-5 text-center">Piglet Details</div>
<div class="d-flex flex-wrap gap-3">
    <div class="alert alert-light flex-fill">
        <h4 class="text-dark" id="pigletIdDetail">Pig ID</h4>
        <p>Pig ID</p>
    </div>
    <div class="alert alert-light flex-fill">
        <h4 class="text-dark" id="pigletDateOfBirthDetail">Date of Birth</h4>
        <p>Date of Birth</p>
    </div>
    <div class="alert alert-light flex-fill">
        <h4 class="text-dark" id="pigletNumberOfDaysDetail">Number of Days</h4>
        <p>Number of Days</p>
    </div>
</div>
<div class="d-flex flex-wrap gap-3">
    <div class="alert alert-light flex-fill">
        <h4 class="text-dark" id="pigletBatchDetail">Batch</h4>
        <p>Batch</p>
    </div>
    <div class="alert alert-light flex-fill">
        <h4 class="text-dark" id="pigletNumberOfPigsDetail">Number of Pigs</h4>
        <p>Number of Pigs</p>
    </div>
    <div class="alert alert-light flex-fill">
        <h4 class="text-dark" id="pigletRemainingPigsDetail">Remaining Pigs</h4>
        <p>Remaining Pigs</p>
    </div>
    <div class="alert alert-light flex-fill">
        <h4 class="text-dark" id="pigletNoteDetail">Note</h4>
        <p>Note</p>
    </div>
    <div class="alert alert-light flex-fill">
        <h4 class="text-dark" id="pigletStatusDetail">Status</h4>
        <p>Status</p>
    </div>
</div> -->

<div class="card w-100">
    <div class="table-responsive">
        <table class="table table-hover">
            <tbody>
                <tr>
                    <td colspan="4" class="bg-secondary">
                        <h4 class="text-white m-0">Piglet Details:</h4>
                    </td>
                </tr>
                <tr>
                    <td><b>Pig ID: </b></td>
                    <td colspan="3"><span id="pigletIdDetail"></span></td>
                </tr>
                <tr>
                    <td><b>Date of Birth: </b></td>
                    <td colspan="3"><span id="pigletDateOfBirthDetail"></span></td>
                </tr>
                <tr>
                    <td><b>Number of Days: </b></td>
                    <td colspan="3"><span id="pigletNumberOfDaysDetail"></span></td>
                </tr>
                <tr>
                    <td><b>Batch: </b></td>
                    <td colspan="3"><span id="pigletBatchDetail"></span></td>
                </tr>
                <tr>
                    <td><b>Number of Pigs: </b></td>
                    <td colspan="3"><span id="pigletNumberOfPigsDetail"></span></td>
                </tr>
                <tr>
                    <td><b>Remaining Pigs: </b></td>
                    <td colspan="3"><span id="pigletRemainingPigsDetail"></span></td>
                </tr>
                <tr>
                    <td><b>Note: </b></td>
                    <td colspan="3"><span id="pigletNoteDetail"></span></td>
                </tr>
                <tr>
                    <td><b>Status: </b></td>
                    <td colspan="3"><span id="pigletStatusDetail"></span></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>


<h5 id="pigletRecordsTitle"></h5>
<div class="table-responsive">
    <table class="table table-borderless table-hover" id="pigletRecordsTable">
        <thead>
        </thead>
        <tbody class="align-middle"></tbody>
    </table>
</div>

<h5 id="pigletActivityTitle"></h5>
<div class="table-responsive">
    <table class="table table-borderless table-hover" id="pigletActivityTable">
        <thead>
        </thead>
        <tbody class="align-middle"></tbody>
    </table>
</div>

<h5 id="pigletfeedingTitle"></h5>
<div class="table-responsive">
    <table class="table table-borderless table-hover" id="pigletfeedingTable">
        <thead>
        </thead>
        <tbody class="align-middle"></tbody>
    </table>
</div>
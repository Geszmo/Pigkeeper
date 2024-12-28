<!-- Modal -->
<div class="modal fade" id="pigletTaskModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="pigletTaskTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="pigletTaskTitle">Create Task for Specific Needs</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="flex-column">
                    <div class="mb-3">
                        <label for="pigTaskDropdown" class="form-label">
                            Select the Pig ID to which the Task belongs
                        </label>
                        <select class="form-select" id="pigTaskDropdown" aria-label="Default select example">

                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="taskname" class="form-label">Task name</label>
                        <textarea type="text" class="form-control" id="taskname" placeholder=""></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="reminderTime" class="form-label">Reminder Time</label>
                        <input type="date" class="form-control" id="reminderTime" placeholder="">
                    </div>
                    <div class="mb-3">
                        <label for="priority" class="form-label">Priority</label>
                        <select class="form-select" id="priority" aria-label="Default select example">
                            <option value="Low" selected>Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="assignedPerson" class="form-label">Assigned Person</label>
                        <select class="form-select" id="assignedPerson" aria-label="Default select example">
                            <option value="Admin" selected>Admin</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="taskNotes" class="form-label">Notes</label>
                        <textarea type="text" class="form-control" id="taskNotes" placeholder=""></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <input type="hidden" class="form-control" id="taskID">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="btnSavePigletTask" class="btn btn-primary">Save</button>
                <button type="button" id="btnSaveChangesPigletTask" class="btn btn-primary d-none">Save Changes</button>
            </div>
        </div>
    </div>
</div>
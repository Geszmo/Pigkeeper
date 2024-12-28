<div class="card m-3 p-3 bg-body">
    <h3 class="mb-3">List of Tasks</h3>
    <div class="card-body">
        <button class="btn btn-secondary" id="btnOtherTask" type="button" data-bs-toggle="modal"
            data-bs-target="#pigletTaskModal">Create Task</button>
        <div class="table-responsive" style="min-height: 65vh;">
            <table class="table table-borderless table-hover" id="taskTable">
                <thead>
                    <tr>
                        <th scope="col">Pig ID</th>
                        <th scope="col">Task Name</th>
                        <th scope="col">For</th>
                        <th scope="col">Reminder Time</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody class="align-middle">

                </tbody>
            </table>
        </div>
    </div>
</div>
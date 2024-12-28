<div class="card m-3 p-3 bg-body">
    <h3 class="mb-3">Settings</h3>
    <nav>
        <div class="nav  nav-underline" id="nav-tab" role="tablist">
            <button class="nav-link text-dark active" style="width: 100px;" id="nav-profile-tab" data-bs-toggle="tab"
                data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile"
                aria-selected="true">Profile</button>
            <button class="nav-link text-dark" style="width: 100px;" id="nav-staff-tab" data-bs-toggle="tab"
                data-bs-target="#nav-staff" type="button" role="tab" aria-controls="nav-staff"
                aria-selected="false">Staff</button>
            <button class="nav-link text-dark" style="width: 100px;" id="nav-Technician-tab" data-bs-toggle="tab"
                data-bs-target="#nav-Technician" type="button" role="tab" aria-controls="nav-Technician"
                aria-selected="false">Technician</button>
            <button class="nav-link text-dark" style="width: 150px;" id="nav-device-tab" data-bs-toggle="tab"
                data-bs-target="#nav-device" type="button" role="tab" aria-controls="nav-device"
                aria-selected="false">Device Status</button>
        </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
            <div class="card d-flex align-items-center gap-3 p-3" style="min-height: 65vh;">
                <div class="profile" id="profile">
                    <h1 id="profileName"></h1>
                </div>
                <div class="d-flex flex-column credentials">
                    <div class="d-flex">
                        <input type="text" id="profileUsername" readonly class="border-0 fs-3" style="width: 400px;">
                        <button type="button" id="btnEditSave"
                            class="btn btn-outline-light fs-2 border-0 bi-pencil-square text-dark"></button>
                    </div>
                    <input type="text" id="profileID" readonly class="border-0 text-muted">
                    <input type="text" id="profileEmail" readonly class="border-0 text-muted">
                    <button type="button" class="btn btn-secondary mt-3" data-bs-toggle="modal"
                        data-bs-target="#changePass">
                        Change Password
                    </button>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="nav-staff" role="tabpanel" aria-labelledby="nav-staff-tab">
            <h4 class="my-4">Staff Management</h4>
            <div class="card-body">
                <button type="button" id="btnAddstaffItem" class="btn btn-secondary mb-3" data-bs-toggle="modal"
                    data-bs-target="#staffModal">
                    Add New Staff
                </button>
                <div class="table-responsive" style="min-height: 65vh;">
                    <table class="table table-borderless table-hover" id="staffTable">
                        <thead>

                        </thead>
                        <tbody class="align-middle">

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="nav-Technician" role="tabpanel" aria-labelledby="nav-Technician-tab">
            <h4 class="my-4">Technician Management</h4>
            <div class="card-body">
                <button type="button" id="btnAddTechnicianItem" class="btn btn-secondary mb-3" data-bs-toggle="modal"
                    data-bs-target="#technicianModal">
                    Add New Technician
                </button>
                <div class="table-responsive" style="min-height: 65vh;">
                    <table class="table table-borderless table-hover" id="TechnicianTable">
                        <thead>

                        </thead>
                        <tbody class="align-middle">

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="nav-device" role="tabpanel" aria-labelledby="nav-device-tab">
            <h4 class="my-4">Device Status <span id="deviceStatus"></span></h4>
            <div style="min-height: 65vh;">
                <div class="d-flex flex-wrap gap-3">
                    <div class="d-flex flex-column justify-content-between align-items-start alert alert-light"
                        style="min-width: 250px">
                        <h4>ESP32 Module</h4>
                        <p id="espStatus"></p>
                    </div>
                    <div class="d-flex flex-column justify-content-between align-items-start alert alert-light"
                        style="min-width: 250px">
                        <h4>DHT 11</h4>
                        <p class="m-0">- Temperature</p>
                        <p>- Humidity</p>
                        <p id="dhtStatus"></p>
                    </div>
                    <div class="d-flex flex-column justify-content-between align-items-start alert alert-light"
                        style="min-width: 250px">
                        <h4>LCD</h4>
                        <p id="lcdStatus"></p>
                    </div>
                    <div class="d-flex flex-column justify-content-between align-items-start alert alert-light"
                        style="min-width: 250px">
                        <h4>Relay Module 12v</h4>
                        <p id="relayStatus"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include('modal/changePassword.php') ?>
<?php include('modal/addStaff.php') ?>
<?php include('modal/addTechnician.php') ?>
<div class="card m-3 p-3 bg-body">
    <h3 class="mb-3">Pig Management</h3>
    <nav>
        <div class="nav  nav-underline" id="nav-tab" role="tablist">
            <button class="nav-link text-dark active" id="nav-piglet-tab" data-bs-toggle="tab"
                data-bs-target="#nav-piglet" type="button" role="tab" aria-controls="nav-piglet"
                aria-selected="true">Piglet Management</button>
            <button class="nav-link text-dark" id="nav-pigsow-tab" data-bs-toggle="tab" data-bs-target="#nav-pigsow"
                type="button" role="tab" aria-controls="nav-pigsow" aria-selected="false">Sow Management</button>
        </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-piglet" role="tabpanel" aria-labelledby="nav-piglet-tab">
            <div class="card mb-3">
                <div class="card-body" id="pigletManagement">
                    <button type="button" id="addPiglets" class="btn btn-secondary mb-3" data-bs-toggle="modal"
                        data-bs-target="#pigletsModal">
                        Add Piglets
                    </button>
                    <div class="table-responsive" style="min-height: 65vh;">
                        <table class="table table-borderless table-hover" id="pigletsTable">
                            <thead>

                            </thead>
                            <tbody class="align-middle">

                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card-body bg-body p-3 d-none" id="pigletDetails">
                    <div class="mb-3 text-end">
                        <button type="button" id="pigletBackBtn" class="btn btn-danger bi-x-lg">

                        </button>
                    </div>
                    <!-- Include pig Details -->
                    <?php include('pigletDetails.php') ?>
                </div>

            </div>
        </div>
        <div class="tab-pane fade" id="nav-pigsow" role="tabpanel" aria-labelledby="nav-pigsow-tab">
            <div class="card mb-3">
                <div class="card-body" id="sowManagement">
                    <button type="button" id="addPigsow" class="btn btn-secondary mb-3" data-bs-toggle="modal"
                        data-bs-target="#pigsowModal">
                        Add Pigsow
                    </button>
                    <div class="table-responsive" style="min-height: 65vh;">
                        <table class="table table-borderless table-hover" id="pigsowFeedingTable">
                            <thead>

                            </thead>
                            <tbody class="align-middle">

                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card-body bg-body p-3 d-none" id="sowDetails">
                    <div class="mb-3 text-end">
                        <button type="button" id="sowBackBtn" class="btn btn-danger bi-x-lg">

                        </button>
                    </div>
                    <!-- Include pig Details -->
                    <?php include('pigsowDetails.php') ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include('modal/addPiglets.php') ?>
<?php include('modal/addPigsow.php') ?>
<?php include('modal/markAsSold.php') ?>
<?php include('modal/markPigsowSold.php') ?>
<?php include('modal/markAsDeceased.php') ?>
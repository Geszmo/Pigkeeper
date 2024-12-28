<div class="card m-3 p-3 bg-body">
    <h3>Dashboard</h3>

    <div class="d-flex flex-wrap gap-3 mb-3">
        <!-- Pigsow Card -->
        <div id="card" class="card rounded-3 d-flex flex-fill">
            <div class="card d-flex flex-row align-items-center justify-content-between shadow-sm p-3">
                <div class="flex-column">
                    <div class="fw-medium text-center display-6 mb-2" id="totalPigsow">0</div>
                    <h6 class="text-uppercase title">Pigsow</h6>
                </div>
                <div>
                    <img src="/images/pigsow.svg" alt="Pigsow Icon" class="icon">
                </div>
            </div>
        </div>

        <!-- Piglets Card -->
        <div id="card" class="card rounded-3 d-flex flex-fill">
            <div class="card d-flex flex-row align-items-center justify-content-between shadow-sm p-3">
                <div class="flex-column">
                    <div class="fw-medium text-center display-6 mb-2" id="totalPiglets">0</div>
                    <h6 class="text-uppercase title">Piglets</h6>
                </div>
                <div>
                    <img src="/images/piglets.svg" alt="Piglets Icon" class="icon">
                </div>
            </div>
        </div>

        <!-- Total Expense Card -->

        <div id="card" class="card rounded-3 d-flex flex-fill">
            <div class="card d-flex flex-row align-items-center justify-content-between shadow-sm p-3">
                <div class="flex-column">
                    <div class="fw-medium display-6 mb-2" id="totalExpense">0</div>
                    <h6 class="text-uppercase title">Total Expense</h6>
                </div>
                <div>
                    <i class="bi bi-wallet2" style="font-size: 40px; color:#C74851;"></i>
                    <!-- Optional icon for expenses -->
                </div>
            </div>
        </div>

        <!-- Total Income Card -->
        <div id="card" class="card rounded-3 d-flex flex-fill">
            <div class="card d-flex flex-row align-items-center justify-content-between shadow-sm p-3">
                <div class="flex-column">
                    <div class="fw-medium display-6 mb-2" id="totalIncome">0</div>
                    <h6 class="text-uppercase title">Total Income</h6>
                </div>
                <div>
                    <i class="bi bi-currency-dollar" style="font-size: 40px; color:#C74851;"></i>
                    <!-- Optional icon for income -->
                </div>
            </div>
        </div>
    </div>

    <!-- Chart Section -->
    <div class="row g-3 mb-3">
        <!-- Bar Chart Card -->
        <div class="col-lg-9">
            <div class="card p-3">
                <div class="d-flex justify-content-end">
                    <select class="form-select form-select-sm w-auto " id="selectedYearIncomeExpense"
                        aria-label="Year selection">

                    </select>
                </div>
                <div class="card-body">
                    <div id="financeChart" style="height: 300px;"></div>
                    <div id="pigletChart" style="height: 300px;"></div>
                </div>
            </div>
        </div>
        <!-- Small Charts Section -->
        <div class="col-lg-3">
            <div class="card p-3 h-100">
                <div class="card-header bg-body border-0">
                    <h6 class="text-center">Environmental Conditions</h6>
                </div>
                <div class="card-body d-flex flex-column gap-3">
                    <div id="humidityChart" style="height: 250px;"></div>
                    <div id="temperatureChart" style="height: 250px;"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Upcoming Events and Recent Activity Section -->
    <div class="row g-3 mb-3">
        <!-- Upcoming Events -->
        <div class="col-lg-6">
            <div class="card h-100">
                <div class="card-header bg-body">
                    <h6>Upcoming Task</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table" id="upcomingTaskTable">
                            <thead>

                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- Recent Activity -->
        <div class="col-lg-6">
            <div class="card h-100">
                <div class="card-header bg-body">
                    <h6>Recent Activity</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table" id="recentTaskTable">
                            <thead>

                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
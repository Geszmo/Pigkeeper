<div class="card m-3 p-3 bg-body">
    <h3 class="mb-3">Expense & Income</h3>
    <nav>
        <div class="nav  nav-underline" id="nav-tab" role="tablist">
            <button class="nav-link text-dark active" id="nav-expense-tab" data-bs-toggle="tab"
                data-bs-target="#nav-expense" type="button" role="tab" aria-controls="nav-expense"
                aria-selected="true">Expense Management</button>
            <button class="nav-link text-dark" id="nav-income-tab" data-bs-toggle="tab" data-bs-target="#nav-income"
                type="button" role="tab" aria-controls="nav-income" aria-selected="false">List of Income</button>
        </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-expense" role="tabpanel" aria-labelledby="nav-expense-tab">
            <div class="card-body">
                <button type="button" id="btnAddExpenseItem" class="btn btn-secondary mb-3" data-bs-toggle="modal"
                    data-bs-target="#inventoryModal">
                    Add Expense
                </button>
                <div class="table-responsive" style="min-height: 65vh;">
                    <table class="table table-borderless table-hover" id="expenseTable">
                        <thead>

                        </thead>
                        <tbody class="align-middle">

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="nav-income" role="tabpanel" aria-labelledby="nav-income-tab">
            <div class="card-body">
                <button type="button" id="btnAddIncomeItem" class="btn btn-secondary mb-3 d-none" data-bs-toggle="modal"
                    data-bs-target="#inventoryModal">
                    Add Income
                </button>
                <div class="table-responsive" style="min-height: 65vh;">
                    <table class="table table-borderless table-hover" id="incomeTable">
                        <thead>

                        </thead>
                        <tbody class="align-middle">

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
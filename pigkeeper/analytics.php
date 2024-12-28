<div class="card m-3 p-3 bg-body">
    <div class="card-header d-flex justify-content-between border-0 bg-transparent">
        <h3 class="mb-3 me-auto">Analytics</h3>
        <select class="form-select form-select-sm w-auto " id="selectedYearProfitLoss" aria-label="Year selection">

        </select>
    </div>
    <div id="netProfitChart" style="height: 500px;"></div>
    <div class="d-flex align-items-center flex-row mx-3 gap-3 d-none" id="filterByPigIDContainer">
        <label for="filterByPigID" class="form-label">Filter by Pig ID</label>
        <select class="form-select " id="filterByPigID" style="width: 300px;">

        </select>
    </div>

    <div class="d-flex flex-column" id="analyticsData">
        <div class="card w-100" id="templateAnalytics">
            <!-- <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <td class="bg-light" colspan="4">
                                <h4 class="text-dark m-0">Financial breakdown for PigID: N/A</h4>
                            </td>
                        </tr>
                        <tr>
                            <td class="bg-light" colspan="4">
                                <h6 class="text-dark m-0">Date: N/A</h6>
                            </td>
                        </tr>
                        <tr>
                            <td class="bg-light" colspan="4">
                                <h6 class="text-dark m-0">Additonal information: N/A</h6>
                            </td>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <th>Number of Pigs</th>
                            <th>Sold</th>
                            <th>Deceased</th>
                        </tr>
                        <tr>
                            <td>N/A</td>
                            <td>N/A</td>
                            <td>N/A</td>
                            <td>N/A</td>
                        </tr>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>N/A</td>
                            <td>N/A</td>
                            <td>N/A</td>
                            <td>N/A</td>
                        </tr>
                    </tbody>
                    <tfooter>
                        <tr>
                            <td class="bg-light" colspan="4">
                                <h6 class="text-dark m-0">Profits breakdown</h6>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">Gross Income</th>
                            <th>Total Expense</th>
                            <th>Net Income</th>
                        </tr>
                        <tr>
                            <td colspan="2">0.00</td>
                            <td>0.00</td>
                            <td>0.00</td>
                        </tr>
                    </tfooter>
                </table>
            </div> -->
        </div>
    </div>
</div>
<!-- Modal -->
<div class="modal fade" id="inventoryModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="itemTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="itemTitle">Add Expense</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="flex-column">
                    <div class="mb-3" id="pigIdDivDropdown">
                        <label for="pigIdDropdown" id="pigIdLabel" class="form-label"></label>
                        <select class="form-select" id="pigIdDropdown" aria-label="Default select example">

                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="itemName" class="form-label">Item Name</label>
                        <input type="text" class="form-control" id="itemName" placeholder="">
                    </div>
                    <div class="mb-3">
                        <label for="categoryExpense" class="form-label">Category</label>
                        <select class="form-select" id="categoryExpense">
                            <option value="Feed" selected>Feed</option>
                            <option value="Medicine">Medicine</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Other">Other</option>
                        </select>
                        <select class="form-select d-none" id="categoryIncome">
                            <option value="Livestock" selected>Livestock</option>
                            <option value="Service Income">Service Income</option>
                            <option value="Byproduct">Byproduct</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="qty" class="form-label">Qty</label>
                        <input type="text" class="form-control" id="qty" placeholder="">
                    </div>

                    <div class="mb-3">
                        <label for="price" class="form-label">Price</label>
                        <input type="text" class="form-control" id="price" placeholder="">
                    </div>

                    <div class="mb-3">
                        <label for="dateFinance" class="form-label">Date</label>
                        <input type="date" class="form-control" id="dateFinance" placeholder="">
                    </div>

                    <div class="mb-3">
                        <label for="financialNotes" class="form-label">Notes</label>
                        <textarea type="text" class="form-control" id="financialNotes" placeholder=""></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <input type="hidden" class="form-control" id="itemID" placeholder="">
                <input type="hidden" class="form-control" id="categoryType" placeholder="">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="btnAddItem" class="btn btn-primary">Save</button>
                <button type="button" id="btnUpdateItem" class="btn btn-primary d-none">Save Changes</button>
            </div>
        </div>
    </div>
</div>
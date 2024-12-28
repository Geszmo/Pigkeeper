import { db, collection, getDoc, getDocs, query, where, doc, updateRecord, createRecord, deleteOneRecord } from '../firebaseConfig.js';
import { loadChart } from '../chart.js';
import { fetchPigsData } from '../analytics/analytics.js';

const itemName = document.getElementById('itemName');
const categoryExpense = document.getElementById('categoryExpense');
const categoryIncome = document.getElementById('categoryIncome');
const qty = document.getElementById('qty');
const price = document.getElementById('price');
const dateFinance = document.getElementById('dateFinance');
const financialNotes = document.getElementById('financialNotes');
const itemID = document.getElementById('itemID');
const itemTitle = document.getElementById('itemTitle')
const btnAddExpenseItem = document.getElementById('btnAddExpenseItem');
const btnAddIncomeItem = document.getElementById('btnAddIncomeItem');
const btnUpdateItem = document.getElementById('btnUpdateItem');
const btnAddItem = document.getElementById('btnAddItem');
const totalExpense = document.getElementById('totalExpense');
const pigIdLabel = document.getElementById('pigIdLabel');

btnUpdateItem.addEventListener('click', updateExpenseIncomeItem);
btnAddItem.addEventListener('click', addExpenseIncomeItem);

btnAddExpenseItem.addEventListener('click', () => {
    removedAttributes();
    configureItem('Expense', 'Add Expense', categoryExpense, categoryIncome);
    pigIdLabel.textContent = 'Select the Pig ID to which the expense belongs';
});

btnAddIncomeItem.addEventListener('click', () => {
    configureItem('Income', 'Add Income', categoryIncome, categoryExpense);
    pigIdLabel.textContent = 'Select the Pig ID to which the income belongs';
});

// Delegated Event Listeners
document.addEventListener('click', (event) => {
    const target = event.target;

    // Check if the target is inside the expense or income table
    const table = target.closest('#expenseTable') ? "Expense" : target.closest('#incomeTable') ? "Income" : null;

    if (!table) return; // Exit if the click is outside both tables

    if (target.classList.contains('btn-edit')) {
        const dataId = target.getAttribute('data-id'); // Get the concatenated data-id
        const [docId, pigID] = dataId.split('|');
        type.value = table;
        viewItem(docId); // Pass the table type (Expense or Income)
    }

    if (target.classList.contains('btn-delete')) {
        const docId = target.getAttribute('data-id');
        deleteInventoryItem(docId);
    }
});

export function removedAttributes() {
    qty.removeAttribute('disabled');
    itemName.removeAttribute('disabled');
    pigIdDropdown.removeAttribute('disabled');
    categoryExpense.removeAttribute('disabled');
    categoryExpense.classList.remove('d-none');
    categoryIncome.classList.add('d-none');
    resetFields();
}

function configureItem(target, title, showCategory, hideCategory) {
    resetFields();
    type.value = target;
    itemTitle.textContent = title;
    btnUpdateItem.classList.add('d-none');
    btnAddItem.classList.remove('d-none');
    showCategory.classList.remove('d-none');
    hideCategory.classList.add('d-none');
}

function resetFields() {
    pigIdDropdown.value = 'N/A';
    itemName.value = '';
    categoryExpense.value = '';
    categoryIncome.value = '';
    qty.value = '';
    price.value = '';
    dateFinance.value = '';
    financialNotes.value = '';
}

function getExpenseIncomeData() {
    let category = '';
    if (type.value === 'Expense') {
        category = categoryExpense.value;
    }
    if (type.value === 'Income') {
        category = categoryIncome.value;
    }
    const expenseIncome = {
        loggedInUserId: loggedInUserId,
        pigId: pigIdDropdown.value,
        itemName: itemName.value,
        category: category,
        qty: qty.value,
        price: price.value,
        dateFinance: dateFinance.value,
        financialNotes: financialNotes.value,
        status: "Ongoing",
        type: type.value,
        createdAt: new Date()
    };

    return expenseIncome;
}

async function addExpenseIncomeItem() {

    if (!itemName.value) {
        showMessage('warning', 'Please enter the Item Name', 'Item Name Required!');
        return;
    }

    if (type.value === 'Expense') {
        if (!categoryExpense.value) {
            showMessage('warning', 'Please enter the Category', 'Category Required!');
            return;
        }
    }
    if (type.value === 'Income') {
        if (!categoryIncome.value) {
            showMessage('warning', 'Please enter the Category', 'Category Required!');
            return;
        }
    }

    if (!qty.value) {
        showMessage('warning', 'Please enter the Quantity', 'Quantity Required!');
        return;
    }

    if (!price.value) {
        showMessage('warning', 'Please enter the Price', 'Price Required!');
        return;
    }

    if (!dateFinance.value) {
        showMessage('warning', 'Please enter the Date', 'Date Required!');
        return;
    }
    try {
        createRecord("FinancialRecord", getExpenseIncomeData());
        showMessage('success', 'Item added successfully', 'Financial Record')
        resetFields();
        fetchExpenseIncome();
    } catch (error) {
        console.error("Error adding document:", error);
        alert('An error occurred: ' + error.message);
    }
}

export async function fetchExpenseIncome() {
    try {
        const financeQuery = query(collection(db, "FinancialRecord"), where("loggedInUserId", "==", loggedInUserId));
        const querySnapshot = await getDocs(financeQuery);
        const dataSetExpense = [];
        const dataSetIncome = [];
        let Expense = 0;
        let Income = 0;
        let IncomeNo = 1;
        let ExpenseNo = 1;

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.docId = doc.id;

                if (data.type === 'Expense') {
                    data.no = ExpenseNo++
                    const qty = extractNumber(data.qty || '0'); // Ensure default 0 if null
                    const price = extractNumber(data.price || '0');
                    const total = qty * price;
                    Expense += total;
                    data.total = total;
                    tableRow(dataSetExpense, data);
                } else if (data.type === 'Income') {
                    data.no = IncomeNo++
                    const qty = extractNumber(data.qty || '0'); // Ensure default 0 if null
                    const price = extractNumber(data.price || '0');
                    const total = qty * price;
                    Income += total;
                    data.total = total;
                    data.status = `${Income > Expense ? 'Profit' : 'Loss'}`;
                    tableRow(dataSetIncome, data);
                }
            });
        }

        totalExpense.textContent = formatNumberWithCommas(Expense) + ' PHP';
        totalIncome.textContent = formatNumberWithCommas(Income) + ' PHP';
        initializeExpenseIncomeTable('#expenseTable', dataSetExpense);
        initializeExpenseIncomeTable('#incomeTable', dataSetIncome);
        loadChart();

    } catch (error) {
        console.error("Error fetching data:", error);
        alert('An error occurred: ' + error.message);
    }
}

function tableRow(dataSet, data) {
    dataSet.push([
        data.no || 'N/A',
        data.pigId || 'N/A',
        data.itemName || 'N/A',
        data.category || 'N/A',
        data.qty || 'N/A',
        formatNumberWithCommas(data.price) || 'N/A',
        formatNumberWithCommas(data.total) + ' PHP' || 'N/A',
        data.financialNotes || 'N/A',
        dateFormatter(data.dateFinance) || 'N/A',
        setColorStatus(data.status),
        `<div class="dropdown">
            <button ${data.status === 'Completed' ? 'disabled' : ''} class="btn btn-outline-dark border-0 bi-pencil-fill" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
            <ul class="dropdown-menu">
                <li><button class="dropdown-item btn-edit" type="button" data-bs-toggle="modal" data-bs-target="#inventoryModal" data-id="${data.docId}|${data.pigId}">Edit</button></li>
                <li class="${data.itemName === 'Sold Piglets' || data.itemName === 'Sold Pigsow' ? 'd-none' : ''}"><button class="dropdown-item btn-delete" type="button" data-id="${data.docId}">Delete</button></li>
            </ul>
        </div>`
    ]);
}

async function viewItem(id) {

    btnUpdateItem.classList.remove('d-none');
    btnAddItem.classList.add('d-none'); // Hide the "Add Item" button
    itemTitle.textContent = 'Update Item'; // Update the title of the modal

    try {
        const docRef = doc(db, "FinancialRecord", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();

            if (type.value === 'Expense') {

                qty.removeAttribute('disabled');
                itemName.removeAttribute('disabled');
                pigIdDropdown.removeAttribute('disabled');

                pigIdDropdown.value = data.pigId;
                categoryExpense.classList.remove('d-none');
                categoryIncome.classList.add('d-none');
                categoryExpense.text = data.category;
                categoryExpense.value = data.category;
            } else if (type.value === 'Income') {

                qty.setAttribute('disabled', true);
                itemName.setAttribute('disabled', true);
                pigIdDropdown.setAttribute('disabled', true);
                categoryIncome.setAttribute('disabled', true);

                const option = document.createElement('option');
                option.text = data.pigId;
                option.value = data.pigId;
                option.selected = true;
                pigIdDropdown.add(option);

                categoryExpense.classList.add('d-none');
                categoryIncome.classList.remove('d-none');
                categoryIncome.text = data.category;
                categoryIncome.value = data.category;
                pigIdLabel.textContent = 'Pig ID';
            }

            itemID.value = id;
            itemName.value = data.itemName;
            qty.value = data.qty;
            price.value = data.price;
            dateFinance.value = data.dateFinance;
            financialNotes.value = data.financialNotes;

        } else {
            alert('No data found for the selected record.');
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        alert('An error occurred: ' + error.message);
    }
}

async function updateExpenseIncomeItem() {
    if (!itemName.value) {
        showMessage('warning', 'Please enter the Item Name', 'Item Name Required!');
        return;
    }

    if (type.value === 'Expense') {
        if (!categoryExpense.value) {
            showMessage('warning', 'Please enter the Category', 'Category Required!');
            return;
        }
    }
    if (type.value === 'Income') {
        if (!categoryIncome.value) {
            showMessage('warning', 'Please enter the Category', 'Category Required!');
            return;
        }
    }

    if (!qty.value) {
        showMessage('warning', 'Please enter the Quantity', 'Quantity Required!');
        return;
    }

    if (!dateFinance.value) {
        showMessage('warning', 'Please enter the Date', 'Date Required!');
        return;
    }

    if (!price.value) {
        showMessage('warning', 'Please enter the Price', 'Price Required!');
        return;
    }
    try {
        updateRecord("FinancialRecord", itemID.value, getExpenseIncomeData());
        showMessage('success', 'Item updated successfully', 'Financial Record')
        fetchExpenseIncome();
        fetchPigsData(); // Refresh chart analytics 
    } catch (error) {
        console.error("Error updating document:", error);
        alert('An error occurred: ' + error.message);
    }
}

async function deleteInventoryItem(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
        deleteOneRecord("FinancialRecord", id);
        showMessage('success', 'Item deleted successfully', 'Financial Record')
        fetchExpenseIncome(); // Refresh the displayed data
    } catch (error) {
        console.error("Error deleting document:", error);
        alert('An error occurred: ' + error.message);
    }
}

// Call the function to fetch and display data
fetchExpenseIncome();
realTimeData(fetchExpenseIncome);
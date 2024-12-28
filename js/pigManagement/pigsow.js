import { db, collection, getDoc, getDocs, query, where, doc, updateDoc, updateRecord, createRecord, deleteOneRecord, displayFeedingSchedule, displayPigTask, deleteAllRecords } from '../firebaseConfig.js';
import { getFinancialRecordQuery, loadDropdownData } from '../dropdown.js';
import { loadChart } from '../chart.js';
import { resetFeedingInputFields } from '../feedingSchedule/feedingSchedule.js';
import { fetchExpenseIncome, removedAttributes } from '../expenseIncome/expenseIncome.js';
import { updateFinancialStatus } from '../pigManagement/piglets.js'

// Initialize
const sowName = document.getElementById('sowName');
const sowBirth = document.getElementById('sowBirth');
const breedingStatus = document.getElementById('breedingStatus');
const numberOfCycles = document.getElementById('numberOfCycles');
const farrowingDate = document.getElementById('farrowingDate');
const pigsowNote = document.getElementById('pigsowNote');
const addPigsow = document.getElementById('addPigsow');
const staticBackdropLabel = document.getElementById('staticBackdropLabel1');
const btnSave = document.getElementById('btnSave1');
const btnSaveChanges = document.getElementById('btnSaveChanges1');
const pigsowFeedingTable = document.getElementById('pigsowFeedingTable');

const sowIdDetail = document.getElementById('sowIdDetail');
const sowNameDetail = document.getElementById('sowNameDetail');
const sowDateOfBirthDetail = document.getElementById('sowDateOfBirthDetail');
const sowNumberOfDaysDetail = document.getElementById('sowNumberOfDaysDetail');
const sowBreedingStatusDetail = document.getElementById('sowBreedingStatusDetail');
const sowNumberOfCycleDetail = document.getElementById('sowNumberOfCycleDetail');
const sowForrowingDateDetail = document.getElementById('sowForrowingDateDetail');
const sowNoteDetail = document.getElementById('sowNoteDetail');
const sowStatusDetail = document.getElementById('sowStatusDetail');

const sowManagement = document.getElementById('sowManagement');
const sowDetails = document.getElementById('sowDetails');
const sowBackBtn = document.getElementById('sowBackBtn');

const datePigsowSold = document.getElementById('datePigsowSold');
const pigsowPrice = document.getElementById('pigsowPrice');
const soldPigsowNotes = document.getElementById('soldPigsowNotes');
const btnSoldPigsow = document.getElementById('btnSoldPigsow');

const totalPigsow = document.getElementById('totalPigsow');

btnSave.addEventListener('click', addPigsowData);
btnSaveChanges.addEventListener('click', updatePigsow);

sowBackBtn.addEventListener('click', () => {
    sowManagement.classList.remove('d-none');
    sowDetails.classList.add('d-none');
});

// Delegated Event Listeners
document.querySelector('#pigsowFeedingTable').addEventListener('click', async (event) => {
    const target = event.target;

    // Handle btn-MoreDetails Button
    if (target.classList.contains('btn-MoreDetails')) {
        const docId = target.getAttribute('data-id');
        viewSowDetails(docId);
    }

    // Handle CreateTask Button
    if (target.classList.contains('btn-CreateTask')) {
        const docId = target.getAttribute('data-id');
        pigID = docId;
        pigTaskDropdown.value = docId;

        pigletTaskTitle.textContent = 'Create a Task for Pigsow';
        btnSaveChangesPigletTask.classList.add('d-none');
        btnSavePigletTask.classList.remove('d-none');
        resetTaskFields();
    }

    // Handle AddSched Button
    if (target.classList.contains('btn-AddSched')) {
        const docId = target.getAttribute('data-id');
        pigID = docId;
        resetFeedingInputFields();
        pigFeedDropdown.value = docId;
        // Call the reusable function with pigletID
        await getFinancialRecordQuery(docId);
    }

    if (target.classList.contains('btn-AddExpense')) {
        removedAttributes();
        const sowID = target.getAttribute('data-id');
        pigIdDropdown.value = sowID;
        type.value = "Expense";
    }

    // Handle Inactive Button
    if (target.classList.contains('btn-Inactive')) {
        const docId = target.getAttribute('data-id');
        markAsInactive(docId);
    }

    // Handle Edit Button
    if (target.classList.contains('btn-edit')) {
        const docId = target.getAttribute('data-id');
        viewPigsow(docId);
    }

    // Handle Delete Button
    if (target.classList.contains('btn-delete')) {
        const dataId = target.getAttribute('data-id'); // Get the concatenated data-id
        const [docId, pigID] = dataId.split('|');
        deletePigsow(docId, pigID);
    }
});

addPigsow.addEventListener('click', () => {
    resetFields();
    btnSaveChanges.classList.add('d-none');
    btnSave.classList.remove('d-none');
    staticBackdropLabel.textContent = 'Add Pigsow';
});

function resetFields() {
    sowName.value = '';
    sowBirth.value = '';
    breedingStatus.value = '';
    numberOfCycles.value = '0';
    farrowingDate.value = '';
    pigsowNote.value = '';
}

function getPigsowData(includeId = true) {
    const pigsowData = {
        loggedInUserId: loggedInUserId,
        sowName: sowName.value,
        sowBirth: sowBirth.value,
        breedingStatus: breedingStatus.value,
        numberOfCycles: numberOfCycles.value,
        farrowingDate: farrowingDate.value,
        pigsowNote: pigsowNote.value,
        status: 'Active',
        daysInactive: '',
        createdAt: new Date()
    }

    // Only add the ID if includeId is true    
    if (includeId) {
        pigsowData.pigsowID = 'SOW-' + generateRandomId();
    }

    return pigsowData;
}

async function addPigsowData() {
    if (!sowName.value) {
        showMessage('warning', 'Please enter the Sow Name', 'Pigsow Management');
        return;
    }
    if (!sowBirth.value) {
        showMessage('warning', 'Please enter the Date of Birth', 'Pigsow Management');
        return;
    }
    if (numberOfCycles.value < 0) {
        showMessage('warning', 'The number of cycle must not be a negative number.', 'Piglet Management');
        return;
    }
    try {
        createRecord("Pigsow", getPigsowData(true));
        showMessage('success', 'Added successfully', 'Pigsow Management')
        resetFields();
        fetchPigsowData(); // Refresh the displayed data 
        loadDropdownData();
    } catch (e) {
        console.error("Error adding document: ", e);
        alert('An error occurred: ' + e.message);
    }
}

async function fetchPigsowData() {
    try {
        // Create a query to filter documents by loggedInUserId
        const userQuery = query(
            collection(db, "Pigsow"),
            where("loggedInUserId", "==", loggedInUserId)
        );

        // Execute the query
        const querySnapshot = await getDocs(userQuery);

        const dataSet = []; // Array to hold rows of data
        var Pigsow = 0;

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id; // Firestore document ID
                Pigsow++;
                var status = "", days = "";

                if (data.status === 'Inactive') {
                    status = setPigStatus(data.status);
                    days = data.daysInactive;
                } else {
                    status = setPigStatus(data.status);
                    days = calculateTotalDays(data.sowBirth, getTodayInISOFormat(new Date()))
                }

                dataSet.push([
                    data.pigsowID || 'N/A',
                    data.sowName || 'N/A',
                    dateFormatter(data.sowBirth) || 'N/A',
                    days || 'N/A',
                    data.breedingStatus || 'N/A',
                    data.numberOfCycles || 'N/A',
                    dateFormatter(data.farrowingDate) || 'N/A',
                    data.pigsowNote || 'N/A',
                    status || 'N/A',
                    data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A',
                    `<div class="dropdown">
                        <button class="btn btn-outline-dark border-0 bi-pencil-fill" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                        <ul class="dropdown-menu">
                            <li><button class="dropdown-item btn-MoreDetails" type="button" data-bs-toggle="modal" data-bs-target="#" data-id="${docId}">More Details</button></li>
                            <div class="${data.status === 'Inactive' ? 'd-none' : ''}">
                                <li><button class="dropdown-item btn-CreateTask" type="button" data-bs-toggle="modal" data-bs-target="#pigletTaskModal" data-id="${data.pigsowID}">Create Task</button></li>
                                <li><button class="dropdown-item btn-AddSched" type="button" data-bs-toggle="modal" data-bs-target="#feedingModal" data-id="${data.pigsowID}">Add Feeding Schedule</button></li>
                                <li><button class="dropdown-item btn-AddExpense" type="button" data-bs-toggle="modal" data-bs-target="#inventoryModal" data-id="${data.pigsowID}">Add Expense</button></li>
                                <li><button class="dropdown-item btn-Inactive" type="button" data-bs-toggle="modal" data-bs-target="#markPigsowSold" data-id="${docId}">Mark as Sold</button></li>
                                <li><button class="dropdown-item btn-edit" type="button" data-bs-toggle="modal" data-bs-target="#pigsowModal" data-id="${docId}">Edit</button></li>
                            </div>
                            <li><button class="dropdown-item btn-delete" type="button" data-id="${docId}|${data.pigsowID}">Delete</button></li>
                        </ul>
                    </div>`
                ]);
            });
        }

        totalPigsow.textContent = Pigsow;

        // Initialize DataTable
        $('#pigsowFeedingTable').DataTable({
            destroy: true, // Destroy existing table to avoid duplication
            data: dataSet,
            columns: [
                { title: "Sow ID" },
                { title: "Sow Name" },
                { title: "Date of Birth" },
                { title: "Days" },
                { title: "Breeding Status" },
                { title: "Number of Cycles" },
                { title: "Farrowing Date" },
                { title: "Notes" },
                { title: "Status" },
                { title: "Created At" },
                { title: "Action" }
            ]
        });
        loadChart();
    } catch (e) {
        console.error("Error fetching data: ", e);
        pigsowFeedingTable.innerHTML = `<tr><td colspan="9">Error fetching data: ${e.message}</td></tr>`;
    }
}

async function viewPigsow(id) {
    btnSaveChanges.classList.remove('d-none');
    btnSave.classList.add('d-none');
    staticBackdropLabel.textContent = 'Update Pigsow';
    try {
        const docRef = doc(db, "Pigsow", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            pigID = id;
            sowName.value = data.sowName;
            sowBirth.value = data.sowBirth;
            breedingStatus.value = data.breedingStatus;
            numberOfCycles.value = data.numberOfCycles;
            farrowingDate.value = data.farrowingDate;
            pigsowNote.value = data.pigsowNote;
        } else {
            alert('No data found for the selected record.');
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        alert('An error occurred: ' + error.message);
    }
}

async function viewSowDetails(pigID) {
    sowManagement.classList.add('d-none');
    sowDetails.classList.remove('d-none');
    try {
        const sowDocRef = doc(db, "Pigsow", pigID);
        const docSnap = await getDoc(sowDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            var days = '';
            if (data.status === 'Inactive') {
                days = data.daysInactive;
            } else {
                days = calculateTotalDays(data.sowBirth, getTodayInISOFormat(new Date()))
            }

            sowIdDetail.textContent = data.pigsowID || 'N/A';
            sowNameDetail.textContent = data.sowName || 'N/A';
            sowDateOfBirthDetail.textContent = dateFormatter(data.pigsowBirth) || 'N/A';
            sowNumberOfDaysDetail.textContent = days || 'N/A';
            sowBreedingStatusDetail.textContent = data.breedingStatus || 'N/A';
            sowNumberOfCycleDetail.textContent = data.numberOfCycles || 'N/A';
            sowForrowingDateDetail.textContent = data.farrowingDate || 'N/A';
            sowNoteDetail.textContent = data.pigsowNote || 'N/A';
            sowStatusDetail.innerHTML = setPigStatus(data.status) || 'N/A';

            const taskData = {
                title: 'sowActivityTitle',
                table: '#sowActivityTable',
                dataSet: await displayPigTask(data.pigsowID)
            }

            const feedingData = {
                title: 'sowfeedingTitle',
                table: '#sowfeedingTable',
                dataSet: await displayFeedingSchedule(data.pigsowID)
            }

            initializeTaskTable(taskData);
            initializeFeedingTable(feedingData);

        } else {
            alert('No data found for the selected record.');
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        alert('An error occurred: ' + error.message);
    }
}

async function markAsInactive(pigID) {
    try {
        const pigSowDocRef = doc(db, "Pigsow", pigID);
        const pigSowDoc = await getDoc(pigSowDocRef);
        let pigsowID = '';
        let data = {};
        if (pigSowDoc.exists()) {
            data = pigSowDoc.data();
            data.status = 'Inactive';
            pigsowID = data.pigsowID;
            data.daysInactive = calculateTotalDays(data.sowBirth, getTodayInISOFormat(new Date()));
        }

        btnSoldPigsow.addEventListener('click', async () => {

            if (!datePigsowSold.value) {
                showMessage('warning', 'Please enter the date sold of the Pigsow', 'Pigsow Management');
                return
            }

            if (extractNumber(pigsowPrice.value) <= 0) {
                showMessage('warning', 'The number of pigs must be a positive integer (greater than zero).', 'Pigsow Management');
                return;
            }

            if (!confirm(`Are you sure you want to Mark as Sold this Pigsow ID: ${pigsowID}`)) return;
            await updateDoc(pigSowDocRef, data);

            const IncomeRecords = {
                loggedInUserId: loggedInUserId,
                pigId: data.pigsowID,
                itemName: "Sold Pigsow",
                category: "Livestock",
                qty: 1,
                price: pigsowPrice.value,
                dateFinance: datePigsowSold.value,
                financialNotes: soldPigsowNotes.value,
                type: "Income",
                createdAt: new Date()
            };


            createRecord("FinancialRecord", IncomeRecords);
            showMessage('success', 'Pigsow Sold successfully', 'Pigsow Management');
            updateFinancialStatus(data.pigsowID);
            fetchPigsowData();
            fetchExpenseIncome();
            pigsowPrice.value = '';
            datePigsowSold.value = '';
            soldPigsowNotes.value = '';
        })


    } catch (error) {
        console.error("Error updating document:", error);
        alert('An error occurred: ' + error.message);
    }
}

// Function to update a piglet
async function updatePigsow() {
    if (!sowName.value) {
        showMessage('warning', 'Please enter the Sow Name', 'Pigsow Management');
        return;
    }
    if (!sowBirth.value) {
        showMessage('warning', 'Please enter the Date of Birth', 'Pigsow Management');
        return;
    }
    if (numberOfCycles.value < 0) {
        showMessage('warning', 'The number of cycle must not be a negative number.', 'Piglet Management');
        return;
    }
    try {
        updateRecord("Pigsow", pigID, getPigsowData(false));
        showMessage('success', 'Updated successfully', 'Pigsow Management')
        fetchPigsowData(); // Refresh the displayed data
    } catch (error) {
        console.error("Error updating document:", error);
        alert('An error occurred: ' + error.message);
    }
}

// Function to delete a pigsow
async function deletePigsow(id, pigID) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
        deleteOneRecord("Pigsow", id)
        deleteAllRecords("FeedingSchedule", "pigID", pigID);
        deleteAllRecords("NotificationData", "pigID", pigID);
        deleteAllRecords("PigletsRecords", "pigID", pigID);
        deleteAllRecords("Task", "pigID", pigID);
        showMessage('success', 'Deleted successfully', 'Pigsow Management')
        fetchPigsowData(); // Refresh the displayed data
        fetchExpenseIncome();
        loadDropdownData();
    } catch (error) {
        console.error("Error deleting document:", error);
        alert('An error occurred: ' + error.message);
    }
}

// Call the function to fetch and display user-specific data
fetchPigsowData();
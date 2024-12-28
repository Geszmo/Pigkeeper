import { db, collection, getDoc, getDocs, query, where, doc, updateDoc, updateRecord, createRecord, deleteOneRecord, addNotificationToDatabase, deleteAllRecords } from '../firebaseConfig.js';
import { getFinancialRecordQuery } from '../dropdown.js';

const feedingType = document.getElementById("feedingType");
const frequency = document.getElementById("frequency");
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");
const feedingNotes = document.getElementById("feedingNotes");
const assignedPersonFeeding = document.getElementById("assignedPersonFeeding");
const feedID = document.getElementById("feedID");
const btnAddFeed = document.getElementById("btnAddFeed");
const btnUpdateFeed = document.getElementById("btnUpdateFeed");
const feedingTitle = document.getElementById("feedingTitle");
const btnAddFeedSched = document.getElementById("btnAddFeedSched");

btnAddFeed.addEventListener('click', addFeedingSchedule);
btnUpdateFeed.addEventListener('click', updateFeedingSchedule);

btnAddFeedSched.addEventListener('click', () => {
    resetFeedingInputFields();
})

pigFeedDropdown.addEventListener('change', async () => {
    await getFinancialRecordQuery(pigFeedDropdown.value);
})

// Delegated Event Listeners
document.querySelector('#tableFeeding').addEventListener('click', (event) => {
    const target = event.target;

    // Handle Edit Button
    if (target.classList.contains('btn-edit')) {
        const docId = target.getAttribute('data-id');
        viewFeedingSchedule(docId);
    }

    // Handle Delete Button
    if (target.classList.contains('btn-delete')) {
        const docId = target.getAttribute('data-id');
        deleteFeedingSchedule(docId);
    }
});

function getFeedingData() {

    const feedingData = {
        pigID: pigFeedDropdown.value || 'N/A',
        feedingType: feedingType.value || 'N/A',
        frequency: frequency.value || 'N/A',
        dateFrom: dateFrom.value || 'N/A',
        dateTo: dateTo.value || 'N/A',
        assignedPersonFeeding: assignedPersonFeeding.value || 'N/A',
        feedingNotes: feedingNotes.value || 'N/A',
        createdAt: new Date(),
        loggedInUserId: loggedInUserId
    }
    return feedingData;
}

export function resetFeedingInputFields() {

    btnUpdateFeed.classList.add('d-none');
    btnAddFeed.classList.remove('d-none');
    feedingTitle.textContent = 'Add Schedule';

    feedingType.value = "";
    frequency.value = "";
    dateFrom.value = "";
    dateTo.value = "";
    pigFeedDropdown.value = '';
    assignedPersonFeeding.value = "";
    feedingNotes.value = "";
}

async function addFeedingSchedule() {
    if (!pigFeedDropdown.value) {
        showMessage('warning', 'Please select the Pig ID', 'Feeding Schedule');
        return;
    }
    if (!assignedPersonFeeding.value) {
        showMessage('warning', 'Please select the Assigned Person', 'Feeding Schedule');
        return;
    }
    if (!feedingType.value) {
        showMessage('warning', 'Please select the Feed Type', 'Feeding Schedule');
        return;
    }
    if (!frequency.value) {
        showMessage('warning', 'Please enter the Frequency', 'Feeding Schedule');
        return;
    }
    if (!dateFrom.value) {
        showMessage('warning', 'Please enter the Date From', 'Feeding Schedule');
        return;
    }
    if (!dateTo.value) {
        showMessage('warning', 'Please enter the Date To', 'Feeding Schedule');
        return;
    }
    try {
        // Add new piglet with the generated ID
        createRecord("FeedingSchedule", getFeedingData());
        showMessage('success', 'Added successfully', 'Feeding Schedule')
        resetFeedingInputFields();
        fetchFeedingScheduleData(); // Refresh the displayed data

    } catch (error) {
        console.error("Error adding document:", error);
        alert('An error occurred: ' + error.message);
    }
}

async function fetchFeedingScheduleData() {
    try {
        const userQuery = query(collection(db, "FeedingSchedule"), where("loggedInUserId", "==", loggedInUserId));
        const querySnapshot = await getDocs(userQuery);
        const dataSet = [];
        let counter = 1;
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;

                const statusBadge = setStatus(data.dateFrom, data.dateTo);
                const isCompleted = statusBadge.includes('Completed');

                if (isCompleted) {

                    const notificationData = {
                        id: docId, // Unique identifier for tracking
                        pigID: data.pigID,
                        feedingType: data.feedingType,
                        dateTo: data.dateTo,
                        feedingNotes: data.feedingNotes,
                        assignedPersonFeeding: data.assignedPersonFeeding,
                        status: 'feedingCompleted',
                    };

                    addNotificationToDatabase(notificationData);

                }

                dataSet.push([
                    counter++,
                    data.pigID || 'N/A',
                    data.feedingType || 'N/A',
                    data.frequency || 'N/A',
                    dateFormatter(data.dateFrom) || 'N/A',
                    dateFormatter(data.dateTo) || 'N/A',
                    data.assignedPersonFeeding || 'N/A',
                    data.feedingNotes || 'N/A',
                    statusBadge,
                    data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A',
                    `<div class="dropdown">
                        <button class="btn btn-outline-dark border-0 bi-pencil-fill" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                        <ul class="dropdown-menu">  
                            <li class=" ${isCompleted ? 'd-none' : ''}"><button class="dropdown-item btn-edit" type="button" data-bs-toggle="modal" data-bs-target="#feedingModal" data-id="${docId}">Edit</button></li>
                            <li><button class="dropdown-item btn-delete" type="button" data-id="${docId}">Delete</button></li>
                        </ul>
                    </div>`
                ]);
            });
        }

        // Initialize or reinitialize the DataTable
        $('#tableFeeding').DataTable({
            destroy: true, // Destroy existing table to avoid duplication
            data: dataSet, // Pass the formatted data to DataTable
            columns: [
                { title: 'No.' },
                { title: 'Pig ID' },
                { title: 'Feed Type' },
                { title: 'Frequency' },
                { title: 'From' },
                { title: 'To' },
                { title: 'Asigned Person' },
                { title: 'Notes' },
                { title: 'Status' },
                { title: 'Created At' },
                { title: 'Action' }
            ],
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function viewFeedingSchedule(docId) {
    try {

        btnUpdateFeed.classList.remove('d-none');
        btnAddFeed.classList.add('d-none');
        feedingTitle.textContent = 'Update Schedule';

        const docRef = doc(db, "FeedingSchedule", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            await getFinancialRecordQuery(data.pigID);
            pigID = data.pigID;
            pigFeedDropdown.value = data.pigID;
            assignedPersonFeeding.value = data.assignedPersonFeeding;
            // feedingType.value = data.feedingType;
            frequency.value = data.frequency;
            dateFrom.value = data.dateFrom;
            dateTo.value = data.dateTo;
            feedingNotes.value = data.feedingNotes;
            feedID.value = docId;
        } else {
            console.warn("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

async function updateFeedingSchedule() {
    if (!pigFeedDropdown.value) {
        showMessage('warning', 'Please select the Pig ID', 'Feeding Schedule');
        return;
    }
    if (!assignedPersonFeeding.value) {
        showMessage('warning', 'Please select the Assigned Person', 'Feeding Schedule');
        return;
    }
    if (!feedingType.value) {
        showMessage('warning', 'Please select the Feed Type', 'Feeding Schedule');
        return;
    }
    if (!frequency.value) {
        showMessage('warning', 'Please enter the Frequency', 'Feeding Schedule');
        return;
    }
    if (!dateFrom.value) {
        showMessage('warning', 'Please enter the Date From', 'Feeding Schedule');
        return;
    }
    if (!dateTo.value) {
        showMessage('warning', 'Please enter the Date To', 'Feeding Schedule');
        return;
    }
    try {
        updateRecord("FeedingSchedule", feedID.value, getFeedingData());
        showMessage('success', 'Updated successfully', 'Feeding Schedule')
        fetchFeedingScheduleData(); // Refresh the displayed data
    } catch (error) {
        console.error("Error adding document:", error);
        alert('An error occurred: ' + error.message);
    }
}

async function deleteFeedingSchedule(docId) {

    if (!confirm('Are you sure you want to delete this record?')) return;
    try {

        deleteOneRecord("FeedingSchedule", docId);
        deleteAllRecords("NotificationData", "id", docId);

        showMessage('success', 'Deleted successfully', 'Feeding Schedule')
        fetchFeedingScheduleData(); // Refresh the displayed data

    } catch (error) {
        console.error("Error adding document:", error);
        alert('An error occurred: ' + error.message);
    }
}

// Call the function to fetch and display data
fetchFeedingScheduleData();


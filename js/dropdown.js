import { db, collection, query, where, getDocs } from './firebaseConfig.js';

const queryStaff = query(
    collection(db, "Users"),
    where("loggedInUserId", "==", loggedInUserId),
);

const queryTechnicians = query(
    collection(db, "Technicians"),
    where("loggedInUserId", "==", loggedInUserId),
);

const queryPiglets = query(
    collection(db, "Piglets"),
    where("status", "==", 'Active'),
    where("loggedInUserId", "==", loggedInUserId)
);

const queryPigsow = query(
    collection(db, "Pigsow"),
    where("status", "==", 'Active'),
    where("loggedInUserId", "==", loggedInUserId)
);

// Function to get financial records by pig ID
export async function getFinancialRecordQuery(pigID) {
    const financialQuery = query(
        collection(db, "FinancialRecord"),
        where("loggedInUserId", "==", loggedInUserId),
        where("category", "==", "Feed"),
        where("pigId", "==", pigID)
    );

    // Execute the query and return the snapshot
    feedingType.innerHTML = '';
    dropdown(feedingType, financialQuery);
}

export async function dropdown(element, dataQuery) {
    const existingOptions = new Set(); // To track existing options
    const querySnapshot = await getDocs(dataQuery);
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const role = data.role === 'admin' ? 'Admin: ' : 'Staff: ';
            const itemName = data.itemName || '';
            const username = data.username ? role + data.username : '';
            const technicianName = data.fullname ? 'Technician: ' + data.fullname : '';

            const value = itemName || username || technicianName;

            // Check if the option already exists
            if (!existingOptions.has(value)) {
                const option = document.createElement('option');
                option.classList.add('text-capitalize');
                option.selected = true;
                option.text = value;
                option.value = data.itemName || data.username || data.fullname;
                element.add(option);
                existingOptions.add(value); // Add to Set to avoid duplicates
            }
        });

    } else {

        const option = document.createElement('option');
        option.text = 'No data found';
        option.value = '';
        option.disabled = true;
        element.add(option);
    }
}

async function populatePigIdDropdown(element, dataQuery) {
    const existingPigOptions = new Set(); // Track pig-specific duplicates
    const querySnapshot = await getDocs(dataQuery);
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const value = (data.pigID && data.batch ? data.pigID + ' - Batch ' + data.batch : data.pigsowID + ' - ' + data.sowName) || '';
            if (!existingPigOptions.has(value)) {
                const option = document.createElement('option');
                option.text = value;
                option.value = data.pigID || data.pigsowID;
                element.add(option);
                existingPigOptions.add(value);
            }
        });
    } else {

        // const option = document.createElement('option');
        // option.text = 'No data found';
        // option.value = '';
        // option.disabled = true;
        // element.add(option);
    }
}

export async function loadDropdownData() {
    pigIdDropdown.innerHTML = '';
    pigTaskDropdown.innerHTML = '';
    pigFeedDropdown.innerHTML = '';
    assignedPerson.innerHTML = '';
    assignedPersonFeeding.innerHTML = '';

    const option = document.createElement('option');
    option.text = 'N/A';
    option.value = 'N/A';
    option.selected = true;
    pigIdDropdown.add(option);

    const optionTask = document.createElement('option');
    optionTask.text = 'N/A';
    optionTask.value = 'N/A';
    optionTask.selected = true;
    pigTaskDropdown.add(optionTask);

    populatePigIdDropdown(pigIdDropdown, queryPiglets);
    populatePigIdDropdown(pigIdDropdown, queryPigsow);
    populatePigIdDropdown(pigTaskDropdown, queryPiglets);
    populatePigIdDropdown(pigTaskDropdown, queryPigsow);
    populatePigIdDropdown(pigFeedDropdown, queryPiglets);
    populatePigIdDropdown(pigFeedDropdown, queryPigsow);

    dropdown(assignedPerson, queryStaff);
    dropdown(assignedPerson, queryTechnicians);
    dropdown(assignedPersonFeeding, queryStaff);
}

loadDropdownData();


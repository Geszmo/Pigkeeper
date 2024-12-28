import { db, getDocs, getDoc, doc, query, collection, where, deleteOneRecord, createRecord, updateRecord } from '../firebaseConfig.js';
import { loadDropdownData } from '../dropdown.js';

const fullname = document.getElementById('fullname');
const phone = document.getElementById('phone');
const officeAddress = document.getElementById('officeAddress');
const officeHours = document.getElementById('officeHours');
const technicianID = document.getElementById('technicianID');
const btnAddtechnician = document.getElementById('btnAddtechnician');
const btnUpdatetechnician = document.getElementById('btnUpdatetechnician');
const btnAddTechnicianItem = document.getElementById('btnAddTechnicianItem');

btnAddtechnician.addEventListener('click', addTechnician);
btnUpdatetechnician.addEventListener('click', updateTechnician);

btnAddTechnicianItem.addEventListener('click', () => {
    resetFields();
    btnAddtechnician.classList.remove('d-none');
    btnUpdatetechnician.classList.add('d-none');
});

// Delegated Event Listeners
document.querySelector('#TechnicianTable').addEventListener('click', (event) => {
    const target = event.target;

    // Handle Edit Button
    if (target.classList.contains('btn-edit')) {
        const docId = target.getAttribute('data-id');
        viewTechnicianData(docId);
        technicianID.value = docId;
        btnAddtechnician.classList.add('d-none');
        btnUpdatetechnician.classList.remove('d-none');
    }

    // Handle Delete Button
    if (target.classList.contains('btn-delete')) {
        const docId = target.getAttribute('data-id');
        deleteTechnicianData(docId);
    }
});

function getTechnicanData() {
    const technicianData = {
        loggedInUserId: loggedInUserId,
        fullname: fullname.value,
        phone: phone.value,
        officeAddress: officeAddress.value,
        officeHours: officeHours.value,
        createdAt: new Date()
    };

    return technicianData;
}

function resetFields() {
    fullname.value = '';
    phone.value = '';
    officeAddress.value = '';
    officeHours.value = '';
}

async function addTechnician() {
    if (!fullname.value || !phone.value || !officeAddress.value) {
        showMessage('warning', "All fields are required.", 'Technician Management');
        return;
    }

    try {
        // Add user data to Firestore
        createRecord("Technicians", getTechnicanData());
        showMessage('success', 'Technician added successfully!', 'Technician Management');
        fetchTechnicianData();
        resetFields();
        loadDropdownData();
    } catch (error) {
        console.error("Error:", error);
        showMessage("error", "An error occurred: " + error.message, 'Technician Management');
    }
}

async function viewTechnicianData(docId) {

    try {
        const docRef = doc(db, "Technicians", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            fullname.value = data.fullname || 'N/A';
            phone.value = data.phone || 'N/A';
            officeAddress.value = data.officeAddress || 'N/A';
            officeHours.value = data.officeHours || 'N/A';
        } else {
            showMessage("error", "No such document!", "Technician Management");
        }
    } catch (error) {
        console.error("Error:", error);
        showMessage("error", "An error occurred: " + error.message, 'Technician Management');
    }
}

async function fetchTechnicianData() {

    try {
        const userQuery = query(collection(db, "Technicians"), where("loggedInUserId", "==", loggedInUserId));
        const querySnapshot = await getDocs(userQuery);
        const dataSet = [];
        let counter = 1;

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;

                dataSet.push([
                    counter++,
                    data.fullname || 'N/A',
                    data.phone || 'N/A',
                    data.officeAddress || 'N/A',
                    data.officeHours || 'N/A',
                    data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A',
                    `<div class="dropdown">
                        <button class="btn btn-outline-dark border-0 bi-pencil-fill" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                        <ul class="dropdown-menu">  
                            <li><button class="dropdown-item btn-edit" type="button" data-bs-toggle="modal" data-bs-target="#technicianModal" data-id="${docId}">Edit</button></li>
                            <li><button class="dropdown-item btn-delete" type="button" data-bs-toggle="modal" data-bs-target="" data-id="${docId}">Delete</button></li>
                        </ul>
                    </div>`
                ]);
            });
        }

        // Initialize or reinitialize the DataTable
        $('#TechnicianTable').DataTable({
            destroy: true, // Destroy existing table to avoid duplication
            data: dataSet, // Pass the formatted data to DataTable
            columns: [
                { title: 'No.' },
                { title: 'Fullname' },
                { title: 'Phone' },
                { title: 'Office Address' },
                { title: 'Office Hours Availability' },
                { title: 'Created At' },
                { title: 'Action' }
            ],
        });

    } catch (error) {
        console.error("Error:", error);
        showMessage("error", "An error occurred: " + error.message, 'Technician Management');
    }
}

async function updateTechnician() {
    if (!fullname.value || !phone.value || !officeAddress.value) {
        showMessage('warning', "All fields are required.", 'Technician Management');
        return;
    }
    try {
        updateRecord("Technicians", technicianID.value, getTechnicanData());
        showMessage('success', 'Updated successfully', 'Technician Management')
        fetchTechnicianData(); // Refresh the displayed data
    } catch (error) {
        console.error("Error adding document:", error);
        alert('An error occurred: ' + error.message);
    }
}

async function deleteTechnicianData(docId) {

    if (!confirm('Are you sure you want to delete this Technicians?')) return;
    try {

        deleteOneRecord("Technicians", docId);
        showMessage('success', 'Technician deleted successfully!', 'Technician Management');
        fetchTechnicianData(); // Refresh the displayed data
        loadDropdownData();

    } catch (error) {
        console.error("Error adding document:", error);
        alert('An error occurred: ' + error.message);
    }
}

fetchTechnicianData();
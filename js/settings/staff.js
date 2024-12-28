import { firebaseConfig, initializeApp, getAuth, createUserWithEmailAndPassword, db, doc, getDocs, getDoc, setDoc, query, collection, where, deleteOneRecord, createRecord } from '../firebaseConfig.js';
import { loadDropdownData } from '../dropdown.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

const staffUsername = document.getElementById('staffUsername');
const staffEmail = document.getElementById('staffEmail');
const staffPassword = document.getElementById('staffPassword');
const btnAddStaff = document.getElementById('btnAddStaff');

btnAddStaff.addEventListener('click', addStaff);

// Delegated Event Listeners
document.querySelector('#staffTable').addEventListener('click', (event) => {
    const target = event.target;
    // Handle Delete Button
    if (target.classList.contains('btn-delete')) {
        const docId = target.getAttribute('data-id');
        deleteStaff(docId);
    }
    // Handle Show Password Button
    if (target.classList.contains('btn-showPass')) {
        const docId = target.getAttribute('data-id');
        const passwordInput = document.getElementById(`password-${docId}`);
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text'; // Show the password
            target.classList.remove('bi-eye-fill');
            target.classList.add('bi-eye-slash-fill'); // Change icon to indicate "Hide Password"
        } else {
            passwordInput.type = 'password'; // Hide the password
            target.classList.remove('bi-eye-slash-fill');
            target.classList.add('bi-eye-fill'); // Change icon back to "Show Password"
        }
    }
});

function resetFields() {
    staffUsername.value = '';
    staffEmail.value = '';
    staffPassword.value = '';
}

async function addStaff() {
    if (!staffUsername.value || !staffEmail.value || !staffPassword.value) {
        showMessage('warning', "All fields are required.", 'Staff Management');
        return;
    }

    try {
        // Check if the email already exists in Firestore
        const querySnapshot = await getDocs(query(collection(db, "Users"), where("email", "==", staffEmail.value)));
        if (!querySnapshot.empty) {
            showMessage('warning', 'This email is already registered', 'Staff Management');
            return;
        }

        // Add user to Firebase Authentication only after ensuring Firestore data is valid
        // const userCredential = await createUserWithEmailAndPassword(auth, staffEmail.value, staffPassword.value);
        // const user = userCredential.user;

        const userData = {
            loggedInUserId: loggedInUserId,
            role: "user",
            username: staffUsername.value,
            email: staffEmail.value,
            password: staffPassword.value,
            createdAt: new Date()
        };

        // Add user data to Firestore
        createRecord("Users", userData);
        // const docRef = doc(db, "Users", user.uid);
        // await setDoc(docRef, userData);

        showMessage('success', 'Account created successfully!', 'Staff Management');
        fetchStaffData();
        resetFields();
        loadDropdownData();

    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            showMessage('warning', 'This email is already registered in Authentication', 'Staff Management');
        } else {
            console.error("Error:", error);
            alert("An error occurred: " + error.message);
        }
    }
}

async function fetchStaffData() {
    try {
        const userQuery = query(collection(db, "Users"), where("loggedInUserId", "==", loggedInUserId));
        const querySnapshot = await getDocs(userQuery);
        const dataSet = [];
        let no = 1;
        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
                const data = doc.data();
                const docId = doc.id;
                // Add data to the table
                if (data.role === 'user') {
                    dataSet.push([
                        no++ || 'N/A',
                        data.username || 'N/A',
                        data.email || 'N/A',
                        `<input type="password" id="password-${docId}" class="form-control bg-transparent border-0" disabled value="${data.password}" />` || 'N/A',
                        data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A',
                        `<button class="bi-eye-fill border-0 btn btn-outline-dark btn-showPass" type="button" data-id="${docId}"></button>
                    <button class="bi-trash-fill border-0 btn btn-outline-danger btn-delete" type="button" data-id="${docId}"></button>`
                    ]);
                }
            });
        }

        // Initialize or reinitialize the DataTable
        $('#staffTable').DataTable({
            destroy: true, // Destroy existing table to avoid duplication
            data: dataSet, // Pass the formatted data to DataTable
            columns: [
                { title: 'No.' },
                { title: 'Username' },
                { title: 'Email' },
                { title: 'Password' },
                { title: 'Account Created On' },
                { title: 'Action' }
            ],
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function deleteStaff(docId) {

    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
        deleteOneRecord("Users", docId);// Step 2: Delete the user from Firebase Authentication
        showMessage('success', 'Deleted successfully!', 'Staff Management')
        fetchStaffData(); // Refresh the displayed data
        loadDropdownData();
    } catch (error) {
        console.error("Error adding document:", error);
        alert('An error occurred: ' + error.message);
    }
}


fetchStaffData();
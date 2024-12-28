import { db, getDocs, collection, updateRecord } from '../firebaseConfig.js';

// Reset profile username when clicking outside 
const profile = document.getElementById("profile");
const profileName = document.getElementById("profileName");
const profileID = document.getElementById("profileID");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const btnEditSave = document.getElementById("btnEditSave");
const btnChangePass = document.getElementById("btnChangePass");
const btnCancel = document.getElementById("btnCancel");

const currentPass = document.getElementById("currentPass");
const newPass = document.getElementById("newPass");
const repeatPass = document.getElementById("repeatPass");

let correctCurrentPass = ""; // Replace this with actual verification
let originalUsername = ""; // Variable to store the original username

// Generate random color except black
function generateSubtleColor() {
    let r = Math.floor(Math.random() * 128) + 128; // Restrict to lighter shades
    let g = Math.floor(Math.random() * 128) + 128;
    let b = Math.floor(Math.random() * 128) + 128;
    let a = Math.random() * 0.5 + 0.5; // Opacity between 0.5 and 1
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}


// Add event listener for clicks outside the input
document.addEventListener("click", (event) => {
    if (event.target !== profileUsername && event.target !== btnEditSave) {
        // Reset to the original username if not saved
        if (btnEditSave.classList.contains("bi-check-circle-fill")) {
            profileUsername.value = originalUsername;
        }
    }
});

btnEditSave.addEventListener("click", (event) => {
    if (btnEditSave.classList.contains("bi-pencil-square")) {
        profileUsername.removeAttribute("readonly");
        profileUsername.classList.add("border-bottom");
        btnEditSave.classList.remove("bi-pencil-square");
        btnEditSave.classList.add("bi-check-circle-fill");
    } else {
        event.stopPropagation();
        profileUsername.setAttribute("readonly", true); // Corrected method
        profileUsername.classList.remove("border-bottom");
        btnEditSave.classList.add("bi-pencil-square");
        btnEditSave.classList.remove("bi-check-circle-fill");
        updateUserCredentials(loggedInUserId, correctCurrentPass, 'Username updated successfully!');
    }
});

// Attach event listener to the confirm button
btnChangePass.addEventListener("click", validatePasswordChange);

function resetFields() {
    currentPass.value = "";
    newPass.value = "";
    repeatPass.value = "";
    btnCancel.click();
}

// Function to validate the passwords
function validatePasswordChange() {
    // Check if current password is correct
    if (currentPass.value !== correctCurrentPass) {
        alert("Current password is incorrect!");
        return false;
    }

    // Check if new password is empty
    if (!newPass.value) {
        alert("New password cannot be empty!");
        return false;
    }

    // Check if repeat password matches new password
    if (newPass.value !== repeatPass.value) {
        alert("New passwords do not match!");
        return false;
    }

    // If all checks pass
    updateUserCredentials(loggedInUserId, newPass.value, "Password change successfully!");
}

async function fetchUserProfileData() {

    profile.style.backgroundColor = generateSubtleColor();
    try {
        const userQuery = collection(db, "Users");
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
                const data = doc.data();
                const docId = doc.id;

                if (docId === loggedInUserId) {
                    profileID.value = 'ID: ' + loggedInUserId;
                    profileUsername.value = data.username;
                    profileEmail.value = 'Email: ' + data.email;
                    originalUsername = data.username;
                    correctCurrentPass = data.password;
                    profileName.textContent = data.username.charAt(0);
                }

            });
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        showMessage('error', error, 'Pigkeeper');
    }
}

async function updateUserCredentials(userID, password, message) {
    if (!confirm('Are you sure you want to save changes?')) return;
    try {
        const userData = {
            username: profileUsername.value,
            password: password
        }
        updateRecord('Users', userID, userData);
        document.getElementById("user").innerText = "Hello " + profileUsername.value + "!";
        showMessage('success', message, 'Profile Management');
        fetchUserProfileData();
        resetFields();
    } catch (error) {
        console.error("Error fetching data:", error);
        showMessage('error', error, 'Pigkeeper');
    }
}

fetchUserProfileData();
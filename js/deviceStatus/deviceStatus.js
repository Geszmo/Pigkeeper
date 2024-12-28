import { app, getDatabase, ref, onValue, set } from "../firebaseConfig.js";

// Initialize Realtime Database
const db = getDatabase(app);

// Define paths with userID
const userDevicesPath = `UserID/${loggedInUserId}/Devices`;

const espStatusData = ref(db, `${userDevicesPath}/ESP32/Status`);
const dhtStatusData = ref(db, `${userDevicesPath}/DHT/Status`);
const lcdStatusData = ref(db, `${userDevicesPath}/LCD/Status`);
const relayStatusData = ref(db, `${userDevicesPath}/Relay/Status`);

const espStatus = document.getElementById("espStatus");
const dhtStatus = document.getElementById("dhtStatus");
const lcdStatus = document.getElementById("lcdStatus");
const relayStatus = document.getElementById("relayStatus");

// Map statuses to their corresponding classes
const statusClasses = {
    "Active": ["badge", "bg-success", "text-white"],
    "Inactive": ["badge", "bg-warning", "text-dark"],
};

// Initialize device references
function initializeDeviceReference(ref, defaultValue = "Inactive") {
    set(ref, defaultValue)
        .then(() => console.log(`Initialized ${ref.key} to ${defaultValue}`))
        .catch((error) => console.error(`Failed to initialize ${ref.key}:`, error));
}

// Initialize all devices for the user
function initializeDevicesForUser() {
    initializeDeviceReference(espStatusData);
    initializeDeviceReference(dhtStatusData);
    initializeDeviceReference(lcdStatusData);
    initializeDeviceReference(relayStatusData);
}

// Check device status and update UI
function checkDeviceStatus(ref, element) {
    onValue(ref, (snapshot) => {
        const data = snapshot.val();
        element.innerText = data;

        // Clear all potential status classes
        element.className = "";

        if (data) {
            // Add class based on the status
            if (data === "Active") {
                element.classList.add(...statusClasses[data]);
            } else {
                element.classList.add(...statusClasses[data]);
            }
        } else {
            // If no status, initialize as Inactive
            set(ref, "Inactive");
        }
    });
}

// Run initialization before starting status checks
initializeDevicesForUser();

// Check statuses periodically
setInterval(() => {
    checkDeviceStatus(espStatusData, espStatus);
    checkDeviceStatus(dhtStatusData, dhtStatus);
    checkDeviceStatus(lcdStatusData, lcdStatus);
    checkDeviceStatus(relayStatusData, relayStatus);
}, 1000);

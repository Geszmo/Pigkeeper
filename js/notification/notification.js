import { db, collection, doc, getDocs, getDoc, query, where, updateDoc, deleteAllNotifications } from '../firebaseConfig.js';

const notificationContainer = document.getElementById("notificationContainer");
const notificationNumber = document.getElementById("notificationNumber");
const emptyNotification = document.getElementById("emptyNotification");

emptyNotification.addEventListener('click', () => {
    if (!confirm('Are you sure you want to delete all notifications?')) return;
    deleteAllNotifications();
    countUnreadMessage();
    notificationContainer.classList.add('d-none');
})

document.addEventListener('click', async (event) => {
    if (event.target && event.target.classList.contains('hideElement')) {
        const notificationCard = event.target.closest('.card'); // Get the notification card element
        if (notificationCard) {
            const notificationID = notificationCard.id.replace('notification-', ''); // Extract the notification ID
            notificationCard.style.display = "none"; // Hide the notification card

            // Update the database to mark this notification as hidden
            try {
                await updateNotificationInDatabase(notificationID, true, true); // Mark as read and hidden
                console.log(`Notification ${notificationID} marked as hidden.`);
                showMessage('success', 'Removed Successfully!', 'NOtifications');
            } catch (error) {
                console.error("Error hiding notification:", error);
                alert('Failed to hide notification: ' + error.message);
            }
        }
    }
});

async function fetchNotifications() {
    const userQuery = query(
        collection(db, "NotificationData"),
        where("loggedInUserId", "==", loggedInUserId)
    );
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {

        notificationContainer.classList.remove('d-none');
        notificationContainer.innerHTML = '';
        // Process notifications if any
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.notificationID = doc.id;
            updateNotificationCard(data);
        });
        countUnreadMessage();
    } else {
        // Clear the notification container and show a placeholder message
        notificationContainer.innerHTML = `
            <div class="w-100 alert alert-info text-center">
                No notifications available at the moment.
            </div>`;
    }
}

async function countUnreadMessage() {
    try {
        const NotificationData = query(
            collection(db, "NotificationData"),
            where("read", "==", false), // Filter NotificationData with "false" read
            where("loggedInUserId", "==", loggedInUserId), // Optional: filter by user if applicable
        );

        const querySnapshot = await getDocs(NotificationData);

        // Count the tasks
        const unreadNotification = querySnapshot.size;
        notificationNumber.textContent = unreadNotification;


        return unreadNotification;
    } catch (error) {
        console.error("Error counting pending tasks:", error);
        return 0;
    }
}

async function toggleReadStatus(event, id) {
    const isChecked = event.target.checked; // Check if the checkbox is marked
    const titleElement = document.querySelector(`#notification-${id} .titleElement`); // Select the title element
    const cardHeaderElement = document.querySelector(`#notification-${id} .card-header`); // Select the card header
    const cardElement = document.querySelector(`#notification-${id}`); // Select the card

    if (titleElement) {
        if (isChecked) {
            // Mark as read
            titleElement.classList.remove('fw-bold');
            cardHeaderElement.classList.remove('alert-primary');
            cardHeaderElement.classList.add('alert-secondary');
            await updateNotificationInDatabase(id, true); // Update "read" status in the database
            notificationContainer.appendChild(cardElement); // Move to the bottom
        } else {
            // Mark as unread
            titleElement.classList.add('fw-bold');
            cardHeaderElement.classList.remove('alert-secondary');
            cardHeaderElement.classList.add('alert-primary');
            await updateNotificationInDatabase(id, false); // Update "unread" status in the database
            notificationContainer.insertAdjacentElement('afterbegin', cardElement); // Move to the top
        }
        countUnreadMessage(); // Update unread count
    }
}

async function updateNotificationInDatabase(id, isRead, isHidden = false) {
    try {
        const NotificationData = doc(db, "NotificationData", id);
        const NotificationDataDoc = await getDoc(NotificationData);
        if (NotificationDataDoc.exists()) {
            const data = NotificationDataDoc.data();
            data.read = isRead;
            data.hide = isHidden;
            await updateDoc(NotificationData, data);
        } else {
            console.warn("No such document!");
        }
    } catch (error) {
        console.error("Error updating document:", error);
        alert('An error occurred: ' + error.message);
    }
}

function updateNotificationCard(data) {

    // Define the templates based on the type or conditions
    const notificationTemplates = [
        {
            condition: (data) => data.status === "Inactive",
            template: (data) => inactivePigNotificationTemplate(data)
        },
        {
            condition: (data) => data.status === "feedingCompleted",
            template: (data) => feedingNotificationTemplate(data)
        },
        {
            condition: (data) => data.status === "Pending" || data.status === "Completed",
            template: (data) => taskNotificationTemplate(data)
        },
        // Add more notification types here as needed
    ];

    // Generate HTML for all matching templates
    const notificationHtml = notificationTemplates
        .filter(({ condition }) => condition(data)) // Only include templates where the condition matches
        .map(({ template }) => template(data))     // Generate the HTML for each matched template
        .join("");                                 // Combine into a single string

    if (!notificationHtml) return; // Exit if no template applies

    const existingNotification = document.querySelector(`#notification-${data.notificationID}`);
    if (existingNotification) {
        existingNotification.innerHTML = notificationHtml;
    } else {
        const notificationElement = document.createElement('div');
        notificationElement.innerHTML = notificationHtml;
        const isRead = data.read;

        // Insert unread notifications at the top and read ones at the bottom
        if (isRead) {
            notificationContainer.appendChild(notificationElement.firstElementChild);
        } else {
            notificationContainer.insertAdjacentElement("afterbegin", notificationElement.firstElementChild);
        }
    }

    const markAsReadCheckbox = document.querySelector(`#notification-${data.notificationID} .mark-as-read`);
    if (markAsReadCheckbox) {
        markAsReadCheckbox.addEventListener('change', (event) => toggleReadStatus(event, data.notificationID));
    }
}

function feedingNotificationTemplate(data) {
    return `
        <div class="card mb-3 w-100 bg-light ${data.hide === true ? 'd-none' : ''}" id="notification-${data.notificationID}">
            <div class="card-header alert ${data.read ? 'alert-secondary' : 'alert-primary'} d-flex">
                <i class="mx-3 bi-trash-fill text-danger hideElement"></i>
                <input class="form-check-input me-3 mark-as-read" type="checkbox" value="" id="${data.notificationID}" ${data.read ? 'checked' : ''}>
                <label class="form-check-label" for="${data.notificationID}">
                    <p class="card-title ${data.read ? '' : 'fw-bold'} titleElement">Mark as read</p>
                </label>
                
                <label class="ms-auto text-muted">
                    ${timeAgo(data.dateTo)}
                </label>
            </div>
            <div class="card-body">
                <h5 class="text-uppercase">Feeding Schedule Completed</h5>
                <p class="card-text">
                    Feeding schedule for ${setColorStatus(data.feedingType)} (Pig ID: ${setColorStatus(data.pigID)}) 
                    Assigned by ${setColorStatus(data.assignedPersonFeeding)}
                    is now ${setColorStatus('Completed')} as of ${setColorStatus(dateFormatter(data.dateTo))}.
                    Please review the schedule and plan the next feeding cycle or adjust tasks as needed.
                </p>
            </div>
            <div class="card-footer bg-transparent">
                Notes: ${data.feedingNotes || 'No additional notes provided.'}
            </div>
        </div>`;
}

function inactivePigNotificationTemplate(data) {
    return `
        <div class="card mb-3 w-100 bg-light ${data.hide === true ? 'd-none' : ''}" id="notification-${data.notificationID}">
            <div class="card-header alert ${data.read ? 'alert-secondary' : 'alert-primary'} d-flex">
                <i class="mx-3 bi-trash-fill text-danger hideElement"></i>
                <input class="form-check-input me-3 mark-as-read" type="checkbox" value="" id="${data.notificationID}" ${data.read ? 'checked' : ''}>
                <label class="form-check-label" for="${data.notificationID}">
                    <p class="card-title ${data.read ? '' : 'fw-bold'} titleElement">Mark as read</p>
                </label>
                
                <label class="ms-auto text-muted">
                    ${timeAgo(data.createdAt)}
                </label>
            </div>
            <div class="card-body">
                <h5 class="text-uppercase">Pig Management Update</h5>
                <p class="card-text">
                    Pig ID ${setColorStatus(data.pigID)} from Batch ${setColorStatus(data.batch)}, born on 
                    ${setColorStatus(dateFormatter(data.dateOfBirth))}, has been marked as ${setPigStatus(data.status)}. All ${setColorStatus(data.numberOfPigs)} pigs in this group have been managed, and no 
                    remaining pigs are active in the system.
                </p>
            </div>
            <div class="card-footer bg-transparent">
                Notes: ${data.notes || 'No additional notes provided.'}
            </div>
        </div>`;
}

function taskNotificationTemplate(data) {
    return `
        <div class="card mb-3 w-100 bg-light ${data.hide === true ? 'd-none' : ''}" id="notification-${data.notificationID}">
            <div class="card-header alert ${data.read ? 'alert-secondary' : 'alert-primary'} d-flex">
                <i class="mx-3 bi-trash-fill text-danger hideElement"></i>
                <input class="form-check-input me-3 mark-as-read" type="checkbox" value="" id="${data.notificationID}" ${data.read ? 'checked' : ''}>
                <label class="form-check-label" for="${data.notificationID}">
                    <p class="card-title ${data.read ? '' : 'fw-bold'} titleElement">Mark as read</p>
                </label>
                
                <label class="ms-auto text-muted">
                    ${timeAgo(data.createdAt)}
                </label>
            </div>
            <div class="card-body">
                <h5 class="text-uppercase">${data.taskname} Task</h5>
                <p class="card-text">
                    A ${setColorStatus(data.taskname)} task for Pig ID ${setColorStatus(data.pigID)} is scheduled for 
                    ${setColorStatus(dateFormatter(data.reminderTime))}.
                </p>
                <p class="card-text">
                    Priority Level: ${setPriorityLevel(data.priorityLevel)}
                </p>
                <p class="card-text text-capitalize">
                    Asigned Person: ${setColorStatus(data.assignedPerson)}
                </p>
                <p class="card-text">
                    Task Status: ${setTaskStatus(data.status)}
                </p>
            </div>
            <div class="card-footer bg-transparent">
                Notes: ${data.taskNotes || 'No additional notes provided.'}
            </div>
        </div>`;
}

// Call the function to fetch and display data
fetchNotifications();
realTimeData(fetchNotifications);

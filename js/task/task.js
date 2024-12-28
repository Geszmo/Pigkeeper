import { db, collection, getDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, updateRecord, createRecord, addNotificationToDatabase, deleteOneRecord, deleteAllRecords } from '../firebaseConfig.js';

const btnOtherTask = document.getElementById('btnOtherTask');
const noTask = document.getElementById('noTask');
const noCompletedTask = document.getElementById('noCompletedTask');
const totalTaskStaff = document.getElementById('totalTaskStaff');
const totalCompletedTastStaff = document.getElementById('totalCompletedTastStaff');

btnSavePigletTask.addEventListener('click', addTaskData);
btnSaveChangesPigletTask.addEventListener('click', updateTask);

btnOtherTask.addEventListener('click', () => {
    pigletTaskTitle.textContent = 'Create Task for Specific Needs';
    btnSaveChangesPigletTask.classList.add('d-none');
    btnSavePigletTask.classList.remove('d-none');
    pigTaskDropdown.value = 'N/A';
    resetTaskFields();
});

// Delegated Event Listeners
document.querySelector('#taskTable').addEventListener('click', (event) => {
    const target = event.target;
    // Handle Edit Button
    if (target.classList.contains('btn-completed')) {
        const docId = target.getAttribute('data-id');
        markAsCompleted(docId);
    }

    // Handle Edit Button
    if (target.classList.contains('btn-edit')) {
        const docId = target.getAttribute('data-id');
        viewTask(docId);
    }

    // Handle Delete Button
    if (target.classList.contains('btn-delete')) {
        const docId = target.getAttribute('data-id');
        deleteTask(docId);
    }
});

// Event delegation to target the "Mark as Completed" button
document.querySelector('#accordionFlushToDo').addEventListener('click', async (event) => {
    if (event.target.classList.contains('btn-Completed')) {
        const docId = event.target.getAttribute('data-id'); // Get the Firestore document ID
        if (!confirm('Are you sure you want to Mark as Completed this record?')) return;
        try {
            // Update the task status in Firestore
            const docRef = doc(db, "Task", docId);
            await updateDoc(docRef, { status: "Completed", dateCompleted: new Date() });

            const notifQuery = query(
                collection(db, "NotificationData"),
                where("id", "==", docId)
            );

            const querySnapshot = await getDocs(notifQuery);
            const promises = querySnapshot.docs.map((doc) =>
                updateDoc(doc.ref, { status: "Completed" })
            );
            await Promise.all(promises);

            // Provide user feedback
            showMessage('success', "Task marked as completed!", 'To do List');
            staffTask();

        } catch (error) {
            console.error("Error marking task as completed:", error);
            showMessage('error', "Failed to mark task as completed.", 'To do List');
        }
    }
})

function getTaskData() {
    const taskData = {
        loggedInUserId: loggedInUserId,
        pigID: pigTaskDropdown.value,
        taskname: taskname.value,
        reminderTime: reminderTime.value,
        priority: priority.value,
        assignedPerson: assignedPerson.value,
        taskNotes: taskNotes.value,
        status: 'Pending',
        dateCompleted: '',
        createdAt: new Date()
    }
    return taskData;
}

async function addTaskData() {
    if (!taskname.value) {
        showMessage('warning', 'Please enter the Task Name', 'Task');
        return;
    }
    if (!reminderTime.value) {
        showMessage('warning', 'Please enter the Reminder Time', 'Task');
        return;
    }
    if (!priority.value) {
        showMessage('warning', 'Please enter the Priority', 'Task');
        return;
    }
    try {
        createRecord("Task", getTaskData());
        showMessage('success', 'Task added successfully', 'Task')
        resetTaskFields();
        fetchTaskData(); // Refresh the displayed data
    } catch (e) {
        console.error("Error adding document: ", e);
        alert('An error occurred: ' + e.message);
    }
}

async function countPendingTasks() {
    try {
        const taskQuery = query(
            collection(db, "Task"),
            where("status", "==", "Pending"), // Filter tasks with "Pending" status
            where("loggedInUserId", "==", loggedInUserId) // Optional: filter by user if applicable
        );

        const querySnapshot = await getDocs(taskQuery);

        // Count the tasks
        const pendingTaskCount = querySnapshot.size;

        console.log(`Number of Pending Tasks: ${pendingTaskCount}`);

        // Optionally, update the UI with the count
        const pendingTaskCountElement = document.getElementById("pendingTaskCount");
        if (pendingTaskCountElement) {
            pendingTaskCountElement.textContent = pendingTaskCount;
        }

        return pendingTaskCount;
    } catch (error) {
        console.error("Error counting pending tasks:", error);
        return 0;
    }
}

async function fetchTaskData() {
    try {
        // Create a query to filter documents by loggedInUserId
        const taskQuery = query(
            collection(db, "Task"),
            where("loggedInUserId", "==", loggedInUserId)
        );

        // Query for Recent Tasks (Completed)
        const recentTaskQuery = query(
            collection(db, "Task"),
            where("loggedInUserId", "==", loggedInUserId),
            where("status", "==", "Completed"),
            // orderBy("dateCompleted", "desc"),
            limit(10)
        );

        // Query for Upcoming Tasks (Pending)
        const upcomingTaskQuery = query(
            collection(db, "Task"),
            where("loggedInUserId", "==", loggedInUserId),
            where("status", "==", "Pending"),
            // orderBy("reminderTime", "asc"),
            limit(10)
        );

        // Execute the query
        const querySnapshot = await getDocs(taskQuery);
        const recentTasksSnapshot = await getDocs(recentTaskQuery);
        const upcomingTasksSnapshot = await getDocs(upcomingTaskQuery);

        const dataSet = []; // Array to hold rows of data
        const recentTasks = []; // Array for Recent Tasks
        const upcomingTasks = []; // Array for Upcoming Tasks
        let counter = 1;

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id; // Firestore document ID
                data.docId = docId;
                const reminderDate = checkReminder(data.reminderTime)
                if (reminderDate) {
                    const notificationData = {
                        id: docId,
                        pigID: data.pigID,
                        taskname: data.taskname,
                        reminderTime: data.reminderTime,
                        priorityLevel: data.priority,
                        notes: data.taskNotes,
                        assignedPerson: data.assignedPerson,
                        createdAt: getTodayInISOFormat(new Date()),
                        status: data.status
                    };
                    // Add new notification
                    addNotificationToDatabase(notificationData);
                }

                // Add a row of data to the dataSet array
                dataSet.push([
                    counter++,
                    data.pigID || 'N/A',
                    data.taskname || 'N/A',
                    dateFormatter(data.reminderTime) || 'N/A',
                    setPriorityLevel(data.priority) || 'N/A',
                    data.taskNotes || 'N/A',
                    data.assignedPerson || 'N/A',
                    setTaskStatus(data.status) || 'N/A',
                    data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A',
                    `<div class="dropdown ">
                        <button class="btn btn-outline-dark border-0 bi-pencil-fill" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                        <ul class="dropdown-menu">
                            <li class="${!data.assignedPerson?.includes('Technician') && data.assignedPerson != 'Admin' || data.status === 'Completed' ? 'd-none' : ''}"><button class="dropdown-item btn-completed" type="button" data-bs-toggle="modal" data-bs-target="#" data-id="${docId}">Mark as Completed</button></li>
                            <li class="${data.status === 'Completed' ? 'd-none' : ''}"><button class="dropdown-item btn-edit " type="button" data-bs-toggle="modal" data-bs-target="#pigletTaskModal" data-id="${docId}">Edit</button></li>
                            <li><button class="dropdown-item btn-delete" type="button" data-id="${docId}">Delete</button></li>
                        </ul>
                    </div>`
                ]);
            });
        }

        // Process Recent Tasks
        if (!recentTasksSnapshot.empty) {
            recentTasksSnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;
                recentTasks.push([
                    // data.pigID || 'N/A',
                    data.taskname || 'N/A',
                    data.assignedPerson || 'N/A',
                    dateFormatter(getTodayInISOFormat(data.dateCompleted)) || 'N/A',
                ]);
            });
        }

        // Process Upcoming Tasks
        if (!upcomingTasksSnapshot.empty) {
            upcomingTasksSnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;
                upcomingTasks.push([
                    // data.pigID || 'N/A',
                    data.taskname || 'N/A',
                    data.assignedPerson || 'N/A',
                    dateFormatter(data.reminderTime) || 'N/A',
                ]);
            });
        }

        // Initialize or reinitialize the DataTable
        $('#taskTable').DataTable({
            destroy: true, // Destroy existing table to avoid duplication
            data: dataSet, // Pass the formatted data to DataTable
            columns: [
                { title: 'No.' },
                { title: 'Pig ID' },
                { title: 'Task Name' },
                { title: 'Reminder Time' },
                { title: 'Priority Level' },
                { title: 'Notes' },
                { title: 'Assigned Person' },
                { title: 'Status' },
                { title: 'Created At' },
                { title: 'Action' }
            ],
        });

        // Initialize or reinitialize the DataTable
        $('#upcomingTaskTable').DataTable({
            destroy: true, // Destroy existing table to avoid duplication
            data: upcomingTasks, // Pass the formatted data to DataTable
            searching: false, // Disable search box
            paging: false, // Disable pagination
            ordering: false, // Disable column sorting
            info: false, // Disable table information display (e.g., "Showing 1 to 10 of 50 entries")
            columns: [
                { title: 'Task Name' },
                { title: 'Assigned Person' },
                { title: 'Date' },
            ],
        });

        // Initialize or reinitialize the DataTable
        $('#recentTaskTable').DataTable({
            destroy: true, // Destroy existing table to avoid duplication
            data: recentTasks, // Pass the formatted data to DataTable
            searching: false, // Disable search box
            paging: false, // Disable pagination
            ordering: false, // Disable column sorting
            info: false, // Disable table information display (e.g., "Showing 1 to 10 of 50 entries")
            columns: [
                { title: 'Task Name' },
                { title: 'Assigned Person' },
                { title: 'Date' },
            ],
        });
        countPendingTasks();

    } catch (error) {
        console.error("Error fetching documents:", error);
    }
}

async function staffTask() {
    try {
        // Create a query to filter documents by loggedInUserId
        const feedingQuery = query(
            collection(db, "FeedingSchedule"),
            where("assignedPersonFeeding", "==", username),
        );

        const toDoQuery = query(
            collection(db, "Task"),
            where("assignedPerson", "==", username),
            where("status", "==", 'Pending')
        );

        const completedQuery = query(
            collection(db, "Task"),
            where("assignedPerson", "==", username),
            where("status", "==", 'Completed')
        );

        // Execute the query
        const querySnapshotFeeding = await getDocs(feedingQuery);
        const querySnapshotCompleted = await getDocs(completedQuery);
        const querySnapshotTodo = await getDocs(toDoQuery);
        const accordionFlushToDo = document.getElementById('accordionFlushToDo');
        const accordionFlushCompleted = document.getElementById('accordionFlushCompleted');
        accordionFlushToDo.innerHTML = ""; // Clear existing content (optional)
        accordionFlushCompleted.innerHTML = ""; // Clear existing content (optional)
        let counter = 0;
        let totalCompletedTast = 0;

        if (!querySnapshotCompleted.empty) {
            noCompletedTask.classList.add('d-none');
            querySnapshotCompleted.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id; // Firestore document ID
                totalCompletedTast++;
                const template =
                    `<div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-${docId}" aria-expanded="false" aria-controls="flush-${docId}">
                            <h6>Task Name: ${data.taskname}</h6>
                            <div class="text-muted ms-5">
                            ${setTaskStatus(data.status) || 'N/A'} ${timeAgo(data.dateCompleted) || 'N/A'} </div>
                        </button>
                    </h2>
                    <div id="flush-${docId}" class="accordion-collapse collapse" data-bs-parent="#accordionFlushCompleted">
                        <div class="accordion-body">
                            <p>Pig ID: <b>${data.pigID}</b></p>
                            <p>Date: <b> ${dateFormatter(data.reminderTime) || 'N/A'}</b></p>
                            <p>Priority Level: ${setPriorityLevel(data.priority) || 'N/A'}</p>
                            <p>Notes: ${data.taskNotes}</p>
                        </div>
                    </div>
                </div>`
                // Add the template to the accordion
                accordionFlushCompleted.insertAdjacentHTML("afterbegin", template);
            })

            totalCompletedTastStaff.textContent = totalCompletedTast;
        } else {
            noCompletedTask.classList.add('d-none');
        }

        if (!querySnapshotFeeding.empty) {
            noTask.classList.add('d-none');
            querySnapshotFeeding.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id; // Firestore document ID
                counter++;
                const statusBadge = setStatus(data.dateFrom, data.dateTo);
                const isCompleted = statusBadge.includes('Completed');
                const template =
                    `<div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-${docId}" aria-expanded="false" aria-controls="flush-${docId}">
                            <h6>Feeding Schedule for Pig ID: ${data.pigID}</h6>
                            <div class="text-muted ms-5">${statusBadge || 'N/A'} ${timeAgo(data.createdAt)} </div>
                        </button>
                    </h2>
                    <div id="flush-${docId}" class="accordion-collapse collapse" data-bs-parent="#accordionFlushToDo">
                        <div class="accordion-body">
                            <p>Feed Type: <b>${data.feedingType}</b></p>
                            <p>Frequency: <b>${data.frequency}</b></p>
                            <p>From: <b> ${dateFormatter(data.dateFrom) || 'N/A'}</b></p>
                            <p>To: <b> ${dateFormatter(data.dateTo) || 'N/A'}</b></p>
                            <p>Notes: ${data.feedingNotes}</p>
                        </div>
                    </div>
                </div>`

                if (isCompleted) {
                    accordionFlushCompleted.insertAdjacentHTML("afterbegin", template);
                } else {
                    // Add the template to the accordion
                    accordionFlushToDo.insertAdjacentHTML("afterbegin", template);
                }
            })
        } else {
            noTask.classList.remove('d-none');
        }

        if (!querySnapshotTodo.empty) {
            noTask.classList.add('d-none');
            querySnapshotTodo.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id; // Firestore document ID  
                counter++;
                const template =
                    `<div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-${docId}" aria-expanded="false" aria-controls="flush-${docId}">
                                <h6>Task Name: ${data.taskname}</h6>
                            <div class="text-muted ms-5">
                            ${setTaskStatus(data.status) || 'N/A'} ${timeAgo(data.createdAt)}
                            </div>
                        </button>
                    </h2>
                    <div id="flush-${docId}" class="accordion-collapse collapse" data-bs-parent="#accordionFlushToDo">
                        <div class="accordion-body">
                            <p>Pig ID: <b>${data.pigID || 'N/A'}</b></p>
                            <p>Date: <b> ${dateFormatter(data.reminderTime) || 'N/A'}</b></p>
                            <p>Priority Level: ${setPriorityLevel(data.priority) || 'N/A'}</p>
                            <p>Notes: ${data.taskNotes}</p>
                            <button data-id="${docId}" class="btn btn-success btn-Completed">Mark as Completed</button>
                        </div>
                    </div>
                </div>`
                // Add the template to the accordion
                accordionFlushToDo.insertAdjacentHTML("afterbegin", template);
            })
        } else {
            noTask.classList.remove('d-none');
        }

        totalTaskStaff.textContent = counter;


    } catch (error) {
        console.error("Error fetching documents:", error);
    }
}

async function markAsCompleted(id) {
    if (!confirm('Are you sure you want to Mark as Completed this record?')) return;
    try {
        const taskDocRef = doc(db, "Task", id);
        const pigletDoc = await getDoc(taskDocRef);
        if (pigletDoc.exists()) {
            const data = pigletDoc.data();
            data.status = "Completed";
            data.dateCompleted = new Date();
            await updateDoc(taskDocRef, data);
            showMessage('success', 'Mark as Completed!', 'Task')
            fetchTaskData(); // Refresh the displayed data
        } else {
            console.warn("No such document!");
        }
    } catch (error) {
        console.error("Error updating document:", error);
        alert('An error occurred: ' + error.message);
    }
}

async function viewTask(id) {
    pigletTaskTitle.textContent = 'Edit Task';
    btnSaveChangesPigletTask.classList.remove('d-none');
    btnSavePigletTask.classList.add('d-none');
    try {
        const pigletDocRef = doc(db, "Task", id);
        const pigletDoc = await getDoc(pigletDocRef);
        if (pigletDoc.exists()) {
            const data = pigletDoc.data();
            taskname.value = data.taskname;
            reminderTime.value = data.reminderTime;
            priority.value = data.priority;
            taskNotes.value = data.taskNotes;
            assignedPerson.value = data.assignedPerson,
                taskID.value = id;
        } else {
            console.warn("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

// Function to update a piglet
async function updateTask() {
    try {
        const pigletDocRef = doc(db, "Task", taskID.value);
        await updateDoc(pigletDocRef, getTaskData());
        showMessage('success', 'Task updated successfully', 'Task')
        fetchTaskData(); // Refresh the displayed data
    } catch (error) {
        console.error("Error updating document:", error);
        alert('An error occurred: ' + error.message);
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
        deleteOneRecord("Task", id)
        deleteAllRecords("NotificationData", "id", id);
        showMessage('success', 'Task deleted successfully', 'Task')
        fetchTaskData(); // Refresh the displayed data
    } catch (error) {
        console.error("Error deleting document:", error);
        alert('An error occurred: ' + error.message);
    }
}

// Call the function to fetch and display user-specific data
staffTask();
fetchTaskData();
realTimeData(fetchTaskData);
realTimeData(staffTask);
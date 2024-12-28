import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getFirestore, collection, doc, addDoc, getDoc, writeBatch,
    setDoc, getDocs, query, where, orderBy, limit, updateDoc, deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC11BujhKILU90ANp1z82QeJ5h-FRPzxNk",
    authDomain: "pigkeeper-2722a.firebaseapp.com",
    projectId: "pigkeeper-2722a",
    databaseURL: "https://pigkeeper-2722a-default-rtdb.firebaseio.com/",
    storageBucket: "pigkeeper-2722a.firebasestorage.app",
    messagingSenderId: "401505708424",
    appId: "1:401505708424:web:13b248e9aced1b85b1b23d",
    measurementId: "G-6NBRBZGW29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

async function addNotificationData(data) {
    try {
        const notifIdRef = doc(db, "NotifID", data.id); // Reference to NotifID document
        const notifIdDoc = await getDoc(notifIdRef);

        if (!notifIdDoc.exists()) {
            // If the ID does not exist in NotifID, insert it into NotificationData and NotifID
            await addDoc(collection(db, "NotificationData"), {
                ...data,
                read: false, // Mark as unread by default
                hide: false,
                createdAt: new Date(),
                loggedInUserId, // Associate with the current user
            });

            // Add the ID to NotifID
            await setDoc(notifIdRef, { createdAt: new Date() });

            console.log(`Notification for ID ${data.id} added.`);
        } else {
            console.log(`Notification for ID ${data.id} already exists.`);
        }
    } catch (error) {
        console.error("Error adding notification:", error);
    }
}

async function deleteAllNotifications() {
    try {
        const notificationQuery = query(
            collection(db, "NotificationData"),
            where("loggedInUserId", "==", loggedInUserId) // Optional: filter for the logged-in user
        );

        const querySnapshot = await getDocs(notificationQuery);

        if (!querySnapshot.empty) {
            const batch = writeBatch(db);

            querySnapshot.forEach((doc) => {
                const docRef = doc.ref;
                batch.delete(docRef); // Add delete operation to the batch
            });

            // Commit the batch operation
            await batch.commit();
            console.log("All notifications have been successfully deleted!");
        } else {
            console.log("No notifications to delete.");
        }
    } catch (error) {
        console.error("Error deleting notifications:", error);
    }
}

async function addNotificationToDatabase(data) {
    const userQuery = query(
        collection(db, "NotificationData"),
        where("id", "==", data.id)
    );
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
        // Add new notification
        addNotificationData(data);
    }
}

async function displayFeedingSchedule(pigID) {
    try {
        const FeedingScheduleQuery = query(
            collection(db, "FeedingSchedule"),
            where("loggedInUserId", "==", loggedInUserId),
            where("pigID", "==", pigID)
        );

        const querySnapshot = await getDocs(FeedingScheduleQuery);
        const dataSet = [];

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;

                dataSet.push([
                    data.feedingType || 'N/A',
                    data.frequency || 'N/A',
                    dateFormatter(data.dateFrom) || 'N/A',
                    dateFormatter(data.dateTo) || 'N/A',
                    data.feedingNotes || 'N/A',
                    setStatus(data.dateFrom, data.dateTo),
                    data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A',
                ]);
            });
        }

        return dataSet;

    } catch (error) {
        console.error("Error deleting notifications:", error);
        showMessage('error', error, 'Pigkeeper Updates.');
    }
}

async function displayPigTask(pigID) {
    try {
        const taskQuery = query(
            collection(db, "Task"),
            where("loggedInUserId", "==", loggedInUserId),
            where("pigID", "==", pigID)
        );

        // Execute the query
        const querySnapshot = await getDocs(taskQuery);
        const dataSet = []; // Array to hold rows of data

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id; // Firestore document ID

                // Add a row of data to the dataSet array
                dataSet.push([
                    data.taskname || 'N/A',
                    dateFormatter(data.reminderTime) || 'N/A',
                    data.priority || 'N/A',
                    data.taskNotes || 'N/A',
                    setTaskStatus(data.status) || 'N/A',
                    data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A',
                ]);
            });
        }
        return dataSet;

    } catch (error) {
        console.error("Error deleting notifications:", error);
        alert('error: ' + error + 'Pigkeeper Updates.');
    }
}

async function createRecord(table, data) {
    await addDoc(collection(db, table), data);
}

async function updateRecord(table, target, data) {
    const docRef = doc(db, table, target);
    await updateDoc(docRef, data);
}

async function deleteOneRecord(table, id) {
    const docRef = doc(db, table, id);
    await deleteDoc(docRef);
}

async function deleteAllRecords(table, condition, target) {

    try {
        // Reference the "table" collection
        const collectionRef = collection(db, table);

        // Query notifications where the target matches
        const dataQuery = query(collectionRef, where(condition, "==", target));

        // Get the query snapshot
        const querySnapshot = await getDocs(dataQuery);

        // Loop through each document and delete it
        const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

        // Wait for all deletions to complete
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error deleting notifications:", error);
        showMessage('error', error, 'Pigkeeper Updates.');
    }
}

// Export Firebase app and Firestore instance
export { firebaseConfig, initializeApp, getDatabase, set, ref, onValue, app, getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut, db, collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, updateDoc, deleteDoc, deleteUser, createRecord, updateRecord, addNotificationToDatabase, addNotificationData, deleteAllRecords, deleteOneRecord, displayFeedingSchedule, displayPigTask, deleteAllNotifications };

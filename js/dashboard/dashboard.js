import { app, getAuth, onAuthStateChanged, signOut, db, doc, getDoc } from '../firebaseConfig.js';

const auth = getAuth(app);
auth.languageCode = 'en';

onAuthStateChanged(auth, (user) => {
    if (loggedInUserId) {
        const docRef = doc(db, "Users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    // showMessage('success', 'Account loggined successfully!', 'Pigkeeper');
                    // localStorage.setItem('username', userData.username);
                    document.getElementById("user").innerText = "Hello " + userData.username + "!";
                } else {
                    window.location.href = "../index.php";
                }
            }).catch((error) => {
                alert("Error getting document:", error);
            });
    } else {
        window.location.href = "../index.php";
    }
})

const btnLogout = document.getElementById('btnLogout');
btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to logout?")) {
        signOut(auth)
            .then(() => {
                localStorage.removeItem('loggedInUserId');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                window.location.href = "../index.php";
            })
            .catch((error) => {
                alert(error);
            });
    }
});

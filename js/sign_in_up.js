import { firebaseConfig, initializeApp, getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, db, doc, setDoc, getDoc, query, where, getDocs, collection } from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

/* Log in with Google */
const btn_google = document.querySelector('.btn-google');
btn_google.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user; // The signed-in user

            // Check if the user's document exists in Firestore
            const docRef = doc(db, "Users", user.uid);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        // If the document exists, store the user ID and redirect
                        localStorage.setItem('role', 'admin');
                        localStorage.setItem('loggedInUserId', user.uid);
                        window.location.href = "Pigkeeper.php";
                    } else {
                        // If no document exists, show an alert and redirect
                        alert("No account found with this email. Please register first.");
                        const auth = getAuth();
                        const user = auth.currentUser;

                        if (user) {
                            deleteUser(user)
                                .then(() => {
                                    console.log("User deleted successfully");
                                    // Optionally, remove the user’s data from Firestore
                                })
                                .catch((error) => {
                                    console.error("Error deleting user:", error);
                                });
                        } else {
                            console.error("No authenticated user to delete.");
                        }
                        window.location.href = "../index.php";
                    }
                })
                .catch((error) => {
                    alert("Error getting document:", error);
                });
        })
        .catch((error) => {
            console.error("Sign-in error:", error);
        });
});


/* Sign up */
const btn_sign_up = document.getElementById('btn-sign-up');
btn_sign_up.addEventListener('click', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Input validation
    if (!username || !email || !password) {
        alert("All fields are required.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                loggedInUserId: user.uid,
                role: "admin",
                username: username,
                email: email,
                password: password
            }

            const docRef = doc(db, "Users", user.uid);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        // If the document exists, store the user ID and redirect
                        alert('This email is already registered. Please log in or use a different email.');
                    } else {
                        // If no document exists, show an alert and redirect
                        setDoc(docRef, userData).then(() => {
                            // Optionally, redirect to another page
                            localStorage.setItem('role', 'admin');
                            localStorage.setItem('loggedInUserId', user.uid);
                            window.location.href = "Pigkeeper.php";
                        }).catch((error) => {
                            alert(error);
                        });
                    }
                })
                .catch((error) => {
                    alert("Error getting document:", error);
                });
        })
        .catch((error) => {
            // const errorMessage = error.code;
            const errorMessage = getCustomErrorMessage(error.code);
            alert(errorMessage);
        });

});

/* Sign in */
const btn_sign_in = document.getElementById('btn-sign-in');
btn_sign_in.addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email1').value;
    const password = document.getElementById('password1').value;

    // Input validation
    if (!email || !password) {
        alert("All fields are required.");
        return;
    }

    const userQuery = query(
        collection(db, "Users"),
        where("email", "==", email),
        where("password", "==", password)
    );

    getDocs(userQuery)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('loggedInUserId', doc.id);
                    // Optionally, redirect to another page
                    window.location.href = "Pigkeeper.php";
                });
            } else {
                alert("The email or password is incorrect. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error querying users:", error);
        });
});

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});





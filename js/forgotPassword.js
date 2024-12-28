import { firebaseConfig, initializeApp, getAuth, sendPasswordResetEmail } from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

/* Forgot password */
const forgot_password = document.getElementById('forgot-password');
forgot_password.addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    // Input validation
    if (!email) {
        alert("Please enter your email to reset your password.");
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Password reset email sent successfully!');
            window.location.href = "./index.php";
        })
        .catch((error) => {
            // const errorMessage = error.code;
            const errorMessage = getCustomErrorMessage(error.code);
            alert(errorMessage);
        });
})
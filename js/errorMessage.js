const errorMessages = {
    "auth/email-already-in-use": "This email is already registered. Please log in or use a different email.",
    "auth/invalid-email": "The email address is not valid. Please check and try again.",
    "auth/weak-password": "The password is too weak. It must be at least 6 characters.",
    "auth/user-not-found": "No account found with this email. Please register first.",
    "auth/wrong-password": "The password is incorrect. Please try again.",
    "auth/invalid-credential": "The credential is invalid. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please wait a few minutes before trying again.",
    "auth/operation-not-allowed": "Email/password accounts are not enabled. Please contact support.",
};

function getCustomErrorMessage(errorCode) {
    return errorMessages[errorCode] || "An unexpected error occurred. Please try again.";
}
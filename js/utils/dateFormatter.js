
function dateFormatter(date) {

    if (!date) {
        return 0;
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',  // Full month name
        day: 'numeric', // Numeric day
        year: 'numeric' // Full year
    });

    const dateInWords = formatter.format(new Date(date));
    // console.log(dateInWords); // Output: "December 14, 2024"
    return dateInWords;
}

function timeAgo(timestamp) {

    // Check if the input is a Firestore Timestamp object
    let date;
    if (timestamp.seconds && timestamp.nanoseconds) {
        // Convert Firestore Timestamp to JavaScript Date
        date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else if (timestamp instanceof Date) {
        // If it's already a Date object
        date = timestamp;
    } else {
        // Assume it's a valid date string or timestamp
        date = new Date(timestamp);
    }

    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000); // Difference in seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;

    // Beyond a certain threshold, use "a while ago"
    const years = Math.floor(diff / 31536000); // Convert seconds to years
    if (years > 5) return 'a while ago'; // Customize the threshold as needed
    return `${years}y ago`;
}

// Output: "2024-12-09" (or the current date)
function getTodayInISOFormat() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function convertToISO(dateString) {
    // Example conversion logic for "December 18, 2024 at 1:35:02 PM UTC+8"
    const parts = dateString.split(' at ');
    const datePart = parts[0];
    const timePart = parts[1].replace(' ', '').replace(' UTC', ''); // Remove extra chars
    return new Date(`${datePart} ${timePart}`).toISOString();
}

function timeDifferenceFromDate(startDate) {
    const start = new Date(startDate);
    const today = new Date();

    // Calculate the difference in milliseconds
    const diffInMs = today - start;

    if (diffInMs < 0) {
        return "The start date is in the future.";
    }

    // Convert to days
    const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Calculate months, weeks, and days
    const months = Math.floor(totalDays / 30); // Approximate a month as 30 days
    const remainingDaysAfterMonths = totalDays % 30;
    const weeks = Math.floor(remainingDaysAfterMonths / 7);
    const days = remainingDaysAfterMonths % 7;

    // Build the result string dynamically
    const parts = [];
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(" and ") : "Less than a day.";
}

function calculateTotalDays(dateOfBirth, selectedDate) {
    // Convert inputs to Date objects
    const birthDate = new Date(dateOfBirth);
    const endDate = new Date(selectedDate);

    // Ensure the selected date is after the birth date
    if (endDate < birthDate) {
        showMessage("warning", "Selected date cannot be earlier than the date of birth.", "Piglet Management");
        return;
    }

    // Initialize variables for years, months, weeks, and days
    let years = endDate.getFullYear() - birthDate.getFullYear();
    let months = endDate.getMonth() - birthDate.getMonth();
    let days = endDate.getDate() - birthDate.getDate();

    // Adjust for negative days (e.g., endDate's day < birthDate's day)
    if (days < 0) {
        const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0); // Last day of the previous month
        days += previousMonth.getDate(); // Add the number of days in the previous month
        months--; // Adjust the months
    }

    // Adjust for negative months (e.g., endDate's month < birthDate's month)
    if (months < 0) {
        months += 12;
        years--; // Adjust the years
    }

    // Calculate weeks and remaining days
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    // Dynamically build the result string
    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
    if (remainingDays > 0) parts.push(`${remainingDays} day${remainingDays > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(" and ") : "Less than a day.";
}

function checkReminder(reminderTime) {
    const currentDate = new Date();
    const reminderDate = new Date(reminderTime + "T00:00:00");

    // Calculate the difference between current date and reminder date in milliseconds
    const timeDifference = reminderDate - currentDate;

    // Check if the reminder is within the next 24 hours
    if (timeDifference > 0 && timeDifference <= 24 * 60 * 60 * 1000) {
        return true; // Reminder is within the next 24 hours
    }

    return false; // Reminder is not within the next 24 hours
}




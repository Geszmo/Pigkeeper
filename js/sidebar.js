document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const tabs = document.querySelectorAll("ul li"); // Sidebar tabs
    const pages = document.querySelectorAll(".page-content"); // Page sections
    const menuButton = document.getElementById("menu"); // Sidebar toggle button
    const upcomingTaskButton = document.getElementById("upcomingTask"); // Upcoming task button
    const notificationButton = document.getElementById("btnNotification"); // Notification button
    const taskPage = document.getElementById("taskPage"); // Task page
    const notificationPage = document.getElementById("notificationPage"); // Notification page
    const mainPage = document.getElementById("mainPage"); // Main page
    const sidebar = document.getElementById("sidebar"); // Sidebar container
    const sidebarTexts = document.querySelectorAll(".sidebar-text"); // Sidebar text elements

    // Initialize page navigation
    setupPageNavigation();

    // Function to handle tab clicks
    function setupPageNavigation() {
        tabs.forEach(tab => {
            tab.addEventListener("click", () => handleTabClick(tab));
        });

        // Handle specific button clicks
        upcomingTaskButton.addEventListener("click", () => switchPage(taskPage));
        notificationButton.addEventListener("click", () => switchPage(notificationPage));
        menuButton.addEventListener("click", toggleSidebar);
    }

    // Handle tab click event
    function handleTabClick(tab) {
        // Set active tab
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // Hide all pages and show the current page
        pages.forEach(page => page.classList.add("hidden"));
        const targetPage = document.getElementById(`${tab.id}Page`);
        if (targetPage) {
            mainPage.classList.remove("d-none");
            targetPage.classList.remove("hidden");
        }

        // Toggle sidebar if necessary
        toggleSidebar();
    }

    // Show a specific page and hide the main page
    function switchPage(targetPage) {
        mainPage.classList.add("d-none");
        pages.forEach(page => page.classList.add("hidden")); // Hide all pages
        targetPage.classList.remove("hidden");
    }

    // Toggle the sidebar visibility
    function toggleSidebar() {
        sidebar.classList.toggle("hidden");
        sidebarTexts.forEach(text => text.classList.toggle("hidden"));
    }
});

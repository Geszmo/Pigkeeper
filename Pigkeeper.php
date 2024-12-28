<!DOCTYPE html>
<html lang="en">

<head>
    <?php include('./asset/header.php') ?>
    <link rel="stylesheet" href="./css/style.css">
    <script defer src="https://code.highcharts.com/highcharts.js"></script>
    <script defer src="https://code.highcharts.com/highcharts-more.js"></script>
    <script defer src="https://code.highcharts.com/modules/solid-gauge.js"></script>
    <script defer src="./js/sidebar.js"></script>
    <script defer src="./js/errorMessage.js"></script>
    <script defer src="./js/utils/showMessage.js"></script>
    <script defer src="./js/utils/dateFormatter.js"></script>
    <script defer src="./js/utils/globalVarialble.js"></script>
    <script defer src="./js/analytics/analytics.js" type="module"></script>
    <script defer src="./js/deviceStatus/deviceStatus.js" type="module"></script>
    <script defer src="./js/notification/notification.js" type="module"></script>
    <script defer src="./js/dashboard/dashboard.js" type="module"></script>
    <script defer src="./js/task/task.js" type="module"></script>
    <script defer src="./js/feedingSchedule/feedingSchedule.js" type="module"></script>
    <script defer src="./js/expenseIncome/expenseIncome.js" type="module"></script>
    <script defer src="./js/pigManagement/piglets.js" type="module"></script>
    <script defer src="./js/pigManagement/pigsow.js" type="module"></script>
    <script defer src="./js/settings/staff.js" type="module"></script>
    <script defer src="./js/settings/technician.js" type="module"></script>
    <script defer src="./js/settings/profile.js" type="module"></script>
    <script defer src="./js/chart.js" type="module"></script>
    <title>Pigkeeper</title>
</head>

<body>
    <div class="container-fluid d-flex vh-100 p-0 ">
        <div id="sidebar" class="position-relative overflow-hidden">
            <!-- Sidebar content here -->
            <?php include('./asset/sidebar.php') ?>
        </div>
        <div id="main" class="bg-light overflow-scroll">
            <!-- Main content here -->
            <div class="bg-body shadow-sm d-flex justify-content-between sticky-top align-items-center p-3">
                <div class="flex-row">
                    <h5 class="ps-2">
                        <span id="menu" class="btn btn-outline-light text-dark border-0 bi bi-list fs-3 me-2"></span>
                        <span id="user" class="text-capitalize">Hello Admin!</span>
                    </h5>
                </div>
                <div class="d-flex gap-3 me-4" id="topButtons">
                    <div>
                        <button type="button" id="upcomingTask"
                            class="btn btn-outline-light text-dark border-0 bi-list-task position-relative">
                            Task
                            <span
                                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                <span id="pendingTaskCount">0</span>
                                <span class="visually-hidden">unread messages</span>
                            </span>
                        </button>
                    </div>
                    <div>
                        <button type="button" id="btnNotification"
                            class="btn btn-outline-light text-dark border-0 bi-bell-fill position-relative">
                            <span
                                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ">
                                <span id="notificationNumber">0</span>
                                <span class="visually-hidden">unread messages</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <div id="toDoPage" class="page-content hidden">
                    <?php include('./pigkeeper/toDoList.php') ?>
                </div>
                <div id="completedPage" class="page-content hidden">
                    <?php include('./pigkeeper/completed.php') ?>
                </div>
                <div id="mainPage">
                    <div id="dashboardPage" class="page-content">
                        <?php include('./pigkeeper/dashboard.php') ?>
                    </div>
                    <div id="analyticsPage" class="page-content hidden">
                        <?php include('./pigkeeper/analytics.php') ?>
                    </div>
                    <div id="feedingPage" class="page-content hidden">
                        <?php include('./pigkeeper/feeding_schedule.php') ?>
                    </div>
                    <div id="pigManagementPage" class="page-content hidden">
                        <?php include('./pigkeeper/pig_management.php') ?>
                    </div>
                    <div id="expenseIncomePage" class="page-content hidden">
                        <?php include('./pigkeeper/expenseIncome.php') ?>
                    </div>
                    <div id="settingsPage" class="page-content hidden">
                        <?php include('./pigkeeper/settings.php') ?>
                    </div>
                    <div id="faqPage" class="page-content hidden">
                        <?php include('./pigkeeper/faq.php') ?>
                    </div>
                    <div id="aboutPage" class="page-content hidden">
                        <?php include('./pigkeeper/aboutUs.php') ?>
                    </div>
                </div>
                <div id="spicificPage">
                    <div id="taskPage" class="page-content hidden">
                        <?php include('./pigkeeper/task.php') ?>
                    </div>
                    <div id="notificationPage" class="page-content hidden">
                        <?php include('./pigkeeper/notification.php') ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php include('./pigkeeper/modal/pigletsTask.php') ?>
    <?php include('./pigkeeper/modal/feedingSchedModal.php') ?>
    <?php include('./pigkeeper/modal/addItem.php') ?>
</body>

</html>
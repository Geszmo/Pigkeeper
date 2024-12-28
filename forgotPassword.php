<!doctype html>
<html lang="en">

<head>
    <?php include('asset/header.php') ?>
    <title>Forgot Password</title>
    <script defer src="../js/errorMessage.js"></script>
    <script defer src="./js/forgotPassword.js" type="module"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #1E1E1E;
            height: 100vh;
            background: #FDFDFD;
            background-image: url('images/bg5.svg');
            background-repeat: no-repeat;
            background-position: bottom center;
            background-size: contain;
            /* Keeps the image at the bottom without covering the entire page */
        }
    </style>
</head>

<body>
    <nav class="navbar bg-body shadow-sm fixed-top">
        <div class="container">
            <a class="navbar-brand fw-medium"><b>PIGKEEPER</b></a>
        </div>
    </nav>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <form action="#" class="card p-4" style="width: 400px;">
            <h3 class="fw-bold">Forgot your password?</h3>
            <p>Don't worry, it happens to all of us.</p>
            <div class="mt-3 text-center">
                <div class="input-group flex-nowrap mb-3">
                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                    <input type="email" id="email" class="form-control" placeholder="Email" aria-label="Email"
                        aria-describedby="username">
                </div>
                <p>We will send a recovery link to this email</p>
                <button id="forgot-password" type="button" class="btn w-100 py-2 mb-3 fw-semibold text-white"
                    style="background-color: #C74851">Send
                    recovery Link</button>
                <a href="index.php" class="text-decoration-none text-dark">Back to Login</a>
            </div>
        </form>
    </div>
</body>

</html>
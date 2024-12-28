<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="./css/sign_in_up.css" />
    <script defer src="./js/sign_in_up.js" type="module"></script>
    <script defer src="./js/errorMessage.js"></script>
    <title>Pigkeeper</title>
</head>

<body>
    <div class="container">
        <div class="forms-container">
            <div class="signin-signup">
                <form action="#" class="sign-in-form">
                    <h2 class="title">Log in</h2>
                    <div class="input-field">
                        <i class="bi bi-person-fill"></i>
                        <input type="text" id="email1" placeholder="Email" />
                    </div>
                    <div class="input-field">
                        <i class="bi bi-lock-fill"></i>
                        <input type="password" id="password1" placeholder="Password" />
                    </div>
                    <a href="forgotPassword.php" id="forgot-pass">Forgot password?</a>
                    <input type="submit" id="btn-sign-in" value="Login" class="btn solid" />
                    <p class="social-text">Or Sign in with Google</p>
                    <div class="social-media">
                        <a class="btn-google social-icon">
                            <i class="bi bi-google"></i>
                        </a>
                    </div>
                </form>
                <form action="#" class="sign-up-form">
                    <h2 class="title">Sign up</h2>
                    <div class="input-field">
                        <i class="bi bi-person-fill"></i>
                        <input type="text" id="username" placeholder="Username" />
                    </div>
                    <div class="input-field">
                        <i class="bi bi-envelope-at-fill"></i>
                        <input type="email" id="email" placeholder="Email" />
                    </div>
                    <div class="input-field">
                        <i class="bi bi-lock-fill"></i>
                        <input type="password" id="password" placeholder="Password" />
                    </div>
                    <input type="submit" id="btn-sign-up" class="btn" value="Sign up" />
                    <!-- <p class="social-text">Or Sign up with Google</p>
                    <div class="social-media">
                        <a class="btn-google social-icon">
                            <i class="bi bi-google"></i>
                        </a>
                    </div> -->
                </form>
            </div>
        </div>

        <div class="panels-container">
            <div class="panel left-panel">
                <div class="content">
                    <h3>Welcome back to Pigkeeper!</h3>
                    <p>The place where you can keep track of your pigs</p>
                    <p>Don't have an account?</p>
                    <button class="btn transparent" id="sign-up-btn">
                        Sign up
                    </button>
                </div>
                <img src="./images/pigkeeper.svg" class="image" alt="" />
            </div>
            <div class="panel right-panel">
                <div class="content">
                    <h3>Unlock all the benefits of PigKeeper</h3>
                    <p>
                        Create your account to unlock exclusive features and start saving smarter.
                    </p>
                    <p>Already have an account?</p>
                    <button class="btn transparent" id="sign-in-btn">
                        Log in
                    </button>
                </div>
                <img src="./images/pigkeeper.svg" class="image" alt="" />
            </div>
        </div>
    </div>
</body>

</html>
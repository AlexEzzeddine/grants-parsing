$(document).ready(function () {
    var email = document.getElementById("registration-username");
    var password = document.getElementById("registration-password");
    var confirm_password = document.getElementById("registration-password-confirm");
    var submit_btn = document.getElementById("btn-registration");
    var badPassError = document.getElementById("pass-not-match-error");
    var emptyFieldError = document.getElementById("empty-field-error");

    var isEmailFieldValid = false;
    var isPasswordFieldValid = false;

    function validateEmail() {
        if (email.value === null || email.value === "" || email.value.indexOf(' ') >= 0) {
            emptyFieldError.style.display = 'block';
            isEmailFieldValid = false;
        } else {
            emptyFieldError.style.display = 'none';
            isEmailFieldValid = true;
        }
    }

    function validatePassword() {
        if (password.value === null || password.value === "" || password.value.indexOf(' ') >= 0) {
            emptyFieldError.style.display = 'block';
            isPasswordFieldValid = false;
        } else {
            emptyFieldError.style.display = 'none';
            if (password.value !== confirm_password.value) {
                badPassError.style.display = 'block';
                isPasswordFieldValid = false;
            } else {
                isPasswordFieldValid = true;
                badPassError.style.display = 'none'
            }
        }
    }

    function submit() {
        if (isEmailFieldValid === true && isPasswordFieldValid === true) {
            $.ajax({
                "url": host + "/registration",
                "method": "POST",
                "data": {
                    "email": email.value,
                    "password": password.value
                },
                error: function (xhr) {
                    $("#user-exist-error").hide();
                    if (xhr.responseText === "User with this email already exists") {
                        $("#user-exist-error").show();
                    }
                },
                success: function (data) {
                    window.location.href = "./index.html";
                }
            });
        }
        return false;
    }

    submit_btn.onclick = submit;
    email.onkeyup = validateEmail;
    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;
});
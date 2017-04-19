$(document).ready(function () {
    var email = document.getElementById("registration-username");
    var password = document.getElementById("registration-password");
    var confirm_password = document.getElementById("registration-password-confirm");
    var submit_btn = document.getElementById("btn-registration");
    var badPassError = document.getElementById("pass-not-match-error");


    var isValid = false;

    function validatePassword() {
        if (password.value !== confirm_password.value) {
            badPassError.style.display = 'block'
            isValid = false;
        } else {
            isValid = true;
            badPassError.style.display = 'none'
        }
    }

    function submit() {
        if (isValid === true){
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
    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;
});
function validateForm() {
    var email = document.loginform.email.value;
    var password = document.loginform.password.value;

    $.ajax({
        "url": host + "/login",
        "method": "POST",
        "data": {
            "email": email,
            "password": password
        },
        error: function(xhr){
            $("#user-not-found").hide();
            $("#bad-password").hide();
            if(xhr.responseText === "User not found") {
                $("#user-not-found").show();
            }
            if(xhr.responseText === "Bad password"){
                $("#bad-password").show();
            }
            localStorage.setItem("auth", false);
        },
        success: function(data){
            localStorage.setItem("auth", data.api_key);
            window.location.href = "./index.html";
        }
    });
  }
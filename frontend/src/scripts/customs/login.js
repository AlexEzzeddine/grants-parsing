function validateForm() {
    var email = document.loginform.email.value;
    var pw = document.loginform.password.value;

    $.ajax({
        "url": host + "/login",
        "method": "POST",
        "data": {
            "email": email,
            "pw": pw
        },
        success: function(data){
             $(document).ready(function(){
                 $("#user-not-found").hide();
                 $("#bad-password").hide();

                 if(data === "User not found") {
                     $("#user-not-found").show();
                     localStorage.setItem("auth", false);
                     return false;
                 }
                 if(data === "Bad password"){
                     $("#bad-password").show();
                     localStorage.setItem("auth", false);
                     return false;
                 }
             });

             if (data !== "User not found" && data !== "Bad password") {
                console.log("going to index")
                localStorage.setItem("auth", true);
                window.location.href = "./index.html";
             }
        }
    });
  }
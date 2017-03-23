/**
 * Created by AMaslii on 22.03.2017.
 */
host="http://127.0.0.1:5000"
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
                     return false;
                 }
                 if(data === "Bad password"){
                     $("#bad-password").show();
                     return false;
                 }
             });

             if (data !== "User not found" && data !== "Bad password") {
                 window.location.href = "/index.html";
             }
        }
    });
  }
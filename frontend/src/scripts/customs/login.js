/**
 * Created by AMaslii on 22.03.2017.
 */
host="https://shielded-fortress-95039.herokuapp.com"
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
                     document.cookie="";
                     return false;
                 }
                 if(data === "Bad password"){
                     $("#bad-password").show();
                      document.cookie="";
                     return false;
                 }
             });

             if (data !== "User not found" && data !== "Bad password") {
                document.cookie="auth=Ok";
                window.location.href = "./index.html";
             }
        }
    });
  }
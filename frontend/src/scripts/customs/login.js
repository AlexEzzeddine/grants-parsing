/**
 * Created by AMaslii on 22.03.2017.
 */
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
                 if(data === "User not found") {
                     console.log("user!!!");
                     $(".user-not-found").show();
                 }});
            //window.location.href = "../dist/index.html";
        }
    });
  }
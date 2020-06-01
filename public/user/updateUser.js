//Ajax call for getting the username
$.get("/updateUserData").done(data => {
    $("#username").val(data.response.username);
    $("#email").val(data.response.email);
    $("#password").val(data.response.password);
});
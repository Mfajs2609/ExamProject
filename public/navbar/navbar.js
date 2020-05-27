$.get("/getUsername").done(data => {
    $("#username").text(data.response.username)
});

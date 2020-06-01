$.get("/getUsername").done(data => {
    console.log("JQUERY", data.response);
    $("#username").text(data.response.username)
});

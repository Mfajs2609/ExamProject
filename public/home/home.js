$.get("/rooms").done(data => {
    for(let i = 0; i < data.response.rooms.length; i++){
        $("#rooms").prepend(
            "<form action=\"/room/" + data.response.rooms[i].roomId + "\" method=\"GET\"> <p>" + "Topic: " + data.response.rooms[i].topic + 
            ", Description: " + data.response.rooms[i].description + "</p>  <input class=\"btn btn-primary\" value=\"Enter room\" type=\"submit\"> </form> <br>");
    }
    //Sockets defined on path variable id in URL
});
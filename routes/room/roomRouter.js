const router = require("express").Router();
const Room = require("../../models/Room.js");
const fs = require("fs");
const session = require("express-session");

//GET methods
router.get("/rooms", async (req, res) => {
    if (req.session.login) {
        const rooms = await Room.query().select();
        return res.send({ response: {
            rooms
        }});
    }
});

router.get("/createRoom", (req, res) => {
    if (req.session.login) {
        const navbar = fs.readFileSync("./public/navbar/navbar.html", "utf8");
        const page = fs.readFileSync("./public/room/createRoom.html", "utf8");
        const footer = fs.readFileSync("./public/footer/footer.html", "utf8");
        return res.send(navbar + page + footer);
    } else {
        return res.redirect("/login");
    }
});

router.get("/getRoomId", async (req, res) => {
    if (req.session.login) {

        console.log("erwer:" + req.session.room)
        const getRoomId = await Room.query().select("roomId").where("roomId", req.session.room);
        console.log("testy" + getRoomId[0]);
        
        return res.send( { response: getRoomId });
    } else {
        return res.redirect("/login");
    }
});

router.get("/room/:id", (req, res) => {
    req.session.room = req.params.id;
    console.log("2   "+req.params.id)
    console.log("1   " + req.session.room)
    if (req.session.login) {       
    
        const navbar = fs.readFileSync("./public/navbar/navbar.html", "utf8");
        const page = fs.readFileSync("./public/room/chatRoom.html", "utf8");
        const footer = fs.readFileSync("./public/footer/footer.html", "utf8");

        return res.send(navbar + page + footer);
    } else {
        return res.redirect("/login");
    }
});

//POST methods
router.post("/createRoom", (req, res) => {
    const { topic, description } = req.body;
    const userId = req.session.userId;

    if (topic && description) {
        try {
            Room.query().insert({
                userId,
                topic,
                description
            }).then(createdRoom => {
                return res.redirect("/home");
            });   
        } catch (error) {
            return res.status(500).send({ response: "Something went wrong with the DB" });  
        }
    }
});

module.exports = router;
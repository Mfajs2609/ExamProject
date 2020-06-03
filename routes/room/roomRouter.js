const router = require("express").Router();
const Room = require("../../models/Room.js");
const fs = require("fs");

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
        return res.send(navbar + page);
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
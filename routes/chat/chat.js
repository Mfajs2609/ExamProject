const router = require('express').Router();
const User = require('../../models/User.js');
const fs = require('fs');

router.get('/chat', (req, res) => {
    if (req.session.login){
    //const navbar = fs.readFileSync("./public/navbar/navbar.html", "utf8");
    const chatPage = fs.readFileSync("./public/chat/chat.html", "utf8");
    return res.send(/*navbar +*/ chatPage);
    }
    else {
        return res.redirect("/login")
    }
});


module.exports = router;
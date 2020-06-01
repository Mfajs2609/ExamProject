const router = require('express').Router();

const fs = require('fs');

router.get('/discussion', (req, res) => {
    if (req.session.login){
    const navbar = fs.readFileSync("./public/navbar/navbar.html", "utf8");
    const disPage = fs.readFileSync("./public/discussion/discussion.html", "utf8");
    return res.send(navbar + disPage);
    }
    else {
        return res.redirect("/login")
    }
});


module.exports = router;
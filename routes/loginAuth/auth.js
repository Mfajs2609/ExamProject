const router = require('express').Router();
const User = require('../../models/User.js');
const fs = require('fs');



//GET methods for login
router.get('/login', (req, res) => {
    const loginPage = fs.readFileSync("./public/login/login.html", "utf8");
    return res.send(loginPage);
});

router.get('/', (req, res) => {
    const loginPage = fs.readFileSync("./public/login/login.html", "utf8");
    return res.send(loginPage);
});

module.exports = router;
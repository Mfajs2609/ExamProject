const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 12;
const User = require('../../models/User.js');
const fs = require('fs');

//GET method for create user
router.get('/createuser', (req, res) => {
    const createPage = fs.readFileSync("./public/createuser/createuser.html", "utf8");
    return res.send(createPage);
});

router.get('/getUsername', (req, res) => {
    return res.send({ response: req.session});
});

//Signup with password encryptet
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (username && password) {
        // password validation
        if (password.length < 8) {
            return res.status(400).send({ response: "Password must be 8 characters or longer" });
        } else {
            try {
                User.query().select('username').where('username', username).then(foundUser => {
                    if (foundUser.length > 0) {
                        return res.status(400).send({ response: "User already exists" });
                    } else {
                        bcrypt.hash(password, saltRounds).then(hashedPassword => {
                            User.query().insert({
                                username,
                                email,
                                password: hashedPassword
                            }).then(createdUser => {
                                return res.redirect('/login')
                            });
                        });
                    }

                });
            } catch (error) {
                return res.status(500).send({ response: "Something went wrong with the DB" });
            }
        }
    } else {
        return res.status(400).send({ response: "username or password missing" });
    }
});



module.exports = router;
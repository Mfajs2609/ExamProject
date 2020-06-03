const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const User = require("../../models/User.js");
const fs = require("fs");

//GET methods
router.get("/createUser", (req, res) => {
    const createPage = fs.readFileSync("./public/user/createUser.html", "utf8");
    return res.send(createPage);
});

router.get("/getUsername", (req, res) => {
    if (req.session.login) {
        return res.send({ response: req.session });
    } else {
        return res.redirect("/login");
    }
});

//POST methods
router.post("/signup", (req, res) => { //Signup with password encryptet
    const { username, email, password } = req.body;

    if (username && password) {
        if (password.length < 8) { //Password validation
            return res.status(400).send({ response: "Password must be 8 characters or longer" });
        } else {
            try {
                User.query().select("username").where("username", username).then(foundUser => {
                    if (foundUser.length > 0) {
                        return res.status(403).send({ response: "User already exists" });
                    } else {
                        bcrypt.hash(password, saltRounds).then(hashedPassword => {
                            User.query().insert({
                                username,
                                email,
                                password : hashedPassword
                            }).then(createdUser => {
                                return res.redirect("/login");
                            });
                        });
                    }
                });
            } catch (error) {
                return res.status(500).send({ response: "Something went wrong with the DB" });
            }
        }
    } else {
        return res.status(400).send({ response: "Username or password missing" });
    }
});

router.get("/updateUser", async (req, res) => {
    if (req.session.login) {
        const head = fs.readFileSync("./public/navbar/navbar.html", "utf8");
        const page = fs.readFileSync("./public/user/updateUser.html", "utf8");
        return res.send(head + page);
    } else {
        return res.redirect("/login");
    }
});

router.get("/updateUserData", async (req, res) => {
    if (req.session.login) {
        const accountInfo = await User.query().select("username", "email").where("id", req.session.userId);
        const username = accountInfo[0].username;
        const email = accountInfo[0].email;
        return res.send({ response: {
            username: username,
            email: email
        }});
    } else {
        return res.redirect("/login");
    }
});


//POST methods
router.post("/updateUser", async (req, res) => {
    const { newPassword,
            currentPassword,
            email,
            username } = req.body;

    try { 
        if (username && email && currentPassword && newPassword) {
            //Password validation
            const updateValidation = await User.query().select("id", "username", "email", "password").where("id", req.session.userId);

            if (updateValidation.length === 1) {              
                bcrypt.compare(currentPassword, updateValidation[0].password).then(compare => { 
                    if (compare === true) {
                        bcrypt.hash(newPassword, saltRounds).then(hashedPassword => {
                            User.query().where("id", req.session.userId).update({
                                username: req.body.username,
                                password: hashedPassword,
                                email: req.body.email
                            }).then(updatedUser => {
                                req.session.username = username;
                                req.session.email = email;
                                return res.redirect("/updateUser");
                            })
                        });
                    }
                });
            } else {
                return res.redirect("/updateUser");
            }           
        } else {
            return res.redirect("/updateUser");
        }
    } catch (error) { 
        console.log(error);
    }
});

module.exports = router;
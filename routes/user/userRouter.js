const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 12;
const User = require('../../models/User.js');
const fs = require('fs');

//GET method for create user
router.get('/createuser', (req, res) => {
    const createPage = fs.readFileSync("./public/user/createuser.html", "utf8");
    return res.send(createPage);
});

router.get('/getUsername', (req, res) => {
    if (req.session.login){
    return res.send({ response: req.session});
    } else {
        res.redirect("/login")
    }

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
                                password : hashedPassword
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

router.get("/updateUser", async (req, res) => {
    if(req.session.login){
            const head = fs.readFileSync("./public/navbar/navbar.html", "utf8");
            const page = fs.readFileSync("./public/user/updateUser.html", "utf8");
        return res.send(head + page);
    } else {
        return res.redirect("/login");
    }
});


router.get("/updateUserData", async (req, res) => {
    if(req.session.login){
            const accountInfo = await User.query().select("username", "password", "email").where("id", req.session.userId);
            const username = accountInfo[0].username;
            const password = accountInfo[0].password;
            const email = accountInfo[0].email;

            console.log("USERNAME", username);
            console.log("PASSWORD", password);
            console.log("EMAIL", email);

            return res.send({ response: {
                username: username,
                password: password,
                email: email
                }});
    } else {
        return res.redirect("/login");
    }
});


//PUT METHODS
//Validation
router.post("/updateUser", async (req, res) => {
    const { password,
            confirmPassword,
            email,
            username } = req.body;
    
    console.log("step 1");

    try{

        // if (password && confirmPassword &&  email && username) {

        //     const CapLetterRegex = /[A-Z]+/g
        //     const NumbersRegex = /[0-9]/g
        //     const EmailRegex = /[@]+/g
        //     const wordRegex = /\w+/g

        //     if (password && confirmPassword) {

        //         if (password.length < 8) {
        //             return res.status(400).send({ response: "Password must be 8 characters or longer"});
        //         }

        //         if (CapLetterRegex.test(password) == false){
        //             return res.status(400).send({ response: "Password should contain minimum one capital letter"});
        //         }

        //         if (NumbersRegex.test(password) == false) {
        //             return res.status(400).send({ response: "Password should contain minimum one digit"});
        //         }

        //         if (email) {
        //             if (!email.match(EmailRegex)) {
        //                 return res.status(400).send({ response: "Email skal indeholde @"});
        //             }
        //         }

        //         if(username) {
            
        //             if(!username.match(wordRegex)) {
        //                 return res.status(400).send({ response: "Cannot be null"});
        //             }
        //         }
        //     }
        // }
        


        if(username && email && confirmPassword && password) {
            console.log("step 2");

            //Password validation
            const updateValidation = await User.query().select('id', 'username', 'email', 'password').where('id', req.session.userId);

            console.log("updateValidation", updateValidation);

            console.log("step 3");

            if(updateValidation.length === 1) {
                console("step 41");
                bcrypt.compare(confirmPassword, updateValidation[0].password).then(compare => { 

                    if(compare === true) {
                        console.log("step 4");
                        User.query().where('id', req.session.userId).update({
                            username: req.body.username,
                            password: req.body.password,
                            email: req.body.email
                        }).then(createdUser => {
                            console.log("step 5");
                            return res.redirect("/updateUser");
                        })
                    }
                });
            }           
        }
    } catch {
    }
    
    // console.log(req.body);
});



module.exports = router;
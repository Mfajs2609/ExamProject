const router = require('express').Router();
const User = require('../../models/User.js');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const session = require('express-session');



//GET methods for login
router.get('/login', (req, res) => {
    const loginPage = fs.readFileSync("./public/login/login.html", "utf8");
    return res.send(loginPage);
});

router.get('/', (req, res) => {
    const loginPage = fs.readFileSync("./public/login/login.html", "utf8");
    return res.send(loginPage);
});

router.get('/home', (req, res) => {
    if (req.session.login) {
        const navbar = fs.readFileSync("./public/navbar/navbar.html", "utf8");
        const homePage = fs.readFileSync("./public/home/home.html", "utf8");
        return res.send(navbar + homePage);
    } else {
        return res.redirect('/login');
    }
})

router.post('/home', async (req, res) => {
    const { username, password } = req.body;
    try {

        if(username && password){
            const passwordValidation = await User.query().select('username', 'email', 'password').where('username', username);

            console.log("test", passwordValidation[0].password)

            bcrypt.compare(password, passwordValidation[0].password).then(result => console.log(result));

            if(passwordValidation.length !== 1) {
                return res.redirect('login');
            }

            if(passwordValidation.length === 1) {
                bcrypt.compare(password, passwordValidation[0].password).then(compare => {
                    if(compare === true) {
                        console.log("test222")
                        req.session.login = true;
                        req.session.username = username;
                        req.session.email = passwordValidation[0].email;
                        return res.redirect('/home');
                        
                    } else {
                        return res.redirect('/login');
                    }
                });
            }
        }
    } catch (error) {

    }

});


/*
//POST method for home. 
router.post('/home', async (req, res) => {

    //variable for the form data.
    const { username, password } = req.body;
    try {
        //Selecting username, email and password Where username in the database matches username from the form.
        const infoCheck = await User.query().select('username', 'email', 'password').where('username', username);

        //Checking if the query found any matches, if not redirect login. 
        if (infoCheck.length !== 1) {
            return res.redirect("/login");
        }

        //If match, Check that password from the form matches the password from the database.
        if (infoCheck.length === 1){
            //if true.
            if (password === infoCheck[0].password){
                //using the middleware express-session, this will give the user access to the other pages.
                req.session.login = true;
                req.session.username = username;
                req.session.email = infoCheck[0].email;
                return res.redirect("/home");
            } else {
                //if false, redirect to login.
                return res.redirect("/login")
            }
        }

    } catch(error){
        return res.status(500).send({ response: "Something went wrong with the DB" });
    }
});
*/
//POST method for logout
router.post('/logout', (req, res) => {
    //Again using the middleware express-session.
    //This will make sure that when the user logout, they have to login again before accessing the unauthorized pages.
    req.session.login = undefined;
    req.session.username = undefined;
    req.session.email = undefined;
    return res.redirect("/login");
});


module.exports = router;
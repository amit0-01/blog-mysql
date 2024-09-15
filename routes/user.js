const express = require('express');
const{ signup, signin }= require('../controllers/user.controller');

const router = express.Router();

// GET SignIn and SignUp Pages
// router.get("/signin", function (req, res) {
//     return res.render("signin");
// });

// router.get("/signup", function (req, res) {
//     return res.render("signup");
// });

// POST Signup (Create New User)
router.post("/signup",signup);

// POST SignIn (Authenticate User)
router.post("/signin", signin );

// GET Logout (Clear the token)
// router.get("/logout", function (req, res) {
//     res.clearCookie("token").redirect("/");
// });

module.exports = router;

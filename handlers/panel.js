const express = require("express");
const app = express();
const passport = require("passport");
const { query } = require("../objects/db")

async function getUByID(id) {
    return await query("SELECT * FROM users WHERE id = ?", id)
}
app.get("/panel", (req, res) => {
    if (!req.isAuthenticated()) {
        res.end("<html><body>You aren't logged in, therefore you dont have a panel, maybe <a href='/login'>login?</a>")
        return
    }
    getUByID(req.user).then(user => {
        res.render("panel", {
            url: req.headers.host,
            username: user[0].username,
            token: user[0].token,
            username: user[0].username,
            loggedIn: req.isAuthenticated()
        })
    })

})

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});

module.exports = app;

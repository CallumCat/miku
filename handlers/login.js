const express = require("express");
const app = express();
const md5 = require("md5");
const passport = require("passport");
const { query } = require("../objects/db")

app.get("/login", (req, res) => {
    res.render("login", {
        url: req.headers.host,
        loggedIn: req.isAuthenticated(),
        username: ""
    });
});

async function loginChecker(username, password) {
    const q = await query("SELECT * FROM users WHERE username = ? AND password = ?", username, password);
    return q;
}

app.post("/login", (req, res) => {
    const data = req.body;
    const username = data.username;
    const password = md5(data.password);
    loginChecker(username, password).then(user => {
        if (user.length > 0) {
            var u = user[0]
            if (u.token === "revoked") {
                res.end("<html><body>You are banned. Reason: " + u.ban_reason);
            }
            req.login(u, function(err) { 
                if (err) throw (err);
                res.redirect("/panel")
            })
        } else {
            res.end("Sorry, your username or password was incorrect.")
        }
    })
});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});
module.exports = app;
const express = require("express");
const app = express();
const md5 = require("md5");
const passport = require("passport");
const { query } = require("../objects/db")
const config = require("../config.json")

function generate() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

app.get("/admin", (req, res) => {
    if (req.user === 1) {
        getUByID(req.user).then(user => {
            if (req.user) {
                res.render("admin", {
                    url: req.headers.host,
                    apiKey: config.server.privateapikey,
                    loggedIn: req.isAuthenticated(),
                    username: user[0].username
                });
            } else {
                res.render("index", {
                    url: req.headers.host,
                    apiKey: config.server.privateapikey,
                    loggedIn: req.isAuthenticated(),
                    username: user[0].username
                });
            }
        })
    } else {
        res.end("You aren't the administrator, you aren't allowed to see this page.")
    }
})

async function generateKeys(a) {
    for (let i = 1; i <= a; i++) {
        var token = generate();
        await query("INSERT INTO tokens(token) VALUES (?)", token);
    }
}

app.post("/generate", (req, res) => {
    const amount = req.body.amount;
    generateKeys(amount).then(xd => {
        res.end("<html><body>Keys generated. <a href='/admin'>Go back.</a>")
    })
});

async function ban(u, r) {
    const token = await query("SELECT * FROM users WHERE username = ?", u);
    await query("UPDATE users SET token_old = ? WHERE username = ?", token[0].token, u)
    await query("UPDATE users SET token = 'revoked' WHERE username = ?", u)
    await query("UPDATE users SET ban_reason = ? WHERE username = ?", r, u)
}
async function unban(u) {
    const token = await query("SELECT * FROM users WHERE username = ?", u);
    await query("UPDATE users SET token = ? WHERE username = ?", token[0].token_old, u)
    await query("UPDATE users SET ban_reason = '' WHERE username = ?", u)
}

app.post("/ban", (req, res) => {
    const user = req.body.user;
    const reason = req.body.reason;

    ban(user, reason).then(xd => {
        res.end("<html><body>User account banned. <a href='/admin'>Go back.</a>")
    })
});
app.post("/unban", (req, res) => {
    const user = req.body.user;

    unban(user).then(xd => {
        res.end("<html><body>User account unbanned. <a href='/admin'>Go back.</a>")
    })
});
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});

module.exports = app;
const express = require("express");
const app = express();
const { query } = require("../objects/db");

async function usersStuff(i) {
    const q = await query("SELECT * FROM users WHERE id = ?", i)
    return q
}

app.get("/", (req, res) => {
    usersStuff(req.user).then(q => {
        console.log(q)
        if (req.user) {
            res.render("index", {
                url: req.headers.host,
                loggedIn: req.isAuthenticated(),
                username: q[0].username
            });
        } else {
            res.render("index", {
                url: req.headers.host,
                loggedIn: req.isAuthenticated(),
                username: "" 
            });
        }
    })
})

module.exports = app;
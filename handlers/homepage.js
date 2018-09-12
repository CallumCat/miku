const express = require("express");
const app = express();
const { query } = require("../objects/db");

async function usersStuff() {
    const q = await query("SELECT * FROM users")
    return q
}

app.get("/", (req, res) => {
    usersStuff().then(q => {
        console.log(q[req.user])
        if (req.user) {
            res.render("index", {
                url: req.headers.host,
                loggedIn: req.isAuthenticated(),
                username: q[req.user].username
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
const express = require("express");
const app = express();
const { query } = require("../objects/db");

async function getUByID(id) {
    return await query("SELECT * FROM users WHERE id = ?", id)
}

app.get("/", (req, res) => {
    getUByID(req.user).then(user => {
        if (req.user) {
            res.render("index", {
                url: req.headers.host,
                loggedIn: req.isAuthenticated(),
                username: user[0].username
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
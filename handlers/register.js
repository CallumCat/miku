const express = require("express");
const app = express();
const md5 = require("md5");
const { query } = require("../objects/db")
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require("path");

app.get("/register", (req, res) => {
    res.render("register", {
        url: req.headers.host
    });
});

async function checkUsername(u) {
    const q = await query("SELECT * FROM users WHERE username = ?", u)
    if (q.length > 0) {
        return true
    } else {
        return false
    }
}

async function checkKey(k) {
    const q = await query("SELECT * FROM tokens WHERE token = ?", k);
    if (q[0].allowed === 1) {
        return true
    } else {
        return false
    }
}

async function addUser(u, p, t) {
    await query("INSERT INTO users(username, password, token) VALUES(?,?,?)", u, p, t);
    await query("UPDATE tokens SET allowed = 0 WHERE token = ?", t);
    return
}

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    const key = req.body.key;

    checkUsername(username).then(nameCheck => {
        if (nameCheck) {
            res.end("A user with this username already exists!")
            return
        }
        checkKey(key).then(keyCheck => {
            if (!keyCheck) {
                res.end("This key has already been used, sorry.")
            }
            addUser(username, password, key).then(addCheck => {
                var dir = path.join(__dirname, "..", "files", key);
                mkdirp(dir, function(e){ 
                    console.log(e)
                });
                res.redirect("/login");
            })
        })
    })

});

module.exports = app;
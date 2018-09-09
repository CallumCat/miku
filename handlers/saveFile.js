const fs = require("fs")
const path = require("path")
const user = require("../objects/user")
const express = require("express");
const app = express();
const { query } = require("../objects/db")

function generate() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

async function insert(t, f) {
    await query("INSERT INTO files(uploader_token, filename) VALUES(?,?)", t, f)
    return
}

function save(token, file, callback) {
    var filename = generate();
    const fileJson = file;
    var extension = file.name.split(".")[file.name.split(".").length - 1];
    filename += "." + extension;

    const uploader = new user(token);

    file.mv(path.join(uploader.dir, filename), function (err) {
        if (err)
            return callback(null, err);

        callback(filename);
    })
}

async function check(token) {
    const check = await query("SELECT * FROM users WHERE token = ?", token)
    const check2 = await query("SELECT * FROM users WHERE token_old = ?", token)
    if (check.length > 0 || check2[0].token != "revoked") {
        return true
    } else {
        return false
    }
}

app.post("/up", (req, res) => {
    if (!req.files) {
        return res.end("Sorry, no file was given.")
    }

    const file = req.files.file;
    const user = req.body.token;
    
    check(user).then(rest => {
        
        if (!rest) {
            res.end("That token is invalid or you are banned.")
            }


        save(req.body.token, file, (filename, err) => {
            if (err) {
                return res.end(err.message)
            }
            insert(user, filename)
                res.end("http://" + req.headers.host + "/ss/" + filename)
        })
    })

})

module.exports = app;   
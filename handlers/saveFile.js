const fs = require("fs")
const path = require("path")
const user = require("../objects/user")
const express = require("express");
const app = express();

function generate() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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

app.post("/up", (req, res) => {
    if (!req.files) {
        return res.end("Sorry, no file was given.")
    }

    const file = req.files.file;
    const user = req.body.token;
    save(req.body.token, file, (filename, err) => {
        if (err) {
            return res.end(err.message)
        }
        res.end("http://" + req.headers.host + "/" + filename)
    })
})

module.exports = app;
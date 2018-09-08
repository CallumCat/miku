const fs = require("fs")
const path = require("path")
const express = require("express");
const app = express();

// checks every folder in the "Files" folder
function findFile(filename, callback) {
    var foldersPath = path.join(__dirname, "..", "files");
    var folders = fs.readdirSync(foldersPath)
    folders.forEach(function(folder){
        var file = path.join(foldersPath, folder, filename);
        if(fs.existsSync(file))
            return callback(null, file); 
    })
    callback("file not found", null);
}

app.get("*", function (req, res) {
    var slashescount = req.url.split("/").length;
    var filefound = false;
    var usersFile;
    if (slashescount >= 2) {
        findFile(req.url.substr(1), function (err, file) {
            if (file && !filefound) {
                filefound = true;
                usersFile = file;
            }
        });
    }
    if (!filefound)
        return res.end("File not found")
    else
        return res.sendFile(usersFile)
});

module.exports = app;
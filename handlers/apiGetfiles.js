const express = require("express");
const app = express();
const { query } = require("../objects/db")

async function getAllFromDB(u) {
    const user = await query("SELECT * FROM users WHERE username = ?", u)
    const token = user[0].token
    return await query("SELECT * FROM files WHERE uploader_token = ?", token)
}

app.get("/api/getFiles", (req, res) => {
    var username = req.query.u;
    var arr = [];
    getAllFromDB(username).then(q => {
        q.forEach(file => {
            const id = file.id;
            const fn = file.filename
            arr.push({id, fn});
        });
        res.json(arr);
    })
})

module.exports = app;
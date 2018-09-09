const express = require("express");
const app = express();
const { query } = require("../objects/db")

async function getAllFromDB() {
    return await query("SELECT * FROM tokens WHERE allowed = 1")
}

app.get("/api/getKeys", (req, res) => {
    var arr = [];
    getAllFromDB().then(q => {
        q.forEach(key => {
            const id = key.id;
            const t = key.token
            arr.push({id, t});
        });
        res.json(arr);
    })
})

module.exports = app;
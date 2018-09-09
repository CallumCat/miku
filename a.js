const mkdirp = require("mkdirp");
const m = require("./app")
const path = require("path")
var token = "a";
var dir = path.join(__dirname, "files", token);

console.log(dir)
mkdirp(dir, function(e){ 
    console.log(e)
});
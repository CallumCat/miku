const express = require("express");
const app = express();
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser')
const path = require("path")
const passport = require("passport");
const session = require('express-session')
const config = require("./config.json")
const cookieParser = require("cookie-parser")

global.fileloc = "/files/"

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: config.server.secret,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(require("./handlers/homepage"))
app.use(require("./handlers/login"))
app.use(require("./handlers/panel"))
app.use(require("./handlers/adminPanel"))
app.use(require("./handlers/apiGetAllKeys"))
app.use(require("./handlers/apiGetfiles"))
app.use(require("./handlers/register"))
app.use(require("./handlers/getFile"))
app.use(require("./handlers/saveFile"))


app.listen(config.server.port)

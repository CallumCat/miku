const express = require("express");
const app = express();
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser')
const path = require("path")

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(require("./handlers/getFile"))
app.use(require("./handlers/saveFile"))
app.use(require("./handlers/homepage"))

app.listen(80)
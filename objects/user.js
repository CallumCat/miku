var fs = require("fs")
var path = require("path")

class User {
    constructor(token) {
        this.token = token;
        this.valid = false;
        this.dir = path.join(__dirname, "..", "files", token);
        if (fs.existsSync(this.dir)) {
            this.valid = true;
        }
    }
}

module.exports = User;
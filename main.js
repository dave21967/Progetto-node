var express = require("express");
var app = express();

app.get("/", (req, resp) => {
    resp.send("<h1>Hello World!</h1>");
});

var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server running...");
});
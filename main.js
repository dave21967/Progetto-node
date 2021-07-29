var express = require("express");
var app = express();

app.get("/", (req, resp) => {
    resp.send("<h1>Hello World!</h1>");
});

app.listen(3000, () => {
    console.log("Server running...");
});
import express from "express";

const app = express();
const hostname = "localhost";
const port = 8080;

app.get("/", function (req, res) {
    res.send("<h1>Hello World</h1>");
});

app.listen(port, hostname, () => {
    console.log(`Running server ${hostname}:${port}/`);
});

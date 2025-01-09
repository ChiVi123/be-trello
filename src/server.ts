import "module-alias/register";
import express from "express";
import { routeV1 } from "~routes/v1";
import { routeV2 } from "~routes/v2";

const app = express();
const hostname = "localhost";
const port = 8080;

app.get("/", function (req, res) {
    res.send("<h1>Hello World</h1>");
});

app.listen(port, hostname, () => {
    console.log(`Running server ${hostname}:${port}/`);
    console.log({ routeV1 }, { routeV2 });
});

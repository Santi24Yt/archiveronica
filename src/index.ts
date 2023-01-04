import express from "express";

import interactions from "./interactions/index";

const app = express();

const DEFAULT_PORT = 3000;
const port = Number.isNaN(process.env.PORT) ? DEFAULT_PORT : process.env.PORT;

app.use("/interactions", interactions);

app.listen(port);

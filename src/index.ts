import express from "express";
import { config } from "dotenv";
import interactions from "./interactions/index.js";

config();

const app = express();

const DEFAULT_PORT = 3000;
const port = Number.isNaN(process.env.PORT) ? DEFAULT_PORT : process.env.PORT;

app.use(express.json());

app.use("/interactions", interactions);

app.listen(port);

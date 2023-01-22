import express from "express";
import { config } from "dotenv";

config();

// eslint-disable-next-line import/first
import interactions from "./interactions/index.js";

const app = express();

const DEFAULT_PORT = 3000;
const port =
  process.env.PORT === undefined || Number.isNaN(process.env.PORT)
    ? DEFAULT_PORT
    : process.env.PORT;

app.use(express.json());

app.use("/interactions", interactions);

app.get("/", (req, res) => {
  res.send(`Online\n${req.url}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const express = require("express");
const router = require("./router");
const cors = require("cors");
const dotenv = require("dotenv").config();
const PORT = dotenv.parsed.PORT || 8080;

const app = express();
// const serverless = require('serverless-http');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(
  cors({
    credentials: true,
    origin: `${dotenv.parsed.FRONT}`,
  }),
);

app.use("/", router);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    // module.exports.handler = serverless(app);
  } catch (e) {}
};

start();
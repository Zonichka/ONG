const express = require("express");
const router = require("./router");
const cors = require("cors");
const PORT = 5000;

const app = express();

app.use(express.json());


app.use(
  cors({
    credentials: true,
    origin: "https://localhost:3000",
  }),
);

app.use("/", router);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {}
};

start();
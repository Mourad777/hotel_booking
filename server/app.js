const express = require("express");

const { json, urlencoded } = express;

const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));

// app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));

// 
module.exports = { app };

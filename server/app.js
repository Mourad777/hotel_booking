const express = require("express");
const session = require("express-session");
const http = require("http");
const cors = require('cors')
const { Client } = require('pg');


const app = express();
app.use(cors());

const port = process.env.PORT || "3001"
app.set("port", port);

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const db = require("./db");
const sessionStore = new SequelizeStore({ db });

const { json, urlencoded } = express;

app.use(json());
app.use(urlencoded({ extended: false }));

// app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));

const server = http.createServer(app);

sessionStore
  .sync()
  .then(() => db.sync())
  .then(() => {
    server.listen(port);
    console.log(`listening on port ${port}`)
    // app.on("error", onError);
    // app.on("listening", onListening);
  });
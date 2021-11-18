const express = require("express");
const session = require("express-session");

require("dotenv").config();

const app = express();

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

sessionStore
  .sync()
  .then(() => db.sync())
  .then(() => {
    app.listen(port);
    console.log('listening on port 3001')
    // app.on("error", onError);
    // app.on("listening", onListening);
  });
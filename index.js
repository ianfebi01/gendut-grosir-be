const express = require("express");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const User = require("./models/User");
const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Database
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Connection error : " + err));

// Routes
readdirSync("./routes").map((item) =>
  app.use("/", require("./routes/" + item))
);

app.listen(PORT, () => console.log("listening on port", PORT));

const express = require("express");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const User = require("./models/User");

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

// OAuth
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:8000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (accessToken, refreshToken, email, profile, done) {
      const user = await User.findOne({
        facebookId: profile?.id,
      });

      if (user) {
        return done(null, profile);
      } else {
        const user = await new User({
          name: profile?.displayName,
          facebookId: profile?.id,
          profilePicture: profile?.photos[0]?.value,
          role: "customer",
        }).save();
        return done(null, profile);
      }
    }
  )
);

// app.get("/auth/facebook", passport.authenticate("facebook"));

// app.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );

// Routes
readdirSync("./routes").map((item) =>
  app.use("/", require("./routes/" + item))
);

app.listen(PORT, () => console.log("listening on port", PORT));

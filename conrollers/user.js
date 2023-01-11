const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const { generateToken } = require("../helpers/token");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { decode } = require("../helpers/decode");

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

// success auth
exports.loginSuccess = async (req, res) => {
  try {
    const user = await User.findOne({ facebookId: req.user.id });
    if (!user) {
      // return res.status(400).json({
      //   message: "Account not found",
      // });
      return res.redirect(
        `http://localhost:3001/login?error_message=account_not_found`
      );
    }
    // generate token
    const token = generateToken({ id: user._id.toString() }, "30d");
    res.redirect(`http://localhost:3001/login?access_token=${token}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const decoded = decode(req);

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(400).json({
        message: "Profile not found",
      });
    } else {
      return res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

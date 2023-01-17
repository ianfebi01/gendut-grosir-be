const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const { generateToken } = require("../helpers/token");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { decode } = require("../helpers/decode");
const {
  validateEmail,
  validateLenght,
  validateUsername,
} = require("../helpers/validation");
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../helpers/mailer");

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
    const token = generateToken({ id: user._id.toString() }, "1d");
    res.redirect(`http://localhost:3001/login?access_token=${token}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, role, status, password, activate, profilePicture } =
      req.body;
    // check email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    // check email on db
    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          "This email address already exists, please try with different email address.",
      });
    }

    if (!validateLenght(name, 3, 30)) {
      return res.status(400).json({
        message: "firstname must between 3 and 30 characters.",
      });
    }
    if (!validateLenght(password, 6, 40)) {
      return res.status(400).json({
        message: "password must be atleast 6 characters.",
      });
    }

    const cryptedPasswords = await bcrypt.hash(password, 12);

    const user = await new User({
      name,
      email,
      role: role || "customer",
      status,
      activate: activate || false,
      profilePicture,
      password: cryptedPasswords,
    }).save();
    // const emailVerificationToken = generateToken(
    //   { id: user._id.toString() },
    //   "1d"
    // );
    // const url = `${process.env.BASE_URL}/login?access_token=${emailVerificationToken}`;
    // sendVerificationEmail(user.email, user.name, url);
    // const token = generateToken({ id: user._id.toString() }, "1d");

    res.send({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        activate: user.activate,
        profilePicture: user.profilePicture,
      },
      message: "Registrasi Sukses",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email yang Anda masukan tidak ditemukan.",
      });
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Password salah, mohon coba lagi.",
      });
    }
    if (!user?.activate) {
      return res.status(400).json({
        message: "Hubungi Admin untuk mengaktifkan akun.",
      });
    }

    const token = generateToken({ id: user._id.toString() }, "1d");
    res.send({
      data: {
        _id: user._id,
        name: user.name,
        status: user.status,
        role: user.role,
        activate: user.activate,
        profilePicture: user.profilePicture,
        accessToken: token,
      },
      message: "Login Sukses",
    });
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
        message: "Profil tidak ditemukan",
      });
    } else {
      return res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).select([
      "name",
      "email",
      "role",
      "status",
      "activate",
      "profilePicture",
    ]);
    if (!user) {
      return res.status(400).json({
        message: "Profil tidak ditemukan",
      });
    } else {
      return res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true }
    ).select(["name", "email", "role", "status", "activate", "profilePicture"]);
    if (!user) {
      return res.status(400).json({
        message: "Profil tidak ditemukan",
      });
    } else {
      return res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllUser = async (req, res) => {
  try {
    const decoded = decode(req);
    const { q, limit, page } = req.query;
    const myCustomLabels = {
      totalDocs: "itemCount",
      docs: "data",
      meta: "paginator",
    };
    const options = {
      limit: limit || 25,
      page: page || 1,
      sort: {
        createdAt: 1,
      },
      customLabels: myCustomLabels,
      select: ["name", "email", "role", "status", "activate", "profilePicture"],
    };
    const user = await User.paginate(
      {
        name: { $regex: q || "", $options: "i" },
        _id: { $ne: decoded.id },
      },
      options
    );

    res.json({
      message: "Successfully get data",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete({ _id: id });
    if (!user) {
      return res.status(400).json({
        message: "Profil tidak ditemukan",
      });
    }
    res.json({
      message: "Pengguna berhasil dihapus.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

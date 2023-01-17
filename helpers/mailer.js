const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oauth_link = "https://developers.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = process.env;

const auth = new OAuth2(
  MAILING_ID,
  MAILING_SECRET,
  MAILING_REFRESH,
  oauth_link
);

exports.sendVerificationEmail = (email, name, url) => {
  try {
    auth.setCredentials({
      refresh_token: MAILING_REFRESH,
    });
    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken,
      },
    });
    const mailOptions = {
      form: EMAIL,
      to: email,
      subject: "Gendut Grosir Email Verification",
      html: `<div style="max-width:780px;margin-bottom:1rem;display:flex;font-family:Roboto;font-weight:600;color:#7f56d9;align-items:center"><img src="https://res.cloudinary.com/djyp9rr7s/image/upload/v1673539123/gendut-grosir/Logo_2_icc0po.png" alt="" style="width:30px;margin-right:10px"><span>Activate your Gendut Grosir Account</span></div><p style="text-align:center">Hello ${name}</p><p style="text-align:center">You recently create an account on Gendut Grosir, to complete your registration please confirm your registration</p><p style="text-align:center;margin-top:30px"><a href="${url}" style="padding:10px 15px;background:#7f56d9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Confirm your account</a></p><p style="font-size:17px;color:#898f9c;text-align:center;margin-top:30px"><span style="padding:1.5rem 0">Gendut Grosir. Semuluhkidul, Ngeposari, Semanu, Gunungkidul, Yogyakarta.</span></p>`,
    };
    stmp.sendMail(mailOptions, (err, res) => {
      if (err) return err;
      return res;
    });
  } catch (error) {
    console.log(error);
  }
};

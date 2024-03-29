const nodemailer = require("nodemailer");

exports.sendMail = async function (mail, text) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS,
      },
    });
    let mailOptions = {
      from: "roman.zinkevich1903@gmail.com",
      to: mail,
      subject: "Change a password",
      text: text,
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

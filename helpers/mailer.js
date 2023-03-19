const nodemailer = require('nodemailer');

exports.send = function (from, to, subject, text, html) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let mailOptions = {
    from: `GDSC FUTO - Fastrash <${from}>`,
    to: `Awesome user <${to}>`,
    subject: `${subject}`,
    text: `${text}`,
    html: `${html}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

exports.sendMulti = function (from, to, subject, text, html) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let mailOptions = {
    from: `GDSC FUTO - Fastrash <${from}>`,
    to: to,
    subject: `${subject}`,
    text: `${text}`,
    html: `${html}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
// const nodemailer = require('nodemailer');

exports.send = function (from, to, subject, text, html) {
  const client = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
  });
  const domain = process.env.MAILGUN_DOMAIN_NAME;
  const messageData = {
    from: `GDSC FUTO <${from}>`,
    to: `Awesome user <${to}>`,
    subject: `${subject}`,
    text: `${text}`,
    html: html,
  };
  client.messages
    .create(domain, messageData)
    .then((msg) => console.log(msg))
    .catch((err) => console.log(err));
};

// exports.send = function (from, to, subject, text, html) {
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: '',
//       pass: '',
//     },
//   });

//   let mailOptions = {
//     from: `${from}`,
//     to: `${to}`,
//     subject: `${subject}`,
//     text: `${text}`,
//     html: `${html}`,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// };

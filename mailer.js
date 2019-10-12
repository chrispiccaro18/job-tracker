require('dotenv').config();
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
const mailer = async() => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'chrispiccaro18@gmail.com', // sender address
    to: 'laurenweiss830@gmail.com ', // list of receivers
    subject: 'TESTING: I Love You', // Subject line
    text: 'Hello cutie?', // plain text body
    html: '<b>Hello cutie?</b>' // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};


mailer().catch(console.error);

module.exports = {
  mailer
};

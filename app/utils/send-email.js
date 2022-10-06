const nodemailer = require("nodemailer");
const systemConfig    = require(__path_configs + 'system');

const sendEmail = async (options) => {

  let transporter = nodemailer.createTransport({
    host: systemConfig.SMTP_HOST,
    port: systemConfig.SMTP_PORT,
    secure: false, 
    auth: {
      user: systemConfig.SMTP_EMAIL, 
      pass: systemConfig.SMTP_PASS, 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${systemConfig.FORM_EMAIL}<${systemConfig.FORM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject,
    text: options.message, 
    // html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

}

module.exports = sendEmail;
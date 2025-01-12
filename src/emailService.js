const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

function sendEmail(to, subject, templateName, replacements, callback) {
  // Read the HTML template
  const templatePath = path.join(
    __dirname,
    "templates",
    templateName + ".html"
  );
  let htmlContent = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders with actual values
  Object.keys(replacements).forEach(function (key) {
    htmlContent = htmlContent.replace(
      new RegExp("{{" + key + "}}", "g"),
      replacements[key]
    );
  });

  // Create the transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use SSL (TLS requires `true`)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send the email
  transporter.sendMail(
    {
      from: `"Event Team" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    },
    callback
  );
}

function sendRegistrationEmail(
  to,
  subject,
  templateName,
  replacements,
  callback
) {
  const pdfName = replacements.eventName.toLowerCase();
  // Read the HTML template
  const templatePath = path.join(
    __dirname,
    "templates",
    templateName + ".html"
  );
  let htmlContent = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders with actual values
  Object.keys(replacements).forEach(function (key) {
    htmlContent = htmlContent.replace(
      new RegExp("{{" + key + "}}", "g"),
      replacements[key]
    );
  });

  let pdfPath = path.join(__dirname, "pdfs", pdfName + ".pdf");

  // let pdfAttachment = fs.readFileSync(pdfPath);

  // Create the transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use SSL (TLS requires `true`)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send the email
  transporter.sendMail(
    {
      from: `"Event Team" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: `${pdfName}.pdf`,
          path: pdfPath,
        },
      ],
    },
    callback
  );
}
module.exports = {
  sendEmail,
  sendRegistrationEmail,
};

const express = require("express");
const { sendEmail } = require("../emailService");
const router = express.Router();

router.post("/", function (req, res) {
  const to = req.body.to;
  const subject = req.body.subject;
  const name = req.body.name;

  if (!to || !subject || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  sendEmail(
    to,
    subject,
    "userRegistration",
    { name: name },
    function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      res.status(200).json({ message: "Email sent successfully!" });
    }
  );
});

module.exports = router;

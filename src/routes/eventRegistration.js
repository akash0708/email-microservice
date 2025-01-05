const express = require("express");
const { sendRegistrationEmail } = require("../emailService");
const router = express.Router();

const eventNames = ["sparkhack", "aboltabol", "circuistics", "decisia"];

router.post("/", function (req, res) {
  const to = req.body.to;
  const subject = req.body.subject;
  const name = req.body.name;
  const eventName = req.body.eventName;

  if (!to || !subject || !name || !eventName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  sendRegistrationEmail(
    to,
    subject,
    "teamRegistration",
    { name: name, eventName: eventName },
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
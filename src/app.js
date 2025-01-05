const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sendEmail } = require("./emailService");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Frontend running on localhost:3000
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Email route
app.post("/send-email", function (req, res) {
  const to = req.body.to;
  const subject = req.body.subject;
  const name = req.body.name;
  const eventName = req.body.eventName;

  if (!to || !subject || !name || !eventName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  sendEmail(
    to,
    subject,
    "registration",
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

app.post("/send-team-email", function (req, res) {
  const { emails, teamName, event } = req.body;

  if (
    !emails ||
    !teamName ||
    !event ||
    !Array.isArray(emails) ||
    emails.length === 0
  ) {
    return res.status(400).json({ message: "Invalid or missing fields" });
  }

  const subject = `Registration Successful for ${event}!`;

  // Iterate over the email list and send emails
  let errors = [];
  emails.forEach(function (email) {
    sendEmail(
      email,
      subject,
      "teamRegistration",
      { teamName: teamName, event: event },
      function (error) {
        if (error) {
          console.error("Error sending email to:", email, error);
          errors.push(email);
        }
      }
    );
  });

  if (errors.length > 0) {
    return res.status(500).json({
      message: "Some emails failed to send.",
      failedEmails: errors,
    });
  }

  res.status(200).json({ message: "Team emails sent successfully!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log("Server running on port " + PORT);
});

const express = require("express");
// const bodyParser = require("body-parser");
const userRegistration = require("./routes/userRegistration");
const eventRegistration = require("./routes/eventRegistration");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Frontend running on localhost:3000
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "alive",
  });
});

app.use("/api/register", userRegistration);
app.use("/api/event", eventRegistration);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

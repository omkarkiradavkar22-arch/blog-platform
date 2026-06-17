require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cors = require("cors");
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false
}));
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT=process.env.PORT||3000;
app.listen(PORT, () => {
    console.log("Server running on http://localhost:3000");
});

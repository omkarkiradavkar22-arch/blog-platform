require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
 app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

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

const PORT=process.env.PORT||3000;
app.listen(PORT, () => {
    console.log("Server running on http://localhost:3000");
});

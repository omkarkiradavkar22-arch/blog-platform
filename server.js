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
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false
}));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/blogDB')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
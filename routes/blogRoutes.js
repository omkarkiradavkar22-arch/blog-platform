const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const isLoggedIn = require('../middleware/authMiddleware');

// Add Blog
router.post('/add', isLoggedIn, async (req, res) => {
    const newBlog = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: req.session.userId
    });

    await newBlog.save();
    res.redirect('/blog/all');
});



// router.get('/all', isLoggedIn, async (req, res) => {

//     const blogs = await Blog.find();

//     let blogList = blogs.map(blog => {

//         let buttons = "";

//         // 👇 Only compare using string
//         if (blog.author && blog.author.toString() === req.session.userId) {
//             buttons = `
            
//                  <link rel="stylesheet" href="/css/style1.css">
                 
//                 <a href="/blog/edit/${blog._id}">
//                     <button>Edit</button>
//                 </a>

//                 <form action="/blog/delete/${blog._id}" method="POST">
//                     <button type="submit">Delete</button>
//                 </form>
//             `;
//         }

//         return `
//         <div class="blog-card">
       
//             <h2>${blog.title}</h2>
//             <p>${blog.content}</p>
//             ${buttons}
//         </div>
//         `;
//     }).join("");

//     res.send(`
//         <div class="container">
//             <h1>All Blogs</h1>
//             ${blogList}
//         </div>
//     `);
// });

router.get('/all', isLoggedIn, async (req, res) => {

    const blogs = await Blog.find();

    let blogList = blogs.map(blog => {

        let buttons = "";

        if (blog.author && blog.author.toString() === req.session.userId) {
            buttons = `
                <a href="/blog/edit/${blog._id}">
                    <button>Edit</button>
                </a>

                <form action="/blog/delete/${blog._id}" method="POST" style="display:inline;">
                    <button type="submit">Delete</button>
                </form>
            `;
        }

        return `
        <div class="blog-card">
            <h2>${blog.title}</h2>
            <p>${blog.content}</p>
            ${buttons}
        </div>
        `;
    }).join("");

    res.send(`
    <html>
    <head>
        <title>All Blogs</title>
        <link rel="stylesheet" href="/css/style1.css">
    </head>
    <body>
        <div class="container">


            <h1>All Blogs</h1>
            <a href="/dashboard.html" class="back-button">Back</a>
             ${blogList}

        </div>
    </body>
    </html>
    `);
});

// Show Edit Page
router.get('/edit/:id', isLoggedIn, async (req, res) => {

    const blog = await Blog.findOne({
        _id: req.params.id,
        author: req.session.userId
    });

    res.send(`
    <html>
    <head>
        <title>Edit Blog</title>
        <link rel="stylesheet" href="/css/style1.css">
    </head>
    <body>
        <div class="container">
            <h2>Edit Blog</h2>

            <form action="/blog/update/${blog._id}" method="POST">
                <input type="text" name="title" value="${blog.title}" required>
                <textarea name="content" required>${blog.content}</textarea>
                <button type="submit">Save</button>
            </form>

            <br>
            <a href="/blog/all">Back</a>
        </div>
    </body>
    </html>
    `);
});

// Delete Blog
router.post('/delete/:id', isLoggedIn, async (req, res) => {
    await Blog.findOneAndDelete({
        _id: req.params.id,
        author: req.session.userId
    });

    res.redirect('/blog/all');
});

// Update Blog
router.post('/update/:id', isLoggedIn, async (req, res) => {

    await Blog.findOneAndUpdate(
        { _id: req.params.id, author: req.session.userId },
        {
            title: req.body.title,
            content: req.body.content
        }
    );

    res.redirect('/blog/all');
});

module.exports = router;
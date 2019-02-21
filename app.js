const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      app = express();

mongoose.connect('mongodb://localhost/blog_app', { useNewUrlParser: true })

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: false}));

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//   title: 'Beautiful cat',
//   image: 'https://www.usmagazine.com/wp-content/uploads/2018/06/Smoothie-the-Cat-Instagram-zoom.jpg',
//   body: 'This is a very nice cat to look at!'
// });

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

//INDEX ROUTE
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, allBlogs) => {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {blogs: allBlogs});
    }
  })
})

//NEW ROUTE 
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

//CREATE ROUTE
app.post('/blogs', (req, res) => {
  //create blog
  Blog.create(req.body, (err, newBlog) => {
    if(err) {
      res.render('new');
    } else {
      console.log('successfully created');
      //redirect to index
      res.redirect('/blogs');
    }
  });
});

//SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      res.redirect('index')
    } else {
      res.render('show', {blog: foundBlog});
    }
  })
})

app.listen(3000, console.log('Started server!'))
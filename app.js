const express = require('express'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override');
      expressSanitizer = require('express-sanitizer');
      mongoose = require('mongoose'),
      app = express();

mongoose.connect('mongodb://localhost/blog_app', { useNewUrlParser: true })

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

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
  req.body.body = req.sanitize(req.body.body);
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

//EDIT ROUTE 
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: foundBlog});
    }
  })
});

//UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
  req.body.body = req.sanitize(req.body.body);
  Blog.findOneAndUpdate({"_id": req.params.id}, {$set: req.body}, (err, updatedBlog) => {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  })
});

//DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
  Blog.findOneAndDelete({"_id": req.params.id}, (err) => {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(3000, console.log('Started server!'))
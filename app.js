const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blogs');
const { result } = require('lodash');
//express app
const app = express();

//connect to mongodb
const dbURL = 'mongodb+srv://shubham:12345@skipper.hbbwgnc.mongodb.net/?retryWrites=true&w=majoritymongodb+srv://shubham:12345@skipper.hbbwgnc.mongodb.net/skipper?retryWrites=true&w=majority'
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>app.listen(2000))
.catch((err)=>console.log(err));
//register view engine
app.set('view engine', 'ejs');

//middleware & Static file
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

// Mongoose and Mongo Sandbox route
app.get('/add-blog', (req, res)=>{
    const blog = new Blog({
        title: 'my blog',
        snippet: 'new blog snippet',
        body: 'Hi I am body of the respective blog'
    })

    blog.save()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>console.log(err));

});

app.get('/all-blogs',(req,res)=>{
    Blog.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get('/single-blog', (req, res)=>{
    Blog.findById('63565689381a3c45dedf30de')
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
})


app.get('/', (req,res)=>{

    // const blogs = [
    //     {title: 'Apartment Therapy', snippet: 'Apartment Therapy is a blog focusing on interior design. It was launched by Maxwell Ryan in 2001. Ryan is an interior designer who turned to blogging (using the moniker “the apartment therapist”). The blog has reached 20 million followers and has expanded into a full-scale media company.'},
    //     {title: 'Say Yes', snippet: 'Say Yes is an award-winning blog created by Liz Stanley in 2006. Although it could be classified as a mom blog as well, since Liz is a mother of three, it goes beyond that, offering useful advice about other topics, including food, and travel.'},
    //     {title: 'Bright Bazaar', snippet: 'Bright Bazaar was created by Will Taylor, a journalist-turned-interior designer in 2009. Apart from wonderful home tours and design findings, Will shares other exciting details about his lifestyle, including his outfits, recipes, and life in New York City.'},
    //     {title: 'A Cup of Jo', snippet: 'A weekend hobby for Joanna Goddard turned into a full-time job. She started A Cup of Jo in 2007 and became a superstar lifestyle blogger. In fact, the site is barely a personal blog anymore, as Jo now has a team of professional writers who share her interests, such as style, design, food, and motherhood.'},
    //     {title: 'Megan the Vegan Mom', snippet: 'Megan, the founder of “Megan the Vegan Mom”, blogs about her daily life as a vegan mom. She is a strong advocate of veganism as a former veterinarian who shares an immense love for pets. Along with topics about motherhood, Megan likes to write about parties, lifestyle, and fashion.'}
    // ];

   // res.send('<h1> HOME PAGE </h1>'); // replace write by send, auto setHeader, statusCode and end()
   //res.sendFile('./index.html',{root: __dirname});
   //res.render('index', {title: 'Home', blogs});
   res.redirect('/blogs');


});

app.get('/blogs',(req, res)=>{
    Blog.find().sort({ createdAt: -1})
    .then((result)=>{
        res.render('index', {title: 'Home', blogs: result})
    })
    .catch((err)=>{
        console.log(err);
    })
})


app.get('/about',(req,res)=>{
    //res.send('<h1>ABOUT PAGE </h1>');
    //res.sendFile('./about.html',{root: __dirname});
    res.render('about', {title: 'About'});
});

app.post('/blogs', (req, res)=>{
  const blog = new Blog(req.body);

  blog.save()
  .then((result)=>{
    res.redirect('/blogs');
  })
  .catch((err)=>{
    console.log(err);
  });
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result =>{
        console.log("hello");
        res.json({ redirect: '/blogs'})
    })
    .catch(err => console.log(err));
})

app.get('/blogs/create', (req, res)=>{
    res.render('create', {title: 'Create a blog'});
});

app.get('/blogs/:id', (req, res)=>{
    const id  = req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('details', {title: 'Blog Details', blog: result});
    })
    .catch((err)=>{
        console.log(err);
    });
    
});

//redirect
// app.get('/about-us',(req,res)=>{
//     res.redirect('/about');
// });


//404-Error
app.use((req,res, next)=>{
    //res.send("404-ERROR");
    //res.sendFile('./404.html',{root: __dirname});
    //res.status(404).render('404', {title: '404'});
    console.log('middleware');
    next();
});

app.get('/about-us',(req,res)=>{
    console.log("hello");
    res.redirect('/about');
});
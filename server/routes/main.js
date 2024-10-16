const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Story = require('../models/story');  // Adjust the path if needed


/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "The Lifestyle Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 9;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


// router.get('', async (req, res) => {
//   const locals = {
//     title: "Thelifestyele Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/** 
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});

/**
 * GET /
 * Admin back
*/
router.get('/back', (req, res) => {
  res.clearCookie('token');
  //res.json({ message: 'back to home page.'});
  res.redirect('/');
});

router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find();  // Fetch stories from the database
    res.render('stories', { 
      stories, 
      currentRoute: '/stories'  // Pass currentRoute to the view
    });  
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// Route to display all stories
router.get('/stories', async (req, res) => {
  try {
    const locals = {
      title: "All Stories",
      description: "Browse through all the amazing stories on our blog."
    };

    // Fetch all stories
    const stories = await Story.find().sort({ createdAt: -1 });

    // Render the 'stories.ejs' view and pass the stories
    res.render('stories', { locals, stories, currentRoute: '/stories' });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});



// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Insurance today",
//       body: "Learn about insurance and the various class and know what it is important to have one"
//     },
//     {
//       title: "WanderWise",
//       body: "Explore fascinating facts, global travel destinations, unique wildlife, and timeless advice from history, all in one place. WanderWise is your guide to discovering the world's wonders and living wisely..."
//     },
//     {
//       title: "Globe & Wisdom",
//       body: "Dive into the wonders of the world, from breathtaking travel spots and diverse wildlife to insightful life lessons passed down through the ages. Globe & Wisdom combines exploration with enriching advice."
//     },
//     {
//       title: "Curious Continent",
//       body: "Unveil the stories of the planet—facts, animals, places to visit, and timeless wisdom. Curious Continent takes you on an adventure across the globe, offering new perspectives with every post."
//     },
//     {
//       title: "Life’s Chronicles",
//       body: "Travel the world through stories about exotic locations, fascinating wildlife, and invaluable advice from different time periods. Life’s Chronicles provides a fresh perspective on living well and exploring deeply."
//     },
//     {
//       title: "Fashion & Facts",
//       body: "A stylish blend of fashion trends and fascinating facts. Discover the latest in global fashion alongside intriguing insights from history, science, and culture."
//     },
//     {
//       title: "TrendWise",
//       body: "Stay ahead in style while learning something new every day. TrendWise blends the latest fashion trends with fun and surprising facts, making fashion as enriching as it is stylish."
//     },
//     {
//       title: "Threads & Trivia",
//       body: "Dive into the world of fashion with Threads & Trivia—a blog that brings together the latest style advice with fascinating trivia from history, science, and beyond."
//     },
//     {
//       title: "Modern Minded",
//       body: "A blog dedicated to exploring the most interesting and relevant facts of today. Modern Minded provides fresh takes on contemporary events, trends, and innovations that define our times."
//     },
//     {
//      title: "Now You Know",
//       body: "Stay informed with up-to-date facts on the latest in science, culture, tech, and global events. Now You Know keeps you ahead of the curve with the most interesting modern facts."
//     },
//   ])
// }

// insertPostData();


module.exports = router;
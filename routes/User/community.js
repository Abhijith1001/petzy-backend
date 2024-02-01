const router = require('express').Router();
const Topic = require('../../models/community');
const { User } = require('../../models/user');
const Testimonial = require('../../models/Testimonial')
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/postimg');
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      if (allowedExtensions.includes(`.${fileExtension}`)) {
        cb(null, true); 
      } else {
        cb(new Error('Invalid file type. Only .jpg, .jpeg, .png, .webp files are allowed.'));
      }
    },
});


router.post('/a/:userId',upload.single('file'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newTopic = new Topic({ title, content, userId, firstName: user.firstName });

    const savedTopic = await newTopic.save();
    res.json(savedTopic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//all users topics
router.get('/b/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//loged in user
router.get('/d/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const post = await Topic.find({userId})
    console.log(post);
    res.status(200).json(post)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

//other than loged in user
router.get('/c/:userId', async (req, res) => {
  console.log(req.params.userId);

  try {
    const topics = await Topic.find({ userId: { $ne: req.params.userId } });
    console.log(topics);
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:id', (req, res) => {
  const topicId = req.params.id;
  Topic.findById(topicId)
    .then((topic) => res.json(topic))
    .catch((err) => res.status(400).json('Error: ' + err));
});



router.post('/:id/comments', async (req, res) => {
  const topicId = req.params.id;
  const { text, userId, parentCommentId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const author = user.firstName;

    const newComment = {
      text,
      author,
      userId,
      createdAt: new Date(),
    };

    if (parentCommentId) {
      const parentComment = await Topic.findOne({ 'comments._id': parentCommentId });

      if (parentComment) {
        parentComment.comments.forEach((comment) => {
          if (comment._id.toString() === parentCommentId) {
            comment.replies.push(newComment);
          }
        });

        const updatedTopic = await parentComment.save();
        const newReplyData = updatedTopic.comments.find(
          (comment) => comment._id.toString() === parentCommentId
        ).replies.slice(-1)[0];

        return res.json(newReplyData);
      } else {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    } else {
      const topic = await Topic.findById(topicId);

      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }

      topic.comments.push(newComment);
      const updatedTopic = await topic.save();

      const newCommentData = updatedTopic.comments.slice(-1)[0];
      res.json(newCommentData);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error: ' + error.message });
  }
});


router.post('/test/te/:userId', async (req, res) => {
  const { title, content } = req.body;
  const userId = req.params.userId;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const testimonial = new Testimonial({
      title,
      content,
      author: user.firstName,
    });

    await testimonial.save();

    return res.status(201).json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: 'Could not create testimonial' });
  }
});


router.get('/a/testi/test', async (req, res) => {
  try {
    const test = await Testimonial.find();
    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

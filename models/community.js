
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId:{
      type:String
    },
    firstName:{
      type:String
    },
    content: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    comments: [
      {
        text: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
        replies: [
          {
            text: String,
            author: String,
            userId: String,
            createdAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    
  });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;

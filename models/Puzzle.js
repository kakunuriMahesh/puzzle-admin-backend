const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  question: { type: String, required: true },
  image: { type: String, default: '' }, // Still works for Cloudinary URL
  hint: { type: String, default: '' },
  puzzleRange: { 
    type: String, 
    required: true, 
    enum: ['Low', 'Medium', 'High', 'Advanced'] 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['Input', 'Just a question', 'Match the following', 'Choose (MCQ)'] 
  },
  answer: { type: String },
  mcqOptions: [{ 
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  matchPairs: [{
    left: { type: String, required: true },
    right: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Puzzle', puzzleSchema);


// const mongoose = require('mongoose');

// const puzzleSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   question: { type: String, required: true },
//   image: { type: String, default: '' },
//   hint: { type: String, default: '' },
//   puzzleRange: { 
//     type: String, 
//     required: true, 
//     enum: ['Low', 'Medium', 'High', 'Advanced'] 
//   },
//   type: { 
//     type: String, 
//     required: true, 
//     enum: ['Input', 'Just a question', 'Match the following', 'Choose (MCQ)'] // Ensure this matches frontend
//   },
//   answer: { type: String }, // For Input and Just a question
//   mcqOptions: [{ 
//     text: { type: String, required: true },
//     isCorrect: { type: Boolean, required: true }
//   }], // For Choose (MCQ)
//   matchPairs: [{
//     left: { type: String, required: true },
//     right: { type: String, required: true }
//   }], // For Match the following
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Puzzle', puzzleSchema);
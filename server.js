const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Config for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/puzzles', upload.single('image'), require('./routes/puzzles'));

// Start server locally only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel
module.exports = app;


// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to DB
// connectDB();

// // Cloudinary Config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Multer Config
// const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/puzzles', upload.single('image'), require('./routes/puzzles')); // Add multer middleware

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//FIXME: image setting is not updated in the database
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to DB
// connectDB();

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/puzzles', require('./routes/puzzles'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
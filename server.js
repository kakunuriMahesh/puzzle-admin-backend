const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

const app = express();

// CORS configuration (inspired by the first snippet)
const allowedOrigins = [
  "http://localhost:5173", // Local dev (adjust port if needed)
  // Add production frontend URLs as needed, e.g.:
  // "https://your-puzzle-app.vercel.app",
  "https://puzzle-admin-backend.vercel.app/",
  // "https://yourdomain.com",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin); // Debug log
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // If you need to support cookies/auth headers
  })
);

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically (adjust for production)

// Database connection
connectDB();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploads

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/puzzles", upload.single("image"), require("./routes/puzzles"));

// Health check endpoint
app.get("/", (req, res) => res.send("Puzzle Backend is running"));

// Environment variable logging for debugging
console.log("ENV Variables:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
  MONGO_URI: process.env.MONGO_URI ? "Set" : "Missing", // Assuming connectDB uses this
  PORT: process.env.PORT || "Not set, defaulting to 5000",
});

// Start server in development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

// FIXME: haldle cors

// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// require('dotenv').config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// connectDB();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const upload = multer({ dest: 'uploads/' });

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/puzzles', upload.single('image'), require('./routes/puzzles'));

// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// module.exports = app;

// FIXME: not adding in vercel

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

// // Connect to MongoDB
// connectDB();

// // Cloudinary Config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Multer Config for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/puzzles', upload.single('image'), require('./routes/puzzles'));

// // Start server locally only in non-production environments
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// // Export the app for Vercel
// module.exports = app;

// FIXME:
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

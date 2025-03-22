// TODO: Good code working with Render deployment but give origin * 
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://puzzle-admin-backend.onrender.com/",
  "https://brown-wallaby-148031.hostingersite.com/", // hostinger
  "https://silver-cattle-790959.hostingersite.com/",
  // "https://puzzle-admin-backend.vercel.app/",
  // "https://puzzle-user.vercel.app/",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// MongoDB Connection
const adminDbUri = process.env.ADMIN_MONGO_URI;
if (!adminDbUri) {
  console.error("ADMIN_MONGO_URI is not defined.");
  process.exit(1);
}
// Updated: Remove deprecated options and add timeout
mongoose.connect(adminDbUri, {
  serverSelectionTimeoutMS: 10000, // Timeout after 10s if MongoDB is unreachable
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit to ensure Render logs the failure
  });

// Cloudinary Configuration
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configured successfully");
} catch (err) {
  console.error("Cloudinary config failed:", err.message);
}

// Multer Configuration
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/puzzles", upload.single("image"), require("./routes/puzzles"));

// Root Route
app.get("/", (req, res) => res.send("Puzzle Backend is running"));

// Log Environment Variables
console.log("ENV Variables:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
  ADMIN_MONGO_URI: process.env.ADMIN_MONGO_URI ? "Set" : "Missing",
});

// Updated: Bind to 0.0.0.0 with error handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

// TODO: working but getting 502 bad gateway fixing it 0.0.0.0

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");
// require("dotenv").config();

// const app = express();

// // CORS configuration
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "https://puzzle-admin-backend.vercel.app/", // Optional, can remove if not using Vercel
//   "https://puzzle-user.vercel.app/", // Update with Render frontend URL later
//   "https://puzzle-admin-backend.onrender.com/",
// ];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.log("Blocked origin:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // Middleware
// app.use(express.json());

// // MongoDB Connection
// const adminDbUri = process.env.ADMIN_MONGO_URI;
// if (!adminDbUri) {
//   console.error("ADMIN_MONGO_URI is not defined.");
//   process.exit(1);
// }
// mongoose.connect(adminDbUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("Connected to MongoDB"))
//   .catch((err) => {
//     console.error("MongoDB connection error:", err.message);
//     process.exit(1);
//   });

// // Cloudinary Configuration
// try {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
//   console.log("Cloudinary configured successfully");
// } catch (err) {
//   console.error("Cloudinary config failed:", err.message);
// }

// // Multer Configuration
// const upload = multer({ storage: multer.memoryStorage() });

// // Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/puzzles", upload.single("image"), require("./routes/puzzles"));

// // Root Route
// app.get("/", (req, res) => res.send("Puzzle Backend is running"));

// // Log Environment Variables
// console.log("ENV Variables:", {
//   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
//   ADMIN_MONGO_URI: process.env.ADMIN_MONGO_URI ? "Set" : "Missing",
// });

// // Bind to Render’s PORT or default to 5000 locally
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;

// TODO: working fine Fix vercel

// FIXME: TODO: Not creating all types properly


// TODO: check


// TODO: working fine but login error

// FIXME: haldle cors



// FIXME: not adding in vercel

// FIXME:

// FIXME: image setting is not updated in the database
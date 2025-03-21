// TODO: working fine Fix vercel

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
  "https://puzzle-admin-backend.vercel.app/",
  "https://puzzle-user.vercel.app/",
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

// MongoDB Connection (single default connection)
const adminDbUri = process.env.ADMIN_MONGO_URI;
if (!adminDbUri) {
  console.error("ADMIN_MONGO_URI is not defined.");
  process.exit(1); // Exit if no URI
}
mongoose.connect(adminDbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
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

// Local Server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

// FIXME: TODO: Not creating all types properly

// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");
// require("dotenv").config();

// const app = express();

// // CORS configuration
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "https://puzzle-admin-backend.vercel.app/",
//   "https://puzzle-user.vercel.app/" // Adjust as needed
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

// // Database connection
// connectDB();

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Multer configuration
// const upload = multer({ storage: multer.memoryStorage() });

// // Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/puzzles", upload.single("image"), require("./routes/puzzles"));

// // Root route
// app.get("/", (req, res) => res.send("Puzzle Backend is running"));

// // Environment variable logging
// console.log("ENV Variables:", {
//   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
//   ADMIN_MONGO_URI: process.env.ADMIN_MONGO_URI ? "Set" : "Missing",
// });

// // Only bind to port locally (not needed in Vercel)
// if (!process.env.VERCEL) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// module.exports = app;
// TODO: check

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
//   "https://puzzle-admin-backend.vercel.app/",
//   "https://puzzle-user.vercel.app/"
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
// }
// const adminConnection = mongoose.createConnection(adminDbUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// adminConnection.on("connected", () => console.log("Connected to MongoDB"));
// adminConnection.on("error", (err) => console.error("MongoDB error:", err));
// app.set("adminConnection", adminConnection);

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

// // Local Server
// if (!process.env.VERCEL) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// module.exports = app;

// TODO: working fine but login error

// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");
// require("dotenv").config();

// const app = express();

// // CORS configuration
// const allowedOrigins = [
//   "http://localhost:5173", // Local dev frontend
//   "https://puzzle-admin-backend.vercel.app/", // Backend URL
//   "https://puzzle-user.vercel.app/", // Add your user frontend URL
//   "http://localhost:5000",
//   "http://localhost:3000"
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

// // Database connection
// connectDB();

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Multer configuration
// const upload = multer({ storage: multer.memoryStorage() });

// // Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/puzzles", upload.single("image"), require("./routes/puzzles"));

// // Root route
// app.get("/", (req, res) => res.send("Puzzle Backend is running"));

// // Environment variable logging
// console.log("ENV Variables:", {
//   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
//   ADMIN_MONGO_URI: process.env.ADMIN_MONGO_URI ? "Set" : "Missing",
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;

// FIXME: haldle cors



// FIXME: not adding in vercel

// FIXME:

// FIXME: image setting is not updated in the database
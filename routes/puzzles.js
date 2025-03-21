// TODO: working fine Fix vercel

const express = require("express");
const router = express.Router();
const Puzzle = require("../models/Puzzle");
const authMiddleware = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;

// Public GET route
router.get("/", async (req, res) => {
  try {
    const { type, puzzleRange } = req.query;
    const query = {};
    if (type) query.type = type;
    if (puzzleRange) query.puzzleRange = puzzleRange;
    const puzzles = await Puzzle.find(query).sort({ createdAt: -1 });
    res.json(puzzles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected routes
router.post("/", authMiddleware, async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "puzzles", timeout: 60000 }, // Increased timeout
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const puzzleData = {
      ...req.body,
      image: imageUrl || req.body.image || "",
    };

    if (puzzleData.matchPairs && typeof puzzleData.matchPairs === "string") {
      puzzleData.matchPairs = JSON.parse(puzzleData.matchPairs);
    }
    if (puzzleData.mcqOptions && typeof puzzleData.mcqOptions === "string") {
      puzzleData.mcqOptions = JSON.parse(puzzleData.mcqOptions);
    }

    const puzzle = new Puzzle(puzzleData);
    await puzzle.save({ wtimeout: 20000 }); // Increase write timeout
    res.status(201).json(puzzle);
  } catch (err) {
    console.error("POST error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "puzzles", timeout: 60000 },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const puzzleData = {
      ...req.body,
      image: imageUrl || req.body.image || "",
    };

    if (puzzleData.matchPairs && typeof puzzleData.matchPairs === "string") {
      puzzleData.matchPairs = JSON.parse(puzzleData.matchPairs);
    }
    if (puzzleData.mcqOptions && typeof puzzleData.mcqOptions === "string") {
      puzzleData.mcqOptions = JSON.parse(puzzleData.mcqOptions);
    }

    const puzzle = await Puzzle.findByIdAndUpdate(req.params.id, puzzleData, { new: true });
    if (!puzzle) return res.status(404).json({ error: "Puzzle not found" });
    res.json(puzzle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const puzzle = await Puzzle.findByIdAndDelete(req.params.id);
    if (!puzzle) return res.status(404).json({ error: "Puzzle not found" });
    res.json({ message: "Puzzle deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// FIXME: TODO: Not creating all types properly

// const express = require("express");
// const router = express.Router();
// const Puzzle = require("../models/Puzzle");
// const authMiddleware = require("../middleware/auth");
// const cloudinary = require("cloudinary").v2;

// router.use(authMiddleware);

// router.post("/", async (req, res) => {
//   try {
//     let imageUrl = "";
//     if (req.file) {
//       const result = await cloudinary.uploader.upload_stream(
//         { folder: "puzzles" },
//         (error, result) => {
//           if (error) throw error;
//           imageUrl = result.secure_url;
//         }
//       ).end(req.file.buffer); // Use buffer instead of path
//     }

//     const puzzleData = {
//       ...req.body,
//       image: imageUrl || req.body.image || "",
//     };
//     if (puzzleData.matchPairs && typeof puzzleData.matchPairs === "string") {
//       puzzleData.matchPairs = JSON.parse(puzzleData.matchPairs);
//     }
//     if (puzzleData.mcqOptions && typeof puzzleData.mcqOptions === "string") {
//       puzzleData.mcqOptions = JSON.parse(puzzleData.matchPairs);
//     }

//     const puzzle = new Puzzle(puzzleData);
//     await puzzle.save();
//     res.status(201).json(puzzle);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.put("/:id", async (req, res) => {
//   try {
//     let imageUrl = req.body.image;
//     if (req.file) {
//       const result = await cloudinary.uploader.upload_stream(
//         { folder: "puzzles" },
//         (error, result) => {
//           if (error) throw error;
//           imageUrl = result.secure_url;
//         }
//       ).end(req.file.buffer); // Use buffer instead of path
//     }

//     const puzzleData = {
//       ...req.body,
//       image: imageUrl || "",
//     };
//     if (puzzleData.matchPairs && typeof puzzleData.matchPairs === "string") {
//       puzzleData.matchPairs = JSON.parse(puzzleData.matchPairs);
//     }
//     if (puzzleData.mcqOptions && typeof puzzleData.mcqOptions === "string") {
//       puzzleData.mcqOptions = JSON.parse(puzzleData.mcqOptions);
//     }

//     const puzzle = await Puzzle.findByIdAndUpdate(req.params.id, puzzleData, { new: true });
//     if (!puzzle) return res.status(404).json({ error: "Puzzle not found" });
//     res.json(puzzle);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const { type, puzzleRange } = req.query;
//     const query = {};
//     if (type) query.type = type;
//     if (puzzleRange) query.puzzleRange = puzzleRange;
//     const puzzles = await Puzzle.find(query).sort({ createdAt: -1 });
//     res.json(puzzles);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const puzzle = await Puzzle.findByIdAndDelete(req.params.id);
//     if (!puzzle) return res.status(404).json({ error: "Puzzle not found" });
//     res.json({ message: "Puzzle deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// FIXME: not adding in vercel

// const express = require('express');
// const router = express.Router();
// const Puzzle = require('../models/Puzzle');
// const authMiddleware = require('../middleware/auth');
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// // Public access for GET requests
// router.get('/', async (req, res) => {
//   try {
//     const { type, puzzleRange } = req.query;
//     const query = {};
//     if (type) query.type = type;
//     if (puzzleRange) query.puzzleRange = puzzleRange;
//     const puzzles = await Puzzle.find(query).sort({ createdAt: -1 });
//     res.json(puzzles);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Authentication required for modifying data
// router.use(authMiddleware);

// router.post('/', async (req, res) => {
//   try {
//     let imageUrl = '';
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path);
//       imageUrl = result.secure_url;
//       fs.unlinkSync(req.file.path); // Delete temp file
//     }

//     // Parse matchPairs and mcqOptions if they are strings
//     const puzzleData = {
//       ...req.body,
//       image: imageUrl || req.body.image || '',
//     };
//     if (puzzleData.matchPairs && typeof puzzleData.matchPairs === 'string') {
//       puzzleData.matchPairs = JSON.parse(puzzleData.matchPairs);
//     }
//     if (puzzleData.mcqOptions && typeof puzzleData.mcqOptions === 'string') {
//       puzzleData.mcqOptions = JSON.parse(puzzleData.mcqOptions);
//     }

//     const puzzle = new Puzzle(puzzleData);
//     await puzzle.save();
//     res.status(201).json(puzzle);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     let imageUrl = req.body.image;
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path);
//       imageUrl = result.secure_url;
//       fs.unlinkSync(req.file.path);
//     }

//     // Parse matchPairs and mcqOptions if they are strings
//     const puzzleData = {
//       ...req.body,
//       image: imageUrl || '',
//     };
//     if (puzzleData.matchPairs && typeof puzzleData.matchPairs === 'string') {
//       puzzleData.matchPairs = JSON.parse(puzzleData.matchPairs);
//     }
//     if (puzzleData.mcqOptions && typeof puzzleData.mcqOptions === 'string') {
//       puzzleData.mcqOptions = JSON.parse(puzzleData.mcqOptions);
//     }

//     const puzzle = await Puzzle.findByIdAndUpdate(req.params.id, puzzleData, { new: true });
//     if (!puzzle) return res.status(404).json({ error: 'Puzzle not found' });
//     res.json(puzzle);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   try {
//     const puzzle = await Puzzle.findByIdAndDelete(req.params.id);
//     if (!puzzle) return res.status(404).json({ error: 'Puzzle not found' });
//     res.json({ message: 'Puzzle deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// FIXME: image setting is not updated in the database

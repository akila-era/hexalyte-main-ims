const multer = require("multer");

// Store in memory (no saving to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;

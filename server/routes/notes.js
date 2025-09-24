const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

router.route("/").get(auth, getNotes).post(auth, createNote);
router.route("/:id").put(auth, updateNote).delete(auth, deleteNote);

module.exports = router;

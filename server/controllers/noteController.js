const Note = require("../models/Note");

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newNote = new Note({ title, content, user: req.user.id });
    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    let note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: { title, content } },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: "Note removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

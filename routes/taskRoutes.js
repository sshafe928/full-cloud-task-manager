const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Task = require("../models/Task");

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "task-manager", // You can change this to any folder you prefer
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage: storage });

// Display all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.render("index", { tasks });
});

// Add a new task
router.get("/tasks/new", (req, res) => res.render("addTask"));

router.post("/tasks", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Cloudinary URL is stored in req.file.path
  const newTask = new Task({ title, description, imageUrl });
  await newTask.save();
  res.redirect("/");
});

// Edit task
router.get("/tasks/edit/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.render("editTask", { task });
});

router.post("/tasks/edit/:id", upload.single("image"), async (req, res) => {
  const { title, description, completed } = req.body;
  const task = await Task.findById(req.params.id);

  if (req.file) task.imageUrl = req.file.path; // Store the Cloudinary URL
  task.title = title;
  task.description = description;
  task.completed = completed === "on";
  await task.save();

  res.redirect("/");
});

// Delete task
router.post("/tasks/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Mark task as complete
router.post("/tasks/complete/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = true;
  await task.save();
  res.redirect("/");
});

module.exports = router;
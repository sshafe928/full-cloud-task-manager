const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const Task = require('../models/Task');

//configure cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'task-manager',
        allowed_formats: ['jpg', 'png', 'gif', 'jpeg'],
        public_id: (req, file) => {
            return `task_${req.user._id}_${Date.now()}`;
        },
    },
})

const upload = multer({ storage });

//task router/routes

//All tasks - index
router.get('/', async (req, res) => {
    const tasks = await Task.find({})
    res.render('index', {tasks})
});

//add tasks - add tasks
router.get('/tasks/new', async (req, res) => res.render('addTask'))

//ad task post
router.post('/tasks/new', upload.single('image'), async (req, res) => {
    const {title, description} = req.body
    let imageURL = req.file ? req.file.secure_url : null  // cloudinary url is stored in the req.file.path
    const newTask = new Task({title, description, imageURL})
    await newTask.save()
    res.redirect('/')
})

//edit task - page
router.get('/tasks/edit/:id', async (req, res) =>{
    const task = await Task.findById(req.params.id)
    res.render('editTask', {task})
})

//edit task - form post
router.post('/tasks/edit/:id', upload.single('image'), async (req, res)  =>{
    const {title, description, imageURL } = req.body
    const task = await Task.findById(req.params.id)

    if(req.file) task.imageURL = req.file.path //store the cloudinary url
    task.title = title
    task.description = description
    task.completed = completed === "on"
    await task.save()
    res.redirect('/')
})

//delete task - form post
router.post('/tasks/delete/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id)
    res.redirect('/')
});

//mark task as complete
router.post('/tasks/complete/:id', async (req,res) =>{
    const task = await Task.findById(req.params.id)
    task.completed = true
    await task.save()
    res.redirect('/')
});

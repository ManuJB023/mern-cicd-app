// server/routes/tasks.js
const express = require('express');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      completed, 
      priority, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { user: req.userId };

    // Filter by completion status
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        hasNext: skip + tasks.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      message: 'Server error fetching tasks' 
    });
  }
});

// @route   POST /api/tasks
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Task title is required' 
      });
    }

    // Create task
    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      user: req.userId
    });

    await task.save();
    
    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error creating task' 
    });
  }
});

// @route   PATCH /api/tasks/:id
router.patch('/:id', auth, async (req, res) => {
  try {
    const { title, description, completed, priority } = req.body;

    // Build update object
    const updateData = {};
    
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({ 
          message: 'Task title cannot be empty' 
        });
      }
      updateData.title = title.trim();
    }
    
    if (description !== undefined) {
      updateData.description = description ? description.trim() : '';
    }
    
    if (completed !== undefined) {
      updateData.completed = completed;
    }
    
    if (priority !== undefined) {
      updateData.priority = priority;
    }

    // Update task
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }
    
    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid task ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error updating task' 
    });
  }
});

// @route   DELETE /api/tasks/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }
    
    res.json({ 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    console.error('Delete task error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid task ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error deleting task' 
    });
  }
});

module.exports = router;
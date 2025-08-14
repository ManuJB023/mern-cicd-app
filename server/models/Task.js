// server/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'general'
  },
  dueDate: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must belong to a user']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, completed: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

// Middleware to set completedAt when task is marked as completed
taskSchema.pre('save', function(next) {
  if (this.isModified('completed')) {
    if (this.completed && !this.completedAt) {
      this.completedAt = new Date();
    } else if (!this.completed) {
      this.completedAt = null;
    }
  }
  next();
});

// Static method to get user's task statistics
taskSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
        },
        highPriority: {
          $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  };
};

// Instance method to toggle completion status
taskSchema.methods.toggleCompletion = function() {
  this.completed = !this.completed;
  if (this.completed) {
    this.completedAt = new Date();
  } else {
    this.completedAt = null;
  }
  return this.save();
};

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

// Ensure virtual fields are included when converting to JSON
taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
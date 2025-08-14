// client/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Fab,
  Paper
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  CheckCircle,
  RadioButtonUnchecked
} from '@mui/icons-material';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { tasks, getTasks, addTask, updateTask, deleteTask, loading, error, clearError } = useTasks();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium' 
  });

  useEffect(() => {
    getTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    let result;
    if (editTask) {
      result = await updateTask(editTask._id, formData);
    } else {
      result = await addTask(formData);
    }

    if (result.success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditTask(null);
    setFormData({ title: '', description: '', priority: 'medium' });
    if (error) clearError();
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setFormData({ 
      title: task.title, 
      description: task.description,
      priority: task.priority
    });
    setOpen(true);
  };

  const toggleComplete = async (task) => {
    await updateTask(task._id, { completed: !task.completed });
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const stats = getStatusStats();

  if (loading && tasks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 8 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Welcome back, {user?.username}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Here's what you need to get done today
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h3" fontWeight="bold">{stats.total}</Typography>
            <Typography variant="body1">Total Tasks</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <Typography variant="h3" fontWeight="bold">{stats.completed}</Typography>
            <Typography variant="body1">Completed</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
            <Typography variant="h3" fontWeight="bold">{stats.pending}</Typography>
            <Typography variant="body1">Pending</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Tasks Grid */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Your Tasks
      </Typography>

      {tasks.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks yet!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create your first task to get started with your productivity journey.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            size="large"
          >
            Create Your First Task
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        textDecoration: task.completed ? 'line-through' : 'none',
                        opacity: task.completed ? 0.7 : 1,
                        wordBreak: 'break-word'
                      }}
                    >
                      {task.title}
                    </Typography>
                    <IconButton
                      onClick={() => toggleComplete(task)}
                      color={task.completed ? 'success' : 'default'}
                      size="small"
                    >
                      {task.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
                    </IconButton>
                  </Box>
                  
                  {task.description && (
                    <Typography 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        opacity: task.completed ? 0.7 : 1 
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                  
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip 
                      label={task.priority.toUpperCase()} 
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                    <Chip 
                      label={task.completed ? 'COMPLETED' : 'PENDING'} 
                      color={task.completed ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                
                <CardActions>
                  <IconButton 
                    onClick={() => handleEdit(task)} 
                    color="primary"
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(task._id)} 
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setOpen(true)}
      >
        <Add />
      </Fab>

      {/* Add/Edit Task Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Task Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={!formData.title.trim()}>
              {editTask ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
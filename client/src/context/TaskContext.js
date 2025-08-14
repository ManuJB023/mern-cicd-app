// client/src/context/TaskContext.js
import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  loading: false,
  error: null
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'GET_TASKS':
      return { 
        ...state, 
        tasks: action.payload.tasks || action.payload, 
        loading: false,
        error: null 
      };
    case 'ADD_TASK':
      return { 
        ...state, 
        tasks: [action.payload, ...state.tasks],
        loading: false 
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        loading: false
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        loading: false
      };
    case 'TASK_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { token } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Get all tasks
  const getTasks = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'GET_TASKS', payload: res.data });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      dispatch({ type: 'TASK_ERROR', payload: message });
    }
  };

  // Add new task
  const addTask = async (taskData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'ADD_TASK', payload: res.data.task });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      dispatch({ type: 'TASK_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.patch(`${API_URL}/tasks/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'UPDATE_TASK', payload: res.data.task });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      dispatch({ type: 'TASK_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'DELETE_TASK', payload: id });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      dispatch({ type: 'TASK_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <TaskContext.Provider value={{
      ...state,
      getTasks,
      addTask,
      updateTask,
      deleteTask,
      clearError
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};
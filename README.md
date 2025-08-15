# MERN Stack CI/CD Application

[![CI/CD Pipeline](https://github.com/yourusername/mern-cicd-app/workflows/MERN%20Stack%20CI/CD/badge.svg)](https://github.com/yourusername/mern-cicd-app/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)

A full-stack MERN (MongoDB, Express.js, React, Node.js) application with automated CI/CD pipeline, featuring user authentication, task management, and AWS deployment.

## 🌟 Live Demo

- **Frontend**: [Live Application](http://mern-app-1755211827.s3-website-us-east-1.amazonaws.com)
- **API Health**: [Backend Status](http://54.84.22.104:5000/api/health)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **Password hashing** using bcrypt
- **Protected routes** and middleware
- **Input validation** and sanitization

### 📝 Task Management
- **CRUD operations** for tasks (Create, Read, Update, Delete)
- **Task prioritization** (High, Medium, Low)
- **Task completion tracking** with timestamps
- **User-specific task isolation**
- **Real-time statistics** and progress tracking

### 🎨 Modern UI/UX
- **Material-UI components** for professional design
- **Responsive design** for mobile and desktop
- **Dark/Light theme support**
- **Loading states** and error handling
- **Form validation** with user feedback

### 🚀 DevOps & Deployment
- **Automated CI/CD pipeline** with GitHub Actions
- **AWS deployment** (EC2 + S3)
- **Docker support** for containerization
- **Environment-based configuration**
- **Health checks** and monitoring

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Context** - State management

### Backend
- **Node.js 18** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### DevOps & Tools
- **GitHub Actions** - CI/CD pipeline
- **PM2** - Process management
- **AWS EC2** - Backend hosting
- **AWS S3** - Frontend hosting
- **Docker** - Containerization
- **ESLint** - Code linting

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/S3)    │────│   (Node.js/EC2) │────│   (MongoDB)     │
│                 │    │                 │    │                 │
│  Material-UI    │    │  Express + JWT  │    │  Atlas/Local    │
│  Task Manager   │    │  RESTful API    │    │  Collections    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   CI/CD Pipeline │
                    │  (GitHub Actions)│
                    │                 │
                    │  Automated      │
                    │  Testing &      │
                    │  Deployment     │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **MongoDB** (local or Atlas)
- **Git**

### Clone and Install
```bash
# Clone the repository
git clone https://github.com/yourusername/mern-cicd-app.git
cd mern-cicd-app

# Install all dependencies
npm run install-all

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start development servers
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api

## 📦 Installation

### Backend Setup
```bash
cd server
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start backend server
npm run dev
```

### Frontend Setup
```bash
cd client
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API URL

# Start frontend development server
npm start
```

### Full Stack Development
```bash
# From project root
npm run dev
# This starts both frontend and backend concurrently
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mernapp
JWT_SECRET=your_super_secret_jwt_key
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Production Environment
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mernapp
JWT_SECRET=production_jwt_secret_key
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <jwt_token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the MERN stack application",
  "priority": "high"
}
```

#### Update Task
```http
PATCH /api/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "completed": true,
  "priority": "medium"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## 🚀 Deployment

### Local Development
```bash
# Install dependencies
npm run install-all

# Start development environment
npm run dev
```

### Production Deployment

#### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individual containers
docker build -t mern-backend ./server
docker build -t mern-frontend ./client
```

#### AWS Deployment
```bash
# Deploy backend to EC2
# Deploy frontend to S3
# Configure CloudFront (optional)

# See deployment guide in docs/deployment.md
```

#### Manual Deployment
```bash
# Backend (Node.js server)
cd server
npm install --production
npm start

# Frontend (Static build)
cd client
npm run build
# Serve build folder with nginx or apache
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The project includes automated CI/CD pipeline that:

1. **Continuous Integration**
   - Runs tests on multiple Node.js versions
   - Builds frontend application
   - Performs security audits
   - Validates code quality

2. **Deployment Stages**
   - **Staging**: Auto-deploy on `develop` branch
   - **Production**: Auto-deploy on `master` branch

3. **Quality Gates**
   - All tests must pass
   - Security vulnerabilities check
   - Build validation

### Pipeline Configuration
```yaml
# .github/workflows/deploy.yml
name: MERN Stack CI/CD
on:
  push:
    branches: [ master, develop ]
  pull_request:
    branches: [ master ]
```

### Required Secrets
Set these in GitHub repository settings:
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS credentials

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Test Coverage
```bash
npm run test:coverage
```

## 📊 Scripts

### Development
```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
```

### Building
```bash
npm run build        # Build frontend for production
npm run build:server # Build backend (if using TypeScript)
```

### Testing
```bash
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Utilities
```bash
npm run install-all  # Install all dependencies
npm run clean        # Clean node_modules and build files
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/) for the React boilerplate
- [Material-UI](https://mui.com/) for the component library
- [Express.js](https://expressjs.com/) for the web framework
- [MongoDB](https://www.mongodb.com/) for the database
- [AWS](https://aws.amazon.com/) for cloud infrastructure

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the [Issues](https://github.com/yourusername/mern-cicd-app/issues) page
2. Read the [Documentation](docs/)
3. Create a new issue if needed

## 🔗 Links

- [Live Demo](http://mern-app-1755211827.s3-website-us-east-1.amazonaws.com)
- [API Documentation](https://documenter.getpostman.com/view/your-collection)
- [Deployment Guide](docs/deployment.md)
- [Architecture Guide](docs/architecture.md)

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

⭐ Star this repository if you found it helpful!
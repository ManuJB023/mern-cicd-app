// server/test-api.js
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('🔍 Testing MERN API endpoints...\n');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test 2: Register user
    console.log('2. Testing user registration...');
    const registerData = {
      username: 'mbauka',
      email: 'mbauka@pm.me',
      password: 'UkpSNNAoL0Tm0vDv'
    };

    let token;
    
    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
      console.log('✅ Registration successful:', registerResponse.data);
      token = registerResponse.data.token;
      console.log('🔑 Token received:', token.substring(0, 30) + '...');
      console.log('');
    } catch (registerError) {
      if (registerError.response?.status === 400 && 
          registerError.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists, trying login instead...');
        
        // Try login instead
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: registerData.email,
          password: registerData.password
        });
        console.log('✅ Login successful:', loginResponse.data);
        token = loginResponse.data.token;
        console.log('🔑 Token received:', token.substring(0, 30) + '...');
        console.log('');
      } else {
        throw registerError;
      }
    }

    // Test 3: Get user info
    console.log('3. Testing get user info...');
    const userResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ User info:', userResponse.data);
    console.log('');

    // Test 4: Create a task
    console.log('4. Testing task creation...');
    const taskData = {
      title: 'Test Task from API',
      description: 'This is a test task created via the API test script',
      priority: 'high'
    };

    const taskResponse = await axios.post(`${API_BASE}/tasks`, taskData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Task created:', taskResponse.data);
    console.log('');

    // Test 5: Get all tasks
    console.log('5. Testing get tasks...');
    const tasksResponse = await axios.get(`${API_BASE}/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Tasks retrieved:', tasksResponse.data);
    console.log('');

    // Test 6: Update the task
    if (tasksResponse.data.tasks && tasksResponse.data.tasks.length > 0) {
      const taskId = tasksResponse.data.tasks[0]._id;
      console.log('6. Testing task update...');
      
      const updateResponse = await axios.patch(`${API_BASE}/tasks/${taskId}`, {
        completed: true,
        description: 'Updated description - task completed!'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Task updated:', updateResponse.data);
      console.log('');
    }

    console.log('🎉 All API tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- ✅ Health check');
    console.log('- ✅ User authentication (register/login)');
    console.log('- ✅ User profile retrieval');
    console.log('- ✅ Task creation');
    console.log('- ✅ Task retrieval');
    console.log('- ✅ Task updates');
    console.log('\n🚀 Backend is fully functional!');

  } catch (error) {
    console.error('\n❌ API Test Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('URL:', error.config?.url);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Make sure to run: npm run dev');
      console.error('And that the server is accessible at http://localhost:5000');
    } else {
      console.error('Error:', error.message);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: npm run dev');
    console.log('2. Check MongoDB connection');
    console.log('3. Verify all model and route files exist');
    console.log('4. Check for any error messages in the server logs');
  }
}

// Run the test
console.log('🚀 Starting MERN Stack API Tests...\n');
testAPI();
// Simple test script to verify delete functionality
// Run this with: node test-delete.js

const axios = require('axios');

const baseURL = 'http://localhost:5000/api/v1';

async function testDeleteEndpoint() {
  try {
    console.log('🧪 Testing DELETE endpoint...');
    
    // First, try to get all technologies to see if any exist
    console.log('📋 Fetching technologies...');
    const getResponse = await axios.get(`${baseURL}/admin/technologies`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ GET response:', {
      status: getResponse.status,
      dataLength: getResponse.data?.data?.length || 0
    });
    
    if (getResponse.data?.data?.length > 0) {
      const firstTech = getResponse.data.data[0];
      console.log('🎯 Found technology to test delete:', {
        id: firstTech._id,
        name: firstTech.name
      });
      
      // Try to delete it
      console.log('🗑️ Attempting to delete...');
      const deleteResponse = await axios.delete(`${baseURL}/admin/technologies/${firstTech._id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ DELETE response:', {
        status: deleteResponse.status,
        data: deleteResponse.data
      });
    } else {
      console.log('ℹ️ No technologies found to test delete');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testDeleteEndpoint();

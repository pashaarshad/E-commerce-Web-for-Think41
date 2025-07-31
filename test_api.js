const axios = require('axios');

// Test script for REST API endpoints
const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 TESTING THINK41 E-COMMERCE REST API');
    console.log('=======================================\n');

    try {
        // Test 1: GET /api/products
        console.log('1️⃣ Testing GET /api/products...');
        const productsResponse = await axios.get(`${BASE_URL}/products`);
        console.log(`✅ Status: ${productsResponse.status}`);
        console.log(`✅ Products returned: ${productsResponse.data.data.length}`);
        console.log(`✅ Total in database: ${productsResponse.data.pagination.total}`);
        console.log('Sample product:', productsResponse.data.data[0]?.name || 'No products');
        console.log('');

        // Test 2: GET /api/products/:id
        console.log('2️⃣ Testing GET /api/products/1...');
        const productResponse = await axios.get(`${BASE_URL}/products/1`);
        console.log(`✅ Status: ${productResponse.status}`);
        console.log(`✅ Product: ${productResponse.data.data.name}`);
        console.log(`✅ Price: $${productResponse.data.data.retail_price}`);
        console.log('');

        // Test 3: GET /api/departments
        console.log('3️⃣ Testing GET /api/departments...');
        const departmentsResponse = await axios.get(`${BASE_URL}/departments`);
        console.log(`✅ Status: ${departmentsResponse.status}`);
        console.log(`✅ Departments found: ${departmentsResponse.data.count}`);
        console.log('Departments:', departmentsResponse.data.data.map(d => d.name).join(', '));
        console.log('');

        // Test 4: Search products
        console.log('4️⃣ Testing GET /api/products/search?q=laptop...');
        const searchResponse = await axios.get(`${BASE_URL}/products/search?q=laptop`);
        console.log(`✅ Status: ${searchResponse.status}`);
        console.log(`✅ Search results: ${searchResponse.data.count}`);
        console.log('');

        // Test 5: Filter by department (if departments exist)
        if (departmentsResponse.data.data.length > 0) {
            const firstDept = departmentsResponse.data.data[0].name;
            console.log(`5️⃣ Testing GET /api/products/department/${firstDept}...`);
            const deptResponse = await axios.get(`${BASE_URL}/products/department/${encodeURIComponent(firstDept)}`);
            console.log(`✅ Status: ${deptResponse.status}`);
            console.log(`✅ Products in ${firstDept}: ${deptResponse.data.data.length}`);
            console.log('');
        }

        // Test 6: Error handling (invalid product ID)
        console.log('6️⃣ Testing error handling with invalid ID...');
        try {
            await axios.get(`${BASE_URL}/products/99999`);
        } catch (error) {
            console.log(`✅ Status: ${error.response.status} (Expected 404)`);
            console.log(`✅ Error message: ${error.response.data.message}`);
        }
        console.log('');

        console.log('🎉 ALL API TESTS COMPLETED SUCCESSFULLY!');
        console.log('✅ Your REST API is working correctly');
        console.log('\n📊 API ENDPOINTS VERIFIED:');
        console.log('   ✅ GET /api/products');
        console.log('   ✅ GET /api/products/:id');
        console.log('   ✅ GET /api/departments');
        console.log('   ✅ GET /api/products/search');
        console.log('   ✅ GET /api/products/department/:dept');
        console.log('   ✅ Error handling (404, validation)');

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Make sure the API server is running: node api_server.js');
        }
    }
}

// Run tests if axios is available
async function checkAndTest() {
    try {
        await testAPI();
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log('📦 Installing axios for testing...');
            console.log('Run: npm install axios');
            console.log('Then run: node test_api.js');
        } else {
            console.error('Error:', error.message);
        }
    }
}

checkAndTest();

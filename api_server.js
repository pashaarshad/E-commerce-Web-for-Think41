const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize SQLite database connection
const db = new sqlite3.Database('ecommerce.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database for API server');
    }
});

// ==============================================
// MILESTONE 2: REST API FOR PRODUCTS
// ==============================================

// Required API Endpoints:

// 1. GET /api/products - List all products (with pagination if needed)
app.get('/api/products', (req, res) => {
    console.log('GET /api/products - Fetching all products');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    db.get('SELECT COUNT(*) as total FROM products', (err, countResult) => {
        if (err) {
            console.error('Error counting products:', err.message);
            return res.status(500).json({ 
                error: 'Internal server error',
                message: err.message 
            });
        }
        
        // Get products with pagination
        const query = `
            SELECT 
                id,
                cost,
                category,
                name,
                brand,
                retail_price,
                department,
                sku,
                distribution_center_id,
                image_url
            FROM products 
            ORDER BY id 
            LIMIT ? OFFSET ?
        `;
        
        db.all(query, [limit, offset], (err, rows) => {
            if (err) {
                console.error('Error fetching products:', err.message);
                return res.status(500).json({ 
                    error: 'Internal server error',
                    message: err.message 
                });
            }
            
            // Return proper JSON response format
            res.json({
                success: true,
                data: rows,
                pagination: {
                    page: page,
                    limit: limit,
                    total: countResult.total,
                    totalPages: Math.ceil(countResult.total / limit)
                },
                message: `Retrieved ${rows.length} products`
            });
            
            console.log(`✅ Returned ${rows.length} products (page ${page})`);
        });
    });
});

// 2. GET /api/products/:id - Get a specific product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    console.log(`GET /api/products/${productId} - Fetching specific product`);
    
    // Validate ID is a number
    if (isNaN(productId)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid product ID',
            message: 'Product ID must be a number'
        });
    }
    
    const query = `
        SELECT 
            id,
            cost,
            category,
            name,
            brand,
            retail_price,
            department,
            sku,
            distribution_center_id,
            image_url
        FROM products 
        WHERE id = ?
    `;
    
    db.get(query, [productId], (err, row) => {
        if (err) {
            console.error('Error fetching product:', err.message);
            return res.status(500).json({ 
                error: 'Internal server error',
                message: err.message 
            });
        }
        
        if (!row) {
            console.log(`❌ Product ${productId} not found`);
            return res.status(404).json({
                success: false,
                error: 'Product not found',
                message: `Product with ID ${productId} does not exist`
            });
        }
        
        // Return proper JSON response format
        res.json({
            success: true,
            data: row,
            message: `Product ${productId} retrieved successfully`
        });
        
        console.log(`✅ Product ${productId} (${row.name}) retrieved successfully`);
    });
});

// Additional helpful endpoints for better API functionality:

// 3. GET /api/products/search - Search products by name, brand, or category
app.get('/api/products/search', (req, res) => {
    const searchTerm = req.query.q;
    console.log(`GET /api/products/search?q=${searchTerm} - Searching products`);
    
    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            error: 'Missing search query',
            message: 'Please provide a search term using ?q=searchterm'
        });
    }
    
    const query = `
        SELECT 
            id,
            cost,
            category,
            name,
            brand,
            retail_price,
            department,
            sku,
            distribution_center_id,
            image_url
        FROM products 
        WHERE 
            name LIKE ? OR 
            brand LIKE ? OR 
            category LIKE ? OR
            department LIKE ?
        ORDER BY name
        LIMIT 50
    `;
    
    const searchPattern = `%${searchTerm}%`;
    
    db.all(query, [searchPattern, searchPattern, searchPattern, searchPattern], (err, rows) => {
        if (err) {
            console.error('Error searching products:', err.message);
            return res.status(500).json({ 
                error: 'Internal server error',
                message: err.message 
            });
        }
        
        res.json({
            success: true,
            data: rows,
            searchTerm: searchTerm,
            count: rows.length,
            message: `Found ${rows.length} products matching "${searchTerm}"`
        });
        
        console.log(`✅ Search for "${searchTerm}" returned ${rows.length} results`);
    });
});

// 4. GET /api/departments - List all departments (for filtering)
app.get('/api/departments', (req, res) => {
    console.log('GET /api/departments - Fetching all departments');
    
    db.all('SELECT * FROM departments ORDER BY name', (err, rows) => {
        if (err) {
            console.error('Error fetching departments:', err.message);
            return res.status(500).json({ 
                error: 'Internal server error',
                message: err.message 
            });
        }
        
        res.json({
            success: true,
            data: rows,
            count: rows.length,
            message: `Retrieved ${rows.length} departments`
        });
        
        console.log(`✅ Returned ${rows.length} departments`);
    });
});

// 5. GET /api/products/department/:department - Filter products by department
app.get('/api/products/department/:department', (req, res) => {
    const department = req.params.department;
    console.log(`GET /api/products/department/${department} - Filtering by department`);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Get count for this department
    db.get('SELECT COUNT(*) as total FROM products WHERE department = ?', [department], (err, countResult) => {
        if (err) {
            console.error('Error counting products by department:', err.message);
            return res.status(500).json({ 
                error: 'Internal server error',
                message: err.message 
            });
        }
        
        // Get products for this department
        const query = `
            SELECT 
                id,
                cost,
                category,
                name,
                brand,
                retail_price,
                department,
                sku,
                distribution_center_id,
                image_url
            FROM products 
            WHERE department = ?
            ORDER BY name
            LIMIT ? OFFSET ?
        `;
        
        db.all(query, [department, limit, offset], (err, rows) => {
            if (err) {
                console.error('Error fetching products by department:', err.message);
                return res.status(500).json({ 
                    error: 'Internal server error',
                    message: err.message 
                });
            }
            
            res.json({
                success: true,
                data: rows,
                department: department,
                pagination: {
                    page: page,
                    limit: limit,
                    total: countResult.total,
                    totalPages: Math.ceil(countResult.total / limit)
                },
                message: `Retrieved ${rows.length} products from ${department} department`
            });
            
            console.log(`✅ Returned ${rows.length} products from ${department} department`);
        });
    });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Think41 E-Commerce REST API',
        version: '1.0.0',
        endpoints: {
            'GET /api/products': 'List all products (with pagination)',
            'GET /api/products/:id': 'Get specific product by ID',
            'GET /api/products/search?q=term': 'Search products',
            'GET /api/departments': 'List all departments',
            'GET /api/products/department/:dept': 'Filter products by department'
        },
        example_urls: [
            'http://localhost:3000/api/products',
            'http://localhost:3000/api/products/1',
            'http://localhost:3000/api/products/search?q=laptop',
            'http://localhost:3000/api/departments',
            'http://localhost:3000/api/products/department/Electronics'
        ]
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) {
            return res.status(500).json({
                status: 'unhealthy',
                database: 'error',
                error: err.message
            });
        }
        
        res.json({
            status: 'healthy',
            database: 'connected',
            products_count: row.count,
            timestamp: new Date().toISOString()
        });
    });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        message: `The endpoint ${req.originalUrl} does not exist`,
        available_endpoints: [
            'GET /api/products',
            'GET /api/products/:id',
            'GET /api/products/search',
            'GET /api/departments',
            'GET /api/products/department/:department'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('\n🚀 Think41 E-Commerce REST API Server Started!');
    console.log('================================================');
    console.log(`📡 Server running at: http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
    console.log('\n📋 Available API Endpoints:');
    console.log('   GET /api/products              - List all products');
    console.log('   GET /api/products/:id          - Get specific product');
    console.log('   GET /api/products/search?q=... - Search products');
    console.log('   GET /api/departments           - List departments');
    console.log('   GET /api/products/department/... - Filter by department');
    console.log('\n💡 Example API calls:');
    console.log(`   curl http://localhost:${PORT}/api/products`);
    console.log(`   curl http://localhost:${PORT}/api/products/1`);
    console.log(`   curl http://localhost:${PORT}/api/departments`);
    console.log('\n🎯 Ready for testing with Postman or browser!');
    console.log('================================================\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});

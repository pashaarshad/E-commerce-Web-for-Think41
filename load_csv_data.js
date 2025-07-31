const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Read and parse CSV file
function parseCSV(filePath) {
    const csvData = fs.readFileSync(filePath, 'utf8');
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    const products = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',');
            const product = {};
            headers.forEach((header, index) => {
                product[header.trim()] = values[index] ? values[index].trim() : '';
            });
            products.push(product);
        }
    }
    return products;
}

// Initialize database with real CSV data
function loadCSVData() {
    const db = new sqlite3.Database('ecommerce.db');
    
    // Create tables
    db.serialize(() => {
        // Drop existing tables to start fresh
        db.run('DROP TABLE IF EXISTS products');
        db.run('DROP TABLE IF EXISTS departments');
        
        // Create departments table
        db.run(`CREATE TABLE departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )`);

        // Create products table based on CSV structure
        db.run(`CREATE TABLE products (
            id INTEGER PRIMARY KEY,
            cost REAL,
            category TEXT,
            name TEXT NOT NULL,
            brand TEXT,
            retail_price REAL,
            department TEXT,
            sku TEXT,
            distribution_center_id INTEGER,
            image_url TEXT
        )`);

        // Parse CSV data
        const products = parseCSV('products_real.csv');
        console.log(`Found ${products.length} products in CSV`);

        // Get unique departments
        const departments = [...new Set(products.map(p => p.department))].filter(d => d);
        console.log('Departments found:', departments);

        // Insert departments
        const insertDept = db.prepare('INSERT INTO departments (name) VALUES (?)');
        departments.forEach(dept => {
            insertDept.run(dept);
        });
        insertDept.finalize();

        // Insert products (limit to first 100 for demo)
        const insertProduct = db.prepare(`
            INSERT INTO products (id, cost, category, name, brand, retail_price, department, sku, distribution_center_id, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Add some sample images for demonstration
        const sampleImages = [
            'images/apply_laptop.png',
            'images/laptopes and phone.png'
        ];

        products.slice(0, 100).forEach((product, index) => {
            // Assign sample images randomly
            const imageUrl = sampleImages[index % sampleImages.length];
            
            insertProduct.run(
                product.id,
                parseFloat(product.cost) || 0,
                product.category || '',
                product.name || 'Unknown Product',
                product.brand || '',
                parseFloat(product.retail_price) || 0,
                product.department || '',
                product.sku || '',
                parseInt(product.distribution_center_id) || 0,
                imageUrl
            );
        });
        insertProduct.finalize();

        console.log('Data loaded successfully!');
        
        // Verify data was loaded
        db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Total products loaded: ${row.count}`);
            }
            db.close();
        });
    });
}

// Run the data loading
loadCSVData();

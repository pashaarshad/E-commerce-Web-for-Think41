const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Initialize SQLite database
const db = new sqlite3.Database('ecommerce.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables and sample data
function initializeDatabase() {
    // Create departments table
    db.run(`CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    )`, (err) => {
        if (err) console.error('Error creating departments table:', err.message);
    });

    // Create products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        department_id INTEGER,
        description TEXT,
        image_url TEXT,
        FOREIGN KEY (department_id) REFERENCES departments (id)
    )`, (err) => {
        if (err) console.error('Error creating products table:', err.message);
        else insertSampleData();
    });
}

// Insert sample data
function insertSampleData() {
    const departments = ['Electronics', 'Clothing', 'Home Appliances', 'Books', 'Sports'];
    
    // Insert departments
    const insertDept = db.prepare('INSERT OR IGNORE INTO departments (name) VALUES (?)');
    departments.forEach(dept => {
        insertDept.run(dept);
    });
    insertDept.finalize();

    // Insert sample products
    const products = [
        { name: 'Laptop', price: 1200, dept: 'Electronics', desc: 'High-performance laptop for work and gaming' },
        { name: 'Smartphone', price: 800, dept: 'Electronics', desc: 'Latest smartphone with advanced features' },
        { name: 'T-Shirt', price: 25, dept: 'Clothing', desc: 'Comfortable cotton t-shirt' },
        { name: 'Jeans', price: 60, dept: 'Clothing', desc: 'Stylish denim jeans' },
        { name: 'Coffee Maker', price: 80, dept: 'Home Appliances', desc: 'Automatic coffee maker' },
        { name: 'Blender', price: 60, dept: 'Home Appliances', desc: 'High-speed blender for smoothies' },
        { name: 'Programming Book', price: 45, dept: 'Books', desc: 'Learn programming fundamentals' },
        { name: 'Basketball', price: 35, dept: 'Sports', desc: 'Professional basketball' }
    ];

    db.serialize(() => {
        products.forEach(product => {
            db.get('SELECT id FROM departments WHERE name = ?', [product.dept], (err, row) => {
                if (row) {
                    db.run('INSERT OR IGNORE INTO products (name, price, department_id, description) VALUES (?, ?, ?, ?)', 
                        [product.name, product.price, row.id, product.desc]);
                }
            });
        });
    });
}
// API Routes the api 

// Get all departments
app.get('/api/departments', (req, res) => {
    db.all('SELECT * FROM departments', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get all products
app.get('/api/products', (req, res) => {
    const query = `
        SELECT p.*, d.name as department_name 
        FROM products p 
        JOIN departments d ON p.department_id = d.id
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get products by department
app.get('/api/products/department/:departmentId', (req, res) => {
    const departmentId = req.params.departmentId;
    const query = `
        SELECT p.*, d.name as department_name 
        FROM products p 
        JOIN departments d ON p.department_id = d.id 
        WHERE p.department_id = ?
    `;
    
    db.all(query, [departmentId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add new product
app.post('/api/products', (req, res) => {
    const { name, price, department_id, description } = req.body;
    
    db.run('INSERT INTO products (name, price, department_id, description) VALUES (?, ?, ?, ?)',
        [name, price, department_id, description], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Gracefully close database connection
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

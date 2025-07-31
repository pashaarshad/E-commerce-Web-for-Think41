const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('ecommerce.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database');
});

// Display all database contents
function displayDatabase() {
    console.log('\n📊 E-COMMERCE DATABASE CONTENTS');
    console.log('=====================================\n');
    
    // Show departments
    db.all('SELECT * FROM departments', (err, departments) => {
        if (err) {
            console.error('Error fetching departments:', err);
            return;
        }
        
        console.log('🏢 DEPARTMENTS:');
        console.log('---------------');
        if (departments.length === 0) {
            console.log('No departments found');
        } else {
            departments.forEach(dept => {
                console.log(`ID: ${dept.id}, Name: ${dept.name}`);
            });
        }
        
        // Show products
        console.log('\n🛍️  PRODUCTS:');
        console.log('-------------');
        
        db.all('SELECT * FROM products LIMIT 20', (err, products) => {
            if (err) {
                console.error('Error fetching products:', err);
                return;
            }
            
            if (products.length === 0) {
                console.log('No products found');
            } else {
                products.forEach(product => {
                    console.log(`\n📦 Product ID: ${product.id}`);
                    console.log(`   Name: ${product.name}`);
                    console.log(`   Brand: ${product.brand || 'N/A'}`);
                    console.log(`   Category: ${product.category || 'N/A'}`);
                    console.log(`   Department: ${product.department || 'N/A'}`);
                    console.log(`   Cost: $${product.cost || 0}`);
                    console.log(`   Retail Price: $${product.retail_price || 0}`);
                    console.log(`   SKU: ${product.sku || 'N/A'}`);
                    console.log(`   Image: ${product.image_url || 'N/A'}`);
                });
                
                if (products.length === 20) {
                    console.log('\n... (showing first 20 products only)');
                }
            }
            
            // Show counts
            console.log('\n📊 DATABASE STATISTICS:');
            console.log('----------------------');
            
            db.get('SELECT COUNT(*) as count FROM departments', (err, deptCount) => {
                if (!err) {
                    console.log(`Total Departments: ${deptCount.count}`);
                }
                
                db.get('SELECT COUNT(*) as count FROM products', (err, prodCount) => {
                    if (!err) {
                        console.log(`Total Products: ${prodCount.count}`);
                    }
                    
                    // Show products by department
                    db.all(`
                        SELECT department, COUNT(*) as count 
                        FROM products 
                        WHERE department IS NOT NULL AND department != '' 
                        GROUP BY department 
                        ORDER BY count DESC
                    `, (err, deptStats) => {
                        if (!err && deptStats.length > 0) {
                            console.log('\n📈 PRODUCTS BY DEPARTMENT:');
                            console.log('--------------------------');
                            deptStats.forEach(stat => {
                                console.log(`${stat.department}: ${stat.count} products`);
                            });
                        }
                        
                        console.log('\n✅ Database display complete!\n');
                        db.close();
                    });
                });
            });
        });
    });
}

// Run the display function
displayDatabase();

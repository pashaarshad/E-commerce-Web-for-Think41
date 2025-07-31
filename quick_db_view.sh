#!/bin/bash

echo "🗄️  E-Commerce Database Quick View"
echo "=================================="

# Check if database exists
if [ ! -f "ecommerce.db" ]; then
    echo "❌ Database file 'ecommerce.db' not found!"
    echo "💡 Run 'node load_csv_data.js' first to create the database"
    exit 1
fi

# Display database contents using sqlite3 command line
echo ""
echo "📊 DEPARTMENTS:"
echo "---------------"
sqlite3 ecommerce.db "SELECT 'ID: ' || id || ', Name: ' || name FROM departments;"

echo ""
echo "🛍️  PRODUCTS (First 10):"
echo "------------------------"
sqlite3 ecommerce.db "SELECT 
    '📦 ' || name || ' (' || COALESCE(brand, 'No Brand') || ')' || 
    ' - $' || COALESCE(retail_price, cost, 0) || 
    ' [' || COALESCE(department, 'No Dept') || ']'
FROM products LIMIT 10;"

echo ""
echo "📈 STATISTICS:"
echo "--------------"
sqlite3 ecommerce.db "SELECT 'Total Departments: ' || COUNT(*) FROM departments;"
sqlite3 ecommerce.db "SELECT 'Total Products: ' || COUNT(*) FROM products;"

echo ""
echo "🏢 PRODUCTS BY DEPARTMENT:"
echo "-------------------------"
sqlite3 ecommerce.db "SELECT department || ': ' || COUNT(*) || ' products' 
FROM products 
WHERE department IS NOT NULL AND department != '' 
GROUP BY department 
ORDER BY COUNT(*) DESC 
LIMIT 10;"

echo ""
echo "✅ Database view complete!"

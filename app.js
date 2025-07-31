// API base URL
const API_BASE = 'http://localhost:3000/api';

// Global data storage
let products = [];
let departments = [];

// Fetch data from API
async function fetchDepartments() {
    try {
        const response = await fetch(`${API_BASE}/departments`);
        const data = await response.json();
        departments = [{ id: 'all', name: 'All' }, ...data];
        renderDepartments();
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function fetchProductsByDepartment(departmentId) {
    try {
        const response = await fetch(`${API_BASE}/products/department/${departmentId}`);
        const filteredProducts = await response.json();
        renderProducts(filteredProducts);
    } catch (error) {
        console.error('Error fetching products by department:', error);
    }
}

function renderDepartments() {
    const departmentList = document.getElementById('department-list');
    departmentList.innerHTML = '';
    departments.forEach(dept => {
        const div = document.createElement('div');
        div.className = 'department';
        div.textContent = dept.name;
        div.onclick = () => filterProducts(dept.id, dept.name);
        departmentList.appendChild(div);
    });
}

function renderProducts(productList = products) {
    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = '';
    productList.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Department: ${product.department_name}</p>
            <p>Description: ${product.description || 'No description available'}</p>
        `;
        productListElement.appendChild(div);
    });
}

function filterProducts(departmentId, departmentName) {
    if (departmentId === 'all') {
        renderProducts(products);
    } else {
        fetchProductsByDepartment(departmentId);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await fetchDepartments();
    await fetchProducts();
});

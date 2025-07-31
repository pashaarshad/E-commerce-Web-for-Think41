// Sample data for demonstration
const products = [
    { id: 1, name: "Laptop", price: 1200, department: "Electronics" },
    { id: 2, name: "T-Shirt", price: 25, department: "Clothing" },
    { id: 3, name: "Coffee Maker", price: 80, department: "Home Appliances" },
    { id: 4, name: "Headphones", price: 150, department: "Electronics" },
    { id: 5, name: "Sneakers", price: 90, department: "Clothing" },
    { id: 6, name: "Blender", price: 60, department: "Home Appliances" }
];

const departments = [
    "All",
    ...Array.from(new Set(products.map(p => p.department)))
];

function renderDepartments() {
    const departmentList = document.getElementById('department-list');
    departmentList.innerHTML = '';
    departments.forEach(dep => {
        const div = document.createElement('div');
        div.className = 'department';
        div.textContent = dep;
        div.onclick = () => filterProducts(dep);
        departmentList.appendChild(div);
    });
}

function renderProducts(filtered = products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    filtered.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `<h3>${product.name}</h3><p>Price: $${product.price}</p><p>Department: ${product.department}</p>`;
        productList.appendChild(div);
    });
}

function filterProducts(department) {
    if (department === "All") {
        renderProducts(products);
    } else {
        renderProducts(products.filter(p => p.department === department));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderDepartments();
    renderProducts();
});

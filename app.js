// E-Commerce App with SQLite Integration
class ECommerceApp {
    constructor() {
        this.currentFilter = 'All';
        this.products = [];
        this.departments = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderDepartmentFilters();
        this.renderDepartmentCards();
        this.renderProducts();
        this.setupSearchListener();
    }

    async loadData() {
        try {
            // Show loading
            this.showLoading(true);

            // Fetch products from server
            const productsResponse = await fetch('http://localhost:3000/api/products');
            if (productsResponse.ok) {
                this.products = await productsResponse.json();
            }

            // Fetch departments from server
            const departmentsResponse = await fetch('http://localhost:3000/api/departments');
            if (departmentsResponse.ok) {
                this.departments = await departmentsResponse.json();
            }

            // Hide loading
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showLoading(false);
            // Fallback to sample data if server is not available
            this.loadSampleData();
        }
    }

    loadSampleData() {
        console.log('Loading sample data - server not available');
        this.products = [
            { 
                id: 1, 
                name: "MacBook Pro", 
                price: 1299, 
                department_name: "Electronics", 
                description: "High-performance laptop for professionals",
                image_url: "images/apply_laptop.png"
            },
            { 
                id: 2, 
                name: "iPhone 15", 
                price: 999, 
                department_name: "Electronics", 
                description: "Latest smartphone with advanced features",
                image_url: "images/laptopes and phone.png"
            },
            { 
                id: 3, 
                name: "Gaming Laptop", 
                price: 1599, 
                department_name: "Electronics", 
                description: "High-end gaming laptop",
                image_url: "images/apply_laptop.png"
            },
            { 
                id: 4, 
                name: "Smartphone Bundle", 
                price: 799, 
                department_name: "Electronics", 
                description: "Smartphone with accessories",
                image_url: "images/laptopes and phone.png"
            }
        ];

        this.departments = [
            { id: 1, name: "Electronics", count: 4 },
            { id: 2, name: "Clothing", count: 0 },
            { id: 3, name: "Home", count: 0 }
        ];
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.toggle('hidden', !show);
        }
    }

    renderDepartmentFilters() {
        const container = document.getElementById('department-filter');
        if (!container) return;

        container.innerHTML = '';
        
        // Add "All" filter
        const allBtn = this.createFilterButton('All', true);
        container.appendChild(allBtn);

        // Add department filters
        this.departments.forEach(dept => {
            const btn = this.createFilterButton(dept.name, false);
            container.appendChild(btn);
        });
    }

    createFilterButton(name, isActive) {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${isActive ? 'active' : ''}`;
        btn.textContent = name;
        btn.onclick = () => this.filterProducts(name);
        return btn;
    }

    renderDepartmentCards() {
        const container = document.getElementById('department-cards');
        if (!container) return;

        container.innerHTML = '';

        const departmentIcons = {
            'Electronics': 'fas fa-laptop',
            'Clothing': 'fas fa-tshirt',
            'Home': 'fas fa-home',
            'Books': 'fas fa-book',
            'Sports': 'fas fa-football-ball',
            'Beauty': 'fas fa-heart'
        };

        this.departments.forEach(dept => {
            const card = document.createElement('div');
            card.className = 'department-card';
            card.onclick = () => this.filterProducts(dept.name);
            
            card.innerHTML = `
                <div class="department-icon">
                    <i class="${departmentIcons[dept.name] || 'fas fa-box'}"></i>
                </div>
                <div class="department-name">${dept.name}</div>
                <div class="department-count">${dept.count || 0} products</div>
            `;
            
            container.appendChild(card);
        });
    }

    renderProducts(filteredProducts = this.products) {
        const container = document.getElementById('product-grid');
        if (!container) return;

        container.innerHTML = '';

        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #6c757d;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No products found matching your criteria.</p>
                </div>
            `;
            return;
        }

        filteredProducts.forEach(product => {
            const card = this.createProductCard(product);
            container.appendChild(card);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const imageUrl = product.image_url || this.getDefaultImage(product.department_name);
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}" onerror="this.src='images/apply_laptop.png'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-description">${product.description || 'No description available'}</div>
                <div class="product-department">${product.department_name || 'General'}</div>
            </div>
        `;

        return card;
    }

    getDefaultImage(department) {
        const defaultImages = {
            'Electronics': 'images/apply_laptop.png',
            'Clothing': 'images/apply_laptop.png',
            'Home': 'images/apply_laptop.png'
        };
        return defaultImages[department] || 'images/apply_laptop.png';
    }

    filterProducts(department) {
        this.currentFilter = department;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === department);
        });

        // Filter and render products
        let filtered = this.products;
        if (department !== 'All') {
            filtered = this.products.filter(product => 
                product.department_name === department
            );
        }

        this.renderProducts(filtered);
    }

    setupSearchListener() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            let filtered = this.products;

            if (query) {
                filtered = this.products.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query) ||
                    product.department_name.toLowerCase().includes(query)
                );
            }

            // Apply current department filter if not "All"
            if (this.currentFilter !== 'All') {
                filtered = filtered.filter(product => 
                    product.department_name === this.currentFilter
                );
            }

            this.renderProducts(filtered);
        });
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    const app = new ECommerceApp();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            ctaButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                ctaButton.style.transform = '';
            }, 150);
        });
    }
});

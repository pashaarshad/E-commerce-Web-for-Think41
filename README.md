# Think41 E-Commerce Web Application

A modern, responsive e-commerce website built with HTML, CSS, JavaScript, and SQLite database.

## Features

✨ **Modern UI/UX Design**
- Responsive design that works on all devices
- Beautiful gradient backgrounds and smooth animations
- Interactive product cards with hover effects
- Clean typography and professional layout

🛍️ **E-Commerce Functionality**
- Product catalog with search functionality
- Department-based filtering
- Real-time search with instant results
- Product cards with images, prices, and descriptions

🗄️ **Database Integration**
- SQLite database for data storage
- RESTful API endpoints
- Real CSV data integration
- Separate departments and products tables

📱 **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Fast loading and smooth scrolling

## Project Structure

```
E-commerce-Web-for-Think41/
├── index.html          # Main HTML file with modern UI
├── styles.css          # Enhanced CSS with modern design
├── app.js             # JavaScript application logic
├── server.js          # Node.js/Express server with SQLite
├── package.json       # Node.js dependencies
├── start.sh           # Startup script
├── images/            # Product images
│   ├── apply_laptop.png
│   └── laptopes and phone.png
├── products.csv       # Real product data
└── ecommerce.db       # SQLite database (created automatically)
```

## Installation & Setup

### Prerequisites
- Node.js (v12 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Clone or download the project**
   ```bash
   cd E-commerce-Web-for-Think41
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   # Option 1: Use the startup script
   ./start.sh
   
   # Option 2: Start manually
   node server.js
   ```

4. **View the website**
   - **With server**: Open http://localhost:3000 in your browser
   - **Direct file**: Open `index.html` directly in your browser

## API Endpoints

The server provides the following RESTful API endpoints:

- `GET /api/products` - Get all products
- `GET /api/departments` - Get all departments
- `GET /api/products/department/:id` - Get products by department

## Technology Stack

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Styling**: Custom CSS with Google Fonts and Font Awesome icons
- **Features**: Responsive design, smooth animations, modern UI/UX

## Key Features Demonstrated

### 1. Database Design & Data Loading (Milestone 1)
- ✅ SQLite database with proper schema
- ✅ CSV data import functionality
- ✅ Normalized database structure

### 2. REST API for Products (Milestone 2)
- ✅ Express.js server with API endpoints
- ✅ CRUD operations for products
- ✅ JSON response format

### 3. Frontend UI for Products (Milestone 3)
- ✅ Product listing with beautiful cards
- ✅ Product detail views with images
- ✅ Responsive grid layout

### 4. Database Refactoring (Milestone 4)
- ✅ Separate departments table
- ✅ Foreign key relationships
- ✅ Normalized data structure

### 5. Departments API (Milestone 5)
- ✅ Department endpoints
- ✅ Product-department relationships
- ✅ Count of products per department

### 6. Department Filtering (Milestone 6)
- ✅ Interactive department filters
- ✅ Real-time filtering
- ✅ Search functionality

## Usage

### Browsing Products
- View all products on the main page
- Use the search bar to find specific items
- Click on department filters to narrow results

### Department Navigation
- Click on department cards to filter products
- Use the filter buttons at the top of products section
- "All" filter shows all products

### Responsive Experience
- The website adapts to your screen size
- Touch-friendly on mobile devices
- Optimized for desktop, tablet, and mobile

## Images Used

The application showcases two main product images:
1. `apply_laptop.png` - Featured Apple laptop product
2. `laptopes and phone.png` - Laptops and phones collection

These images are integrated throughout the UI to create a visually appealing shopping experience.

## Development

To modify or extend the application:

1. **Frontend changes**: Edit `index.html`, `styles.css`, and `app.js`
2. **Backend changes**: Modify `server.js`
3. **Database changes**: Update the database initialization in `server.js`
4. **Styling**: The CSS uses modern features like CSS Grid, Flexbox, and custom properties

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Performance Features

- Optimized images with proper sizing
- Efficient CSS with minimal reflow
- Fast SQLite database queries
- Minimal JavaScript bundle
- Responsive images for different screen sizes

---

**Created for Think41 E-Commerce Project**  
*A complete e-commerce solution demonstrating modern web development practices*

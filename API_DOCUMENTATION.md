# 📡 Think41 E-Commerce REST API Documentation

## 🌐 Server Information
- **Base URL**: `http://localhost:3000`
- **API Base**: `http://localhost:3000/api`
- **Status**: Production Ready
- **Version**: 1.0.0

## 📍 API Endpoint Locations

### 🔗 Core Product Endpoints

#### 1. **GET /api/products** - List All Products
```
📍 Location: http://localhost:3000/api/products
📋 Purpose: Get all products with pagination
📤 Response: JSON with products array and pagination info
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example URLs:**
```
http://localhost:3000/api/products
http://localhost:3000/api/products?page=2
http://localhost:3000/api/products?page=1&limit=10
```

#### 2. **GET /api/products/:id** - Get Specific Product
```
📍 Location: http://localhost:3000/api/products/{id}
📋 Purpose: Get single product by ID
📤 Response: JSON with single product details
```

**Example URLs:**
```
http://localhost:3000/api/products/1
http://localhost:3000/api/products/25
http://localhost:3000/api/products/100
```

#### 3. **GET /api/products/search** - Search Products
```
📍 Location: http://localhost:3000/api/products/search?q={searchTerm}
📋 Purpose: Search products by name, brand, category
📤 Response: JSON with matching products
```

**Query Parameters:**
- `q` (required): Search term

**Example URLs:**
```
http://localhost:3000/api/products/search?q=laptop
http://localhost:3000/api/products/search?q=apple
http://localhost:3000/api/products/search?q=phone
```

### 🏢 Department Endpoints

#### 4. **GET /api/departments** - List All Departments
```
📍 Location: http://localhost:3000/api/departments
📋 Purpose: Get all available departments
📤 Response: JSON with departments array
```

**Example URL:**
```
http://localhost:3000/api/departments
```

#### 5. **GET /api/products/department/:department** - Filter by Department
```
📍 Location: http://localhost:3000/api/products/department/{departmentName}
📋 Purpose: Get products filtered by department
📤 Response: JSON with filtered products and pagination
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example URLs:**
```
http://localhost:3000/api/products/department/Electronics
http://localhost:3000/api/products/department/Clothing
http://localhost:3000/api/products/department/Home
```

### 📊 Utility Endpoints

#### 6. **GET /api** - API Documentation
```
📍 Location: http://localhost:3000/api
📋 Purpose: Get API documentation and available endpoints
📤 Response: JSON with API info and endpoint list
```

#### 7. **GET /health** - Health Check
```
📍 Location: http://localhost:3000/health
📋 Purpose: Check API server and database status
📤 Response: JSON with health status and database info
```

## 📱 Quick Test Commands

### Using cURL:
```bash
# Test all products
curl http://localhost:3000/api/products

# Test specific product
curl http://localhost:3000/api/products/1

# Test departments
curl http://localhost:3000/api/departments

# Test search
curl "http://localhost:3000/api/products/search?q=laptop"

# Test department filter
curl http://localhost:3000/api/products/department/Electronics

# Test health
curl http://localhost:3000/health
```

### Using Browser:
Just open these URLs in your browser:
```
http://localhost:3000/api/products
http://localhost:3000/api/products/1
http://localhost:3000/api/departments
http://localhost:3000/api/products/search?q=laptop
http://localhost:3000/health
```

## 🔧 Response Format

### Success Response Structure:
```json
{
  "success": true,
  "data": [...],
  "message": "Retrieved X products",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response Structure:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## 🚀 How to Start the API Server

1. **Load Data First:**
```bash
node load_csv_data.js
```

2. **Start API Server:**
```bash
node api_server.js
```

3. **Test API:**
```bash
node test_api.js
```

## 📋 Complete API Endpoint Summary

| Method | Endpoint | Purpose | Example |
|--------|----------|---------|---------|
| GET | `/api/products` | List all products | `http://localhost:3000/api/products` |
| GET | `/api/products/:id` | Get specific product | `http://localhost:3000/api/products/1` |
| GET | `/api/products/search` | Search products | `http://localhost:3000/api/products/search?q=laptop` |
| GET | `/api/departments` | List departments | `http://localhost:3000/api/departments` |
| GET | `/api/products/department/:dept` | Filter by department | `http://localhost:3000/api/products/department/Electronics` |
| GET | `/api` | API documentation | `http://localhost:3000/api` |
| GET | `/health` | Health check | `http://localhost:3000/health` |

## 🎯 Testing with Postman

### Import these endpoints into Postman:

1. **Collection Name**: Think41 E-Commerce API
2. **Base URL**: `http://localhost:3000`

**Requests to add:**
- GET Products: `{{baseUrl}}/api/products`
- GET Product by ID: `{{baseUrl}}/api/products/1`
- Search Products: `{{baseUrl}}/api/products/search?q=laptop`
- GET Departments: `{{baseUrl}}/api/departments`
- Filter by Department: `{{baseUrl}}/api/products/department/Electronics`

## 💡 Important Notes

- Make sure the database is loaded with `node load_csv_data.js` first
- Server must be running with `node api_server.js`
- All responses are in JSON format
- CORS is enabled for frontend integration
- Proper error handling with HTTP status codes
- Pagination supported for large datasets

# E-commerce Backend API Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using a JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### User Management

#### Register User
```http
POST /users/register
```
Request Body:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```
Response:
```json
{
    "success": true,
    "token": "jwt_token_here",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    }
}
```

#### Login User
```http
POST /users/login
```
Request Body:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```
Response:
```json
{
    "success": true,
    "token": "jwt_token_here",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    }
}
```

#### Get User Profile
```http
GET /users/me
```
Headers:
```
Authorization: Bearer <jwt_token>
```
Response:
```json
{
    "success": true,
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    }
}
```

#### Update User Profile
```http
PUT /users/me/update
```
Headers:
```
Authorization: Bearer <jwt_token>
```
Request Body:
```json
{
    "name": "John Updated",
    "email": "john.updated@example.com"
}
```
Response:
```json
{
    "success": true,
    "user": {
        "id": "user_id",
        "name": "John Updated",
        "email": "john.updated@example.com",
        "role": "user"
    }
}
```

### Product Management

#### Get All Products
```http
GET /products
```
Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `brand`: Filter by brand
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `search`: Search term

Response:
```json
{
    "success": true,
    "products": [
        {
            "id": "product_id",
            "name": "Product Name",
            "brand": "Brand Name",
            "category": "Category",
            "description": "Product description",
            "price": 99.99,
            "images": [
                {
                    "filename": "image-123.jpg"
                }
            ],
            "imageUrls": [
                "http://localhost:5000/uploads/image-123.jpg"
            ],
            "rating": 4.5,
            "numReviews": 10,
            "countInStock": 100,
            "sizes": ["S", "M", "L"],
            "colors": [
                {
                    "name": "Red",
                    "hex": "#FF0000"
                }
            ]
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "pages": 10
    }
}
```

#### Get Single Product
```http
GET /products/:id
```
Response:
```json
{
    "success": true,
    "product": {
        "id": "product_id",
        "name": "Product Name",
        "brand": "Brand Name",
        "category": "Category",
        "description": "Product description",
        "price": 99.99,
        "images": [
            {
                "filename": "image-123.jpg"
            }
        ],
        "imageUrls": [
            "http://localhost:5000/uploads/image-123.jpg"
        ],
        "rating": 4.5,
        "numReviews": 10,
        "reviews": [
            {
                "user": "user_id",
                "name": "John Doe",
                "rating": 5,
                "comment": "Great product!",
                "createdAt": "2024-02-20T10:00:00.000Z"
            }
        ],
        "countInStock": 100,
        "sizes": ["S", "M", "L"],
        "colors": [
            {
                "name": "Red",
                "hex": "#FF0000"
            }
        ]
    }
}
```

#### Create Product (Admin Only)
```http
POST /products
```
Headers:
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```
Request Body:
```
name: Product Name
brand: Brand Name
category: Category
description: Product description
price: 99.99
countInStock: 100
sizes: S,M,L
colors: [{"name":"Red","hex":"#FF0000"}]
images: [file1, file2, ...]
```
Response:
```json
{
    "success": true,
    "product": {
        "id": "product_id",
        "name": "Product Name",
        // ... other product fields
    }
}
```

#### Update Product (Admin Only)
```http
PUT /products/:id
```
Headers:
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```
Request Body: Same as Create Product
Response:
```json
{
    "success": true,
    "product": {
        "id": "product_id",
        "name": "Updated Product Name",
        // ... other product fields
    }
}
```

#### Delete Product (Admin Only)
```http
DELETE /products/:id
```
Headers:
```
Authorization: Bearer <jwt_token>
```
Response:
```json
{
    "success": true,
    "message": "Product removed"
}
```

#### Create Product Review
```http
POST /products/:id/reviews
```
Headers:
```
Authorization: Bearer <jwt_token>
```
Request Body:
```json
{
    "rating": 5,
    "comment": "Great product!"
}
```
Response:
```json
{
    "success": true,
    "product": {
        "id": "product_id",
        // ... other product fields with updated review
    }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
    "success": false,
    "error": "Error message here"
}
```

### 401 Unauthorized
```json
{
    "success": false,
    "error": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
    "success": false,
    "error": "Resource not found"
}
```

### 500 Server Error
```json
{
    "success": false,
    "error": "Server error message"
}
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
BASE_URL=http://localhost:5000
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required variables

3. Start development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
``` 
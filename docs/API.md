# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require JWT token:

```
Authorization: Bearer {token}
```

## Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

---

## Authentication Endpoints

### Register

**POST** `/auth/register`

```json
{
  "email": "admin@shop.com",
  "password": "secure_password",
  "name": "Shop Admin",
  "shop_name": "My Fashion Store"
}
```

### Login

**POST** `/auth/login`

```json
{
  "email": "admin@shop.com",
  "password": "secure_password"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@shop.com",
    "name": "Shop Admin",
    "role": "super_admin"
  }
}
```

### Activate License

**POST** `/auth/activate-license`

```json
{
  "licenseKey": "XXXX-XXXX-XXXX-XXXX"
}
```

---

## Product Endpoints

### Get All Products

**GET** `/products?category={id}&skip=0&limit=50`

### Search Products

**GET** `/products/search/{query}`

### Get Product by ID

**GET** `/products/{id}`

### Create Product

**POST** `/products`

```json
{
  "name": "Black Shirt",
  "description": "Premium cotton shirt",
  "sku": "SKU001",
  "barcode": "1234567890",
  "category_id": "uuid",
  "brand": "FashionBrand",
  "cost_price": 10.00,
  "selling_price": 25.00,
  "image_url": "https://..."
}
```

### Update Product

**PUT** `/products/{id}`

### Delete Product

**DELETE** `/products/{id}`

### Add Variant

**POST** `/products/{id}/variants`

```json
{
  "size": "M",
  "color": "Black",
  "sku": "SKU001-M",
  "barcode": "1234567890",
  "quantity": 50,
  "price": 25.00
}
```

---

## Inventory Endpoints

### Get Inventory

**GET** `/inventory`

### Get Low Stock Products

**GET** `/inventory/low-stock?threshold=10`

### Update Stock

**PUT** `/inventory/{variant_id}/update-stock`

```json
{
  "quantity": 10,
  "reason": "manual_adjustment"
}
```

### Get Inventory Analytics

**GET** `/inventory/analytics`

Response:
```json
{
  "totalVariants": 500,
  "totalQuantity": 5000,
  "lowStockCount": 25,
  "outOfStockCount": 5
}
```

---

## Sales Endpoints

### Get All Sales

**GET** `/sales?startDate=2026-01-01&endDate=2026-12-31&skip=0&limit=50`

### Get Sale by ID

**GET** `/sales/{id}`

### Create Sale

**POST** `/sales`

```json
{
  "customer_id": "uuid",
  "items": [
    {
      "variant_id": "uuid",
      "quantity": 2,
      "price": 25.00,
      "subtotal": 50.00
    }
  ],
  "discount": 5.00,
  "tax": 7.50,
  "total_amount": 52.50,
  "payment_method": "cash"
}
```

### Refund Sale

**POST** `/sales/{id}/refund`

### Get Daily Sales Analytics

**GET** `/sales/analytics/daily`

### Get Monthly Sales Analytics

**GET** `/sales/analytics/monthly`

---

## Customer Endpoints

### Get All Customers

**GET** `/customers?skip=0&limit=50`

### Search Customers

**GET** `/customers/search/{query}`

### Get Customer by ID

**GET** `/customers/{id}`

### Create Customer

**POST** `/customers`

```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@email.com"
}
```

### Add Loyalty Points

**POST** `/customers/{id}/add-loyalty-points`

```json
{
  "points": 100
}
```

---

## Employee Endpoints

### Get All Employees

**GET** `/employees`

### Get Employee by ID

**GET** `/employees/{id}`

### Get Activity Log

**GET** `/employees/{id}/activity-log?skip=0&limit=100`

### Get Sales Report

**GET** `/employees/{id}/sales-report?startDate=2026-01-01&endDate=2026-12-31`

### Create Employee

**POST** `/employees`

```json
{
  "email": "cashier@shop.com",
  "password": "secure_password",
  "name": "John Cashier",
  "phone": "+1234567890",
  "role": "cashier"
}
```

---

## Report Endpoints

### Daily Report

**GET** `/reports/daily?date=2026-05-19`

### Weekly Report

**GET** `/reports/weekly`

### Monthly Report

**GET** `/reports/monthly?month=5&year=2026`

### Profit/Loss Report

**GET** `/reports/profit-loss?startDate=2026-01-01&endDate=2026-12-31`

### Best Sellers Report

**GET** `/reports/best-sellers?limit=20`

### Dead Stock Report

**GET** `/reports/dead-stock`

### Export to PDF

**POST** `/reports/export-pdf`

```json
{
  "reportType": "daily",
  "data": {}
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes.

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Testing with cURL

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@retailos.com","password":"password123"}'
```

### Get Products

```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Shirt",
    "sku": "SKU001",
    "selling_price": 25.00,
    "cost_price": 10.00
  }'
```

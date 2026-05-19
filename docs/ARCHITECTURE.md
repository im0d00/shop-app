# Architecture & Technical Documentation

## System Architecture

```
┌─────────────────────────────────────┐
│   Electron Desktop Application      │
│  (React Frontend + Electron Main)   │
└────────────────┬────────────────────┘
                 │
        ┌────────▼────────┐
        │  IPC Bridge     │
        │  (Preload)      │
        └────────┬────────┘
                 │
┌────────────────▼────────────────────┐
│   Node.js Express Backend API       │
│  (Port 5000)                        │
│  - Authentication                   │
│  - Business Logic                   │
│  - Real-time Events (Socket.io)     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   PostgreSQL Database               │
│  (Local Instance)                   │
│  - Persistent Storage               │
│  - Transactions                     │
│  - Backups                          │
└────────────────────────────────────┘
```

## Module Architecture

### Authentication Module
```
auth.routes.js
    ↓
auth.controller.js
    ↓
auth.middleware.js (JWT verification)
    ↓
Password Hashing (bcryptjs)
```

### Inventory Module
```
products.routes.js
    ↓
products.controller.js
    ↓
product.model (DB operations)
    ↓
product_variants table
inventory_logs table
```

### POS/Sales Module
```
sales.routes.js
    ↓
sales.controller.js
    ↓
┌────────┬────────┬──────────┐
│        │        │          │
Cart    Transaction  Inventory
Management Update   Update
```

### Reporting Module
```
reports.routes.js
    ↓
reports.controller.js
    ↓
┌──────────┬─────────┬──────────┐
│          │         │          │
SQL       PDF      Excel      CSV
Queries  Export   Export     Export
```

## Database Schema Relationships

```
users
  ├─ roles
  ├─ permissions
  └─ role_permissions

products
  ├─ categories
  ├─ product_variants
  └─ inventory_logs

sales
  ├─ customers
  ├─ sale_items
  └─ users (created_by)

suppliers
  └─ supplier_orders
      └─ supplier_order_items

licenses
app_settings
backups
```

## API Layer Architecture

### Request Flow
```
Client Request
    ↓
Express Middleware (CORS, JWT, Rate Limit)
    ↓
Route Handler
    ↓
Controller Logic
    ↓
Database Operations
    ↓
Response Serialization
    ↓
JSON Response
```

### Error Handling
```
Try-Catch Block
    ↓
Validate Input
    ↓
Execute Logic
    ↓
Catch Error
    ↓
Return Appropriate HTTP Status
    ↓
Log Error (Development)
```

## Frontend State Management (Zustand)

### Store Structure
```
authStore
  ├─ token
  ├─ user
  ├─ login()
  ├─ logout()
  └─ activateLicense()

productStore
  ├─ products
  ├─ currentProduct
  ├─ getProducts()
  ├─ searchProducts()
  └─ createProduct()

salesStore
  ├─ cartItems
  ├─ sales
  ├─ addToCart()
  ├─ createSale()
  └─ clearCart()
```

## Security Architecture

### Authentication Flow
```
1. User enters credentials
    ↓
2. Validate format
    ↓
3. Query database for user
    ↓
4. Compare password with bcrypt
    ↓
5. Generate JWT token (24h expiry)
    ↓
6. Return token + user info
    ↓
7. Store in localStorage
    ↓
8. Include in all API requests
```

### Authorization Layers
```
Level 1: JWT Middleware (Is user authenticated?)
Level 2: Role-based Middleware (Can user access endpoint?)
Level 3: Resource Ownership (Does user own this resource?)
Level 4: Data Validation (Is input valid?)
```

## Performance Optimizations

### Database Indexes
```sql
-- Search optimization
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);

-- Report optimization
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sales_customer ON sales(customer_id);

-- Inventory optimization
CREATE INDEX idx_variants_product ON product_variants(product_id);
```

### Caching Strategy
```
Frontend (Browser)
  ├─ localStorage: Auth token, user info
  ├─ sessionStorage: Temporary cart
  └─ Memory: Component state (Zustand)

Backend (Optional)
  ├─ Query caching: Frequently accessed data
  ├─ Redis: Session store
  └─ ETags: HTTP caching
```

### Query Optimization
```javascript
// Bad: N+1 query problem
const products = await db.query('SELECT * FROM products');
for (const product of products) {
  const variants = await db.query('SELECT * FROM variants WHERE product_id = $1', [product.id]);
}

// Good: Single query with JOIN
const data = await db.query(`
  SELECT p.*, v.* FROM products p
  LEFT JOIN product_variants v ON p.id = v.product_id
`);
```

## Scalability Considerations

### Horizontal Scaling (Future)
```
┌────────────────┐
│   Load         │
│   Balancer     │
└────────┬───────┘
         │
    ┌────┴────┬─────────┐
    │          │         │
┌───▼──┐  ┌───▼──┐  ┌──▼───┐
│API#1 │  │API#2 │  │API#3 │
└───┬──┘  └───┬──┘  └──┬───┘
    │         │        │
    └─────────┬────────┘
              │
        ┌─────▼─────┐
        │PostgreSQL │
        │ Database  │
        └───────────┘
```

### Database Sharding (Future)
- Shard by shop_id or date
- Consistent hashing for key distribution
- Partition tables for large datasets

## Testing Architecture

### Unit Tests
```javascript
// Test: Product creation
describe('Products', () => {
  it('should create product with valid data', async () => {
    const product = await createProduct({...});
    expect(product.id).toBeDefined();
    expect(product.name).toBe('Black Shirt');
  });
});
```

### Integration Tests
```javascript
// Test: Complete sale workflow
describe('Sales Flow', () => {
  it('should complete sale and update inventory', async () => {
    // 1. Get product
    // 2. Create sale
    // 3. Verify inventory decreased
    // 4. Verify sale recorded
  });
});
```

### E2E Tests
```javascript
// Test: User flow from login to sale
describe('POS Workflow', () => {
  it('user can login, create sale, print receipt', async () => {
    // Simulate complete user journey
  });
});
```

## Deployment Architecture

### Development
```
Local Machine
  ├─ npm start (Concurrently)
  ├─ Backend (localhost:5000)
  ├─ Frontend (localhost:3000)
  └─ PostgreSQL (localhost:5432)
```

### Production (Single Machine)
```
Windows Server
  ├─ PostgreSQL Service
  ├─ Node.js Backend (Windows Service)
  ├─ Electron App (Deployed to clients)
  └─ File Storage (/backups)
```

### Production (Multi-PC LAN)
```
Server PC:
  ├─ PostgreSQL Database
  └─ Node.js Backend

Client PC 1:
  ├─ Electron App
  ├─ Local React Frontend
  └─ Connects to Server DB

Client PC 2:
  ├─ Electron App
  ├─ Local React Frontend
  └─ Connects to Server DB
```

## Monitoring & Logging

### Logging Strategy
```javascript
// Error logging
console.error('Error message:', error);

// Activity logging
await pool.query(
  `INSERT INTO employee_logs (employee_id, action, details) 
   VALUES ($1, $2, $3)`,
  [userId, 'sale_created', JSON.stringify(saleData)]
);

// Audit trail for compliance
await pool.query(
  `INSERT INTO audit_logs (user_id, action, timestamp) 
   VALUES ($1, $2, NOW())`
);
```

### Monitoring Endpoints
```
GET /health → System health check
GET /api/system-info → System information
GET /api/database/status → Database status
GET /api/backups → Backup status
```

## Future Enhancements

### Phase 2 Features
- Cloud synchronization
- Mobile app
- AI-powered recommendations
- Advanced analytics

### Phase 3 Features
- E-commerce integration
- Multi-store management
- Advanced compliance
- RFID support

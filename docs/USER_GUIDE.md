# User Guide

## Getting Started

### Login

1. Open Retail OS Pro application
2. Enter your credentials:
   - Email: Your shop's admin email
   - Password: Your secure password
3. Click "Sign In"

### First Time Setup

1. **Configure Store Settings**
   - Go to Settings → Store Settings
   - Enter shop name, address, phone
   - Set currency and tax rate

2. **Add Product Categories**
   - Go to Inventory → Categories
   - Click "Add Category"
   - Create: Shirts, Pants, Shoes, etc.

3. **Import Products**
   - Go to Inventory → Products
   - Click "Bulk Import"
   - Upload CSV file with products
   - Verify and save

4. **Create User Accounts**
   - Go to Employees
   - Click "Add Employee"
   - Set role (Cashier, Manager)
   - Share credentials securely

## Dashboard

The dashboard shows:
- Daily/Monthly sales figures
- Revenue trends
- Low stock alerts
- Employee activity
- System health status

**Key Metrics**:
- Total Revenue: All sales for the period
- Total Sales: Number of transactions
- Average Order Value: Revenue ÷ Transactions
- Customers: Registered customer count

## Point of Sale (POS)

### Creating a Sale

1. Click "POS" in main menu
2. Select customer (or create new)
3. Scan/search products or add manually
4. Enter quantity
5. Review cart
6. Select payment method (Cash, Card, etc.)
7. Apply discounts if needed
8. Process payment
9. Print receipt

### Barcode Scanning

- Click barcode field
- Scan product barcode
- Quantity auto-defaults to 1
- Press Enter to confirm

### Discounts

- Click "Discount" button
- Enter discount amount or percentage
- System recalculates total

### Split Payment

- Click "Split Payment"
- Enter first payment amount
- Enter payment method
- Confirm and pay remaining

## Inventory Management

### View Inventory

1. Go to Inventory → Stock Levels
2. See all products with current quantities
3. Color coding:
   - Green: Adequate stock
   - Yellow: Low stock
   - Red: Out of stock

### Update Stock

1. Click product
2. Click "Edit Stock"
3. Enter new quantity
4. Select reason (received, adjusted, etc.)
5. Save

### Add Product

1. Go to Inventory → Products
2. Click "Add Product"
3. Fill details:
   - Name, SKU, Barcode
   - Cost price, Selling price
   - Category, Brand
   - Upload image
4. Add variants (sizes, colors)
5. Save

### Bulk Operations

**Import Products**
- Go to Inventory → Bulk Import
- Download template
- Fill spreadsheet
- Upload file
- Verify and import

**Export Inventory**
- Go to Inventory → Export
- Choose format (CSV, Excel)
- Select data range
- Download file

## Customer Management

### Add Customer

1. Go to Customers
2. Click "Add Customer"
3. Enter:
   - Name
   - Phone number
   - Email
4. Save

### View Customer History

1. Click customer name
2. See purchase history
3. View loyalty points
4. Check credit balance

### Loyalty Program

- Customer earns points on purchases
- 1 point per $1 spent (configurable)
- Redeem points for discounts
- View available rewards

## Reports

### Generate Reports

1. Go to Reports
2. Select report type:
   - Daily Sales
   - Weekly Sales
   - Monthly Report
   - Profit/Loss
   - Inventory Status
   - Best Sellers
   - Dead Stock

3. Select date range
4. Click "Generate"
5. View or export

### Export Reports

- PDF: Professional formatted document
- Excel: Spreadsheet for analysis
- CSV: Data for external tools

### Key Reports

**Daily Sales**
- Total transactions
- Revenue
- Average transaction value

**Profit/Loss**
- Total revenue
- Total cost
- Net profit
- Profit margin %

**Best Sellers**
- Top 20 products
- Units sold
- Revenue per product

## Employee Management

### Add Employee

1. Go to Employees
2. Click "Add Employee"
3. Set role:
   - Super Admin: Full access
   - Manager: Inventory & reporting
   - Cashier: POS only
4. Create login credentials
5. Send credentials securely

### Track Activity

1. Click employee name
2. View activity log:
   - Login/logout times
   - Sales created
   - Inventory changes
   - Refunds processed

### Performance Metrics

- Total sales
- Average transaction value
- Login hours
- Actions performed

## Settings

### Store Settings

- Shop name and address
- Currency and tax rate
- Receipt format
- Business hours

### Printer Configuration

1. Go to Settings → Printer
2. Select printer from list
3. Set paper size
4. Test print
5. Save

### User Permissions

1. Go to Settings → Permissions
2. Select user/role
3. Toggle features on/off
4. Save changes

### System Preferences

- Offline mode behavior
- Sync frequency
- Backup schedule
- Log retention

## Backup & Security

### Create Backup

1. Go to Settings → Backup
2. Click "Create Backup Now"
3. Choose location
4. Wait for completion
5. Verify backup file

### Restore Backup

1. Go to Settings → Backup
2. Select backup file
3. Click "Restore"
4. Confirm action
5. Application restarts

### Password Management

- Change your password regularly
- Use strong passwords (12+ characters)
- Enable 2FA if available
- Never share credentials

## Offline Mode

### Working Offline

- App continues to work without internet
- Data syncs when connection restored
- All POS functions available offline
- Reports show local data only

### Syncing Data

- Automatic sync every 5 minutes
- Manual sync: Settings → Sync Now
- Check sync status in top bar
- Conflict resolution: Last write wins

## Local Network Setup

### Connect Multiple PCs

1. Install app on all computers
2. Point to same server in settings
3. Test connectivity
4. Create user accounts
5. Distribute login credentials

### Network Troubleshooting

- Check WiFi/LAN connection
- Ping server: `ping 192.168.1.100`
- Verify database connection
- Check firewall settings

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+N | New Sale |
| Ctrl+S | Save |
| Ctrl+P | Print |
| Ctrl+F | Search |
| Ctrl+E | Export |
| Ctrl+O | Open |
| Esc | Cancel |
| Tab | Next Field |

## FAQs

**Q: How do I reset my password?**
A: Contact your administrator or use "Forgot Password" on login screen.

**Q: Can I use the app offline?**
A: Yes! All features work offline. Changes sync when connected.

**Q: How long are backups kept?**
A: System keeps last 30 daily backups automatically.

**Q: Can I add a custom field to products?**
A: Custom fields can be added through Settings → Custom Fields.

**Q: What's the maximum number of products?**
A: System supports 100,000+ products with minimal performance impact.

## Support

- Email: support@retailospro.com
- Phone: +1-XXX-XXX-XXXX
- Live Chat: Available 9 AM - 6 PM EST
- Documentation: https://retailospro.com/docs

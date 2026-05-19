# Installation & Setup Guide

## Prerequisites

- **Node.js**: v16 or higher
- **PostgreSQL**: v12 or higher
- **Git**: Latest version
- **Windows/macOS/Linux**: Desktop OS

## Step 1: Clone Repository

```bash
git clone https://github.com/im0d00/shop-app.git
cd shop-app
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Setup PostgreSQL Database

### Create Database

```bash
# macOS/Linux
createdb retailos_db

# Windows (using psql)
psql -U postgres
CREATE DATABASE retailos_db;
\q
```

### Initialize Schema

```bash
psql -U postgres -d retailos_db < database/schema.sql
```

### Verify Connection

```bash
psql -U postgres -d retailos_db
\dt  # List all tables
\q
```

## Step 4: Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` file:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/retailos_db

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h

LICENSE_SECRET=your-license-secret-key

BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

BACKUP_DIR=./backups
LOG_DIR=./logs

APP_NAME=Retail OS Pro
APP_VERSION=1.0.0
BUILD_NUMBER=1001
```

## Step 5: Start Development Server

```bash
npm start
```

This will start both:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000` (in Electron)

## Step 6: Default Login Credentials

```
Email: admin@retailos.com
Password: password123
```

## Common Issues & Solutions

### PostgreSQL Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check connection string in `.env`
3. Create user if needed: `createuser -U postgres retailos`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=5001
```

### Missing Dependencies

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Database Reset (Development)

```bash
# Drop and recreate database
dropdb retailos_db
createdb retailos_db
psql -U postgres -d retailos_db < database/schema.sql
```

## Next Steps

1. Configure your store settings
2. Add product categories
3. Import initial inventory
4. Create user accounts
5. Test POS system
6. Generate license key for deployment

## Support

For issues, check:
- GitHub Issues: https://github.com/im0d00/shop-app/issues
- Documentation: `/docs` folder
- Email: support@retailospro.com

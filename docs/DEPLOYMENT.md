# Deployment Guide

## Production Deployment

### System Requirements

- **Windows**: Windows 10/11 or Server 2019+
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 10GB minimum
- **Network**: LAN connectivity for multi-user setup

### Step 1: Prepare Production Environment

```bash
# Clone repository
git clone https://github.com/im0d00/shop-app.git
cd shop-app

# Install dependencies
npm install --production

# Create production .env
cp .env.example .env
```

### Step 2: Update Environment Variables

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://retailos:strong_password@localhost:5432/retailos_db

JWT_SECRET=generate-strong-secret-key-here
JWT_EXPIRY=24h

BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

BACKUP_DIR=/var/retailos/backups
LOG_DIR=/var/retailos/logs

APP_NAME=Retail OS Pro
APP_VERSION=1.0.0
ENABLE_OFFLINE_MODE=true
ENABLE_LOCAL_NETWORK=true
```

### Step 3: Setup PostgreSQL Production Database

```bash
# Create dedicated user
sudo -u postgres createuser retailos

# Create database
sudo -u postgres createdb -O retailos retailos_db

# Restore schema
psql -U retailos -d retailos_db < database/schema.sql
```

### Step 4: Build Desktop Application

```bash
# Build for Windows
npm run build:electron -- --win --publish=never

# Installer will be created in dist/
```

### Step 5: Setup Windows Service (Backend)

#### Option A: Using NSSM (Recommended)

```bash
# Download NSSM
# https://nssm.cc/download

# Install service
nssm install RetailOSBackend "C:\Program Files\nodejs\node.exe" "C:\retailos\src\backend\server.js"
nssm set RetailOSBackend AppDirectory "C:\retailos"
nssm set RetailOSBackend AppEnvironmentExtra PATH=C:\Program Files\nodejs
net start RetailOSBackend
```

#### Option B: Using PM2

```bash
npm install -g pm2

# Create ecosystem.config.js
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

**ecosystem.config.js**:
```javascript
module.exports = {
  apps: [{
    name: 'retailos-backend',
    script: './src/backend/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

### Step 6: Configure Firewall

```bash
# Windows Firewall - Allow port 5000
netsh advfirewall firewall add rule name="Retail OS Backend" \
  dir=in action=allow protocol=tcp localport=5000

# Allow PostgreSQL (internal only)
netsh advfirewall firewall add rule name="PostgreSQL" \
  dir=in action=allow protocol=tcp localport=5432 \
  remoteip=192.168.1.0/24
```

### Step 7: Setup Automatic Backups

```bash
# Create backup script
# File: C:\retailos\backup.ps1

$backupDir = "C:\retailos\backups"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$dbName = "retailos_db"
$fileName = "$backupDir\backup_$timestamp.sql"

Create-Item -ItemType Directory -Force -Path $backupDir

# Using PostgreSQL pg_dump
pg_dump -U retailos -d $dbName > $fileName

# Keep only last 30 backups
Get-ChildItem $backupDir -Filter "backup_*.sql" | 
  Sort-Object CreationTime -Descending | 
  Select-Object -Skip 30 | 
  Remove-Item
```

### Step 8: SSL Certificate Setup (Optional)

```bash
# For local network, create self-signed certificate
OpenSSL req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Update server.js to use HTTPS
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(5000);
```

### Step 9: Health Monitoring

```bash
# Check service status
net start | findstr RetailOS

# Monitor backend
curl http://localhost:5000/health

# Check database
psql -U retailos -d retailos_db -c "SELECT COUNT(*) FROM products;"
```

## Multi-PC LAN Setup

### Server PC (Database Host)

1. Install PostgreSQL
2. Run backend service
3. Configure firewall to allow connections from other PCs
4. Note IP address (e.g., 192.168.1.100)

### Client PCs

1. Install Retail OS Pro desktop app
2. Update `.env` to point to server:
   ```
   DATABASE_URL=postgresql://retailos:password@192.168.1.100:5432/retailos_db
   ```
3. Test connection before going live

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql -U retailos -d retailos_db -c "SELECT 1"

# Check PostgreSQL service
net start | findstr PostgreSQL

# Restart service
net stop PostgreSQL-x64-13
net start PostgreSQL-x64-13
```

### Backend Not Starting

```bash
# Check logs
type logs\error.log

# Verify Node.js
node --version

# Test manual start
node src\backend\server.js
```

### Port Already in Use

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID 1234 /F
```

## Backup & Recovery

### Manual Backup

```bash
psql -U retailos -d retailos_db > backup_2026-05-19.sql
```

### Restore Backup

```bash
psql -U retailos -d retailos_db < backup_2026-05-19.sql
```

## Uninstall

```bash
# Stop service
net stop RetailOSBackend

# Remove service
nssm remove RetailOSBackend confirm

# Remove files
rmdir /s "C:\retailos"

# Drop database
psql -U postgres -c "DROP DATABASE retailos_db;"
```

## Support & Monitoring

- Monitor system logs: `Event Viewer > Windows Logs > Application`
- Check database size: `psql -U retailos -d retailos_db -c "SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) FROM pg_database;"`
- Enable query logging: Add to postgresql.conf

## Version Updates

1. Backup database
2. Stop service
3. Pull latest code: `git pull origin main`
4. Install new dependencies: `npm install`
5. Run migrations if any
6. Restart service
7. Test functionality

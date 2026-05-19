# Retail OS Pro

🚀 **Premium Offline-First Desktop ERP/POS System for Fashion Retail**

A modern, futuristic, enterprise-grade point-of-sale and inventory management system designed specifically for clothing, fashion, and retail boutique stores.

## 🎯 Features

### Core Features
- **Offline-First Architecture**: Works seamlessly without internet after activation
- **Multi-User System**: Support for multiple computers connected via LAN
- **Real-time Synchronization**: Automatic sync across local network
- **Premium UI**: Futuristic, glassmorphism design with smooth animations
- **Role-Based Access Control**: Super Admin, Manager, and Cashier roles

### Modules
- **POS/Billing**: Fast checkout, barcode scanning, thermal printer support
- **Inventory Management**: Product variants, sizes, colors, SKU/barcode generation
- **Employee Tracking**: Login history, activity logs, performance metrics
- **Customer Management**: Loyalty points, purchase history, credit balance
- **Supplier Management**: Purchase orders, supplier tracking, payments
- **Reporting**: Daily/monthly reports, PDF/Excel export
- **Backup System**: Automatic daily backups with encryption
- **License Management**: Yearly license activation and renewal

## 🏗️ Architecture

```
Desktop App (Electron + React)
        ↓
  Local Backend (Node.js + Express)
        ↓
  PostgreSQL Database
        ↓
  Backup Engine & License Validation
```

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI framework
- **Electron**: Desktop application
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Zustand**: State management
- **Recharts**: Data visualization
- **Lucide React**: Icons

### Backend
- **Node.js**: Runtime
- **Express.js**: Server framework
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Socket.io**: Real-time communication

## 📦 Project Structure

```
shop-app/
├── src/
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── pos/
│   │   │   ├── employees/
│   │   │   └── reports/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── api/
│   │   ├── styles/
│   │   └── App.jsx
│   └── backend/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── services/
│       ├── utils/
│       ├── config/
│       └── server.js
├── public/
│   └── electron.js
├── database/
│   ├── schema.sql
│   └── migrations/
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    └── USER_GUIDE.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Windows, macOS, or Linux

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/im0d00/shop-app.git
   cd shop-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**
   ```bash
   createdb retailos_db
   psql retailos_db < database/schema.sql
   ```

5. **Start development**
   ```bash
   npm start
   ```

## 📱 User Roles

### Super Admin
- Full system access
- License management
- Employee permissions
- Database backups
- Financial reports

### Manager
- Inventory management
- Employee supervision
- Sales reports
- Supplier management

### Cashier/Employee
- Create sales
- Barcode scanning
- Inventory viewing
- Receipt printing

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Encrypted local storage
- SQL injection prevention
- Input validation
- Rate limiting
- Secure backup encryption
- Permission-based API access

## 📊 Database Schema

Comprehensive schema including:
- Users and authentication
- Products and variants
- Inventory management
- Sales and transactions
- Employee tracking
- Customer profiles
- Supplier information
- License management

## 🌐 Local Network Support

- One server PC hosts PostgreSQL
- Other PCs connect via LAN/WiFi
- Real-time data synchronization
- Multi-user conflict resolution

## 📄 License

Commercial License - Yearly subscription model

## 📞 Support

For support and inquiries, contact: support@retailospro.com

## 🎨 UI/UX Features

- **Dark Mode**: Optimized for long retail shifts
- **Glassmorphism**: Modern premium aesthetic
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works on tablets and touchscreens
- **Keyboard Shortcuts**: Fast workflow optimization
- **Search Everywhere**: Global search functionality

## 🚀 Future Enhancements

- AI sales prediction
- AI inventory recommendations
- Camera-based inventory scanning
- QR payment systems
- WhatsApp invoice integration
- Mobile app synchronization
- Cloud backup system
- E-commerce integration
- RFID tracking support

---

**Made with ❤️ for retail professionals**

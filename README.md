# 🏢 Hexalyte IMS - Inventory Management System

A comprehensive, modern inventory management system built with React, Node.js, and MySQL. Features advanced order management, barcode scanning, dispatch tracking, and real-time analytics.

## 🌟 Features

### 📦 **Order Management**
- **New Orders**: Create and manage customer orders with product selection
- **Bulk Upload**: Import orders via Excel/CSV with automatic product matching
- **Order Status Tracking**: Complete lifecycle management (Pending → Confirmed → Processing → Shipped → Delivered)
- **Call Status Management**: Track customer communication status

### 🔍 **Advanced Pack Orders**
- **Multi-Mode Barcode Scanner**: Single, Continuous, and Batch scanning modes
- **Real-time Audio Feedback**: Success/error sounds for scan validation
- **Visual Progress Tracking**: Live completion indicators and analytics
- **Keyboard Shortcuts**: Efficient workflow with hotkeys (Ctrl+F, Escape, F11)
- **Fullscreen Mode**: Distraction-free packing interface
- **Smart Product Matching**: Fuzzy search and auto-completion

### 🚚 **Dispatch Management**
- **Real-time Order Tracking**: Live dispatch status monitoring
- **Delivery Partner Integration**: Assign and manage delivery companies
- **Tracking Number Generation**: Automatic tracking number assignment
- **Bulk Operations**: Multi-order dispatch management
- **Export Capabilities**: CSV export with comprehensive data
- **Status Analytics**: Real-time dispatch performance metrics

### 📊 **Analytics & Reporting**
- **Order Status Dashboard**: Visual status distribution and trends
- **Performance Metrics**: Packing time, scan accuracy, completion rates
- **Export Functionality**: CSV/Excel export across all modules
- **Real-time Statistics**: Live updates and KPI monitoring

### 🔐 **Security & Authentication**
- **JWT Authentication**: Secure API access with token-based auth
- **Role-based Access**: Admin and user role management
- **API Security**: Protected endpoints with middleware validation

## 🏗️ **System Architecture**

### **Frontend (React)**
- **Framework**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Lucide React for consistent iconography
- **Notifications**: SweetAlert2 for user feedback
- **HTTP Client**: Axios with custom instance configuration

### **Backend (Node.js)**
- **Framework**: Express.js with RESTful API architecture
- **ORM**: Sequelize for database operations and migrations
- **Authentication**: JWT with custom middleware
- **Validation**: Joi for request validation
- **Error Handling**: Comprehensive error management with logging

### **Database (MySQL)**
- **Orders Management**: NewOrder, NewOrderItems tables
- **Inventory Tracking**: Products, SubProducts with status management
- **Delivery Integration**: DeliveryPartner, TrackingNumbers
- **User Management**: Users, authentication tokens
- **Status Tracking**: Order status history and transitions

### **Containerization (Docker)**
- **Multi-container Setup**: Frontend, Backend, Database, PhpMyAdmin
- **Development Environment**: Hot-reload and debugging support
- **Production Ready**: Optimized builds and deployment

## 🚀 **Quick Start**

### **Prerequisites**
- Docker Desktop installed and running
- Git for version control
- 8GB+ RAM recommended
- Ports 3000, 3001, 3306, 8080 available

### **Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/akila-era/hexalyte-main-ims.git
   cd hexalyte-ims-DOCKERIZED
   ```

2. **Start the Application**
   ```bash
   # Build and start all services
   docker-compose up -d

   # Check service status
   docker-compose ps
   ```

3. **Run Database Migrations**
   ```bash
   # Run migrations to set up database schema
   docker exec -it node-backend-ims npx sequelize-cli db:migrate
   ```

4. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **Database Admin**: http://localhost:8080
   - **Default Login**: Admin credentials (configure in environment)

### **Development Setup**

```bash
# Build services
docker-compose build

# Start with logs
docker-compose up

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# View logs
docker logs react-frontend-ims
docker logs node-backend-ims
```

## 📱 **Usage Guide**

### **Order Management Workflow**

1. **Create New Orders**
   - Navigate to Orders → New Orders
   - Add customer information and product selection
   - Confirm order details and submit

2. **Bulk Order Upload**
   - Go to Orders → Bulk Upload
   - Download CSV template
   - Upload Excel/CSV file with order data
   - Review auto-matched products and submit

3. **Pack Orders**
   - Access Orders → Pack Orders
   - Select order to pack
   - Use barcode scanner (supports multiple modes)
   - Track progress and complete packing

4. **Assign Delivery Partners**
   - Navigate to Orders → Assign Delivery Partner
   - Select confirmed orders
   - Choose delivery partner and set schedule
   - Generate waybill and tracking numbers

5. **Dispatch Management**
   - Go to Orders → Dispatch Orders
   - Monitor dispatch status and tracking
   - Update order status as needed
   - Export dispatch reports

### **Key Features Usage**

#### **📦 Pack Orders - Advanced Features**
```
Scanning Modes:
- Single: One-by-one scanning
- Continuous: Rapid scanning with auto-focus
- Batch: Queue multiple scans

Keyboard Shortcuts:
- Ctrl+F: Focus search
- Escape: Clear barcode input
- F11: Toggle fullscreen
- Enter: Submit scan

Audio Feedback:
- Success: Rising tone
- Error: Descending tone
- Complete: Multi-tone melody
```

#### **🚚 Dispatch Orders - Management**
```
Status Categories:
- Not Dispatched: Awaiting assignment
- Ready for Dispatch: Assigned to partner
- Dispatched: In transit
- Delivered: Successfully completed

Bulk Operations:
- Select multiple orders
- Update status in batch
- Export filtered data
- Generate reports
```

## 🔧 **Configuration**

### **Environment Variables**

#### **Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_BASE_URL=http://localhost:3001/v1
```

#### **Backend (.env)**
```env
APP_PORT=3001
DB_HOST=mysql-container-ims
DB_PORT=3306
DB_NAME=hexa_vims_db_development
DB_USERNAME=admin
DB_PASSWORD=5Y43HF85KGJ2TZ77
JWT_SECRET=your_jwt_secret
```

#### **Docker Compose**
```yaml
# Key configuration in docker-compose.yml
services:
  frontend:
    ports: ["3000:3000"]
    environment:
      REACT_APP_API_URL: http://localhost:3001

  backend:
    ports: ["3001:3001"]
    environment:
      APP_PORT: 3001
      DB_HOST: mysql-container-ims
```

## 🗄️ **Database Schema**

### **Core Tables**
- **NewOrder**: Customer orders with status tracking
- **NewOrderItems**: Individual order line items
- **Products**: Product catalog and inventory
- **SubProducts**: Individual product instances with serial numbers
- **DeliveryPartner**: Delivery company management
- **Users**: System user authentication and roles

### **Key Relationships**
```sql
NewOrder (1) → (N) NewOrderItems
NewOrderItems (N) → (1) SubProducts
SubProducts (N) → (1) Products
NewOrder (N) → (1) DeliveryPartner
```

## 📊 **API Documentation**

### **Authentication**
```javascript
// Login
POST /v1/auth/login
{
  "username": "admin",
  "password": "password"
}

// All protected routes require:
Headers: {
  "Authorization": "Bearer <jwt_token>"
}
```

### **Orders API**
```javascript
// Get all orders
GET /v1/neworder

// Create order
POST /v1/neworder
{
  "customerName": "John Doe",
  "primaryMobile": "1234567890",
  "productId": 1
}

// Update order status
PUT /v1/orderstatus/{orderId}
{
  "newStatus": "Confirmed",
  "reason": "Order verified"
}
```

### **Delivery Partners**
```javascript
// Get delivery partners
GET /v1/deliverypartner

// Assign delivery partner
POST /v1/neworder/assign/delivery-partner
[{
  "orderId": 1,
  "deliveryPartnerId": 1,
  "trackingNumber": "TRK123456"
}]
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Services Not Starting**
```bash
# Check Docker status
docker-compose ps

# View logs
docker-compose logs

# Restart services
docker-compose restart
```

#### **Database Connection Issues**
```bash
# Check MySQL container
docker exec -it mysql-container-ims mysql -u admin -p

# Run migrations
docker exec -it node-backend-ims npx sequelize-cli db:migrate
```

#### **Frontend Not Loading**
```bash
# Rebuild frontend
docker-compose build frontend

# Check frontend logs
docker logs react-frontend-ims

# Verify API URL configuration
```

#### **API Authentication Errors**
- Verify JWT token is valid
- Check API URL configuration
- Ensure backend is running on correct port
- Validate user credentials

### **Performance Optimization**
- Allocate sufficient Docker memory (8GB+)
- Use SSD storage for better database performance
- Monitor container resource usage
- Optimize database queries for large datasets

## 🚀 **Deployment**

### **Production Deployment**

1. **Environment Setup**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export DB_HOST=your-production-db-host
   ```

2. **Build Production Images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Database Migration**
   ```bash
   docker exec -it backend-container npx sequelize-cli db:migrate --env production
   ```

### **Scaling Considerations**
- Use load balancer for multiple frontend instances
- Implement database clustering for high availability
- Set up Redis for session management
- Configure CDN for static assets

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and test thoroughly
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

### **Code Standards**
- Follow ESLint configuration for JavaScript/React
- Use Prettier for code formatting
- Write meaningful commit messages
- Include tests for new features
- Update documentation for API changes

## 📝 **License**

This project is proprietary software developed for Hexalyte. All rights reserved.

## 👥 **Team**

- **Development**: Hexalyte Development Team
- **Architecture**: System Architecture Team
- **Testing**: Quality Assurance Team

## 📞 **Support**

For technical support or questions:
- **Email**: support@hexalyte.com
- **Documentation**: Internal wiki and guides
- **Issue Tracking**: GitHub Issues

---

## 🎯 **Recent Enhancements (v2.0)**

### **✨ New Features Added**
- **Advanced Pack Orders**: Multi-mode barcode scanning with audio feedback
- **Real-time Dispatch Management**: Complete dispatch workflow with partner integration
- **Enhanced Status Management**: Consolidated status dashboard with analytics
- **Bulk Operations**: Multi-order processing capabilities
- **Export Functionality**: CSV/Excel export across all modules
- **Performance Analytics**: Real-time metrics and KPI tracking

### **🔧 Technical Improvements**
- **API Security**: Enhanced authentication and validation
- **Database Optimization**: Improved queries and relationships
- **Error Handling**: Comprehensive error management and user feedback
- **UI/UX Enhancement**: Modern, responsive design with accessibility features
- **Documentation**: Complete system documentation and guides

### **📊 System Statistics**
- **18 Files Modified**: Major system enhancements
- **2,462+ Lines Added**: Significant feature additions
- **Production Ready**: Full deployment capability
- **Docker Optimized**: Containerized development and deployment

---

**🚀 Hexalyte IMS - Powering Modern Inventory Management**

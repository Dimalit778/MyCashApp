# MyCashApp - Personal Finance Tracker 💰

A modern, full-stack web application for tracking personal expenses and income with comprehensive admin panel functionality and beautiful data visualizations.

![MyCashApp Logo](frontend/src/assets/SiteIcon.png)

## 📱 Screenshots

<div align="center">
  <img src="frontend/src/assets/appImages/home-page.png" alt="Year View" width="48%" />
  <img src="frontend/src/assets/appImages/expenses-page.png" alt="Month View" width="48%" />
</div>

<div align="center">
  <!-- <img src="frontend/src/assets/pagesPhoto/editView.png" alt="Edit Transaction" width="48%" /> -->
</div>

## ✨ Features

### User Features

- 📊 **Transaction Management**
  - Track income and expenses with detailed descriptions
  - Add, edit, and delete transactions
  - Filter transactions by type (income/expense)
  - View transactions in a sortable, paginated table
- 📅 **Multiple Views**
  - Calendar month view with daily transaction summaries
  - Year overview with monthly statistics
  - Interactive date navigation
- 📈 **Advanced Analytics**
  - Monthly and yearly charts (Chart.js & Recharts)
  - Progress bars showing expense distribution
  - Animated statistics with CountUp
  - Category-wise spending analysis
- 🗂️ **Category Management**
  - Create custom categories (up to limit)
  - Assign categories to transactions
  - Delete unused categories
  - Visual category distribution
- 👤 **User Account**

  - Profile management with image upload (Cloudinary)
  - Secure authentication with JWT tokens
  - Edit personal information
  - Delete account option
  - Contact support form (UI only - backend integration pending)

- 🎨 **Modern UI/UX**
  - Responsive design (Mobile & Desktop)
  - Dark theme
  - Smooth animations (Framer Motion)
  - Loading states and error handling
  - Toast notifications
  - Bottom navigation (mobile)

### Admin Features

- 📊 **Analytics Dashboard**
  - System-wide statistics
  - User growth charts
  - Transaction volume analysis
  - Category usage statistics
- 👥 **User Management**
  - View all users with pagination
  - Search users by name or email
  - Filter by role (admin/user)
  - View detailed user information
  - Change user roles
  - Delete users with confirmation
- 🗃️ **Database Management**
  - Export data to JSON
  - Bulk delete operations
  - Database seeding tools
  - Data statistics overview
- 🏷️ **Category Administration**
  - Manage default categories
  - View category usage across system
  - Add/remove system categories

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 with Hooks
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **UI Components**:
  - React Bootstrap
  - Material-UI (Data Grid, Charts)
  - FontAwesome Icons
- **Styling**: CSS Modules + Bootstrap
- **Forms**: React Hook Form
- **Charts**: Chart.js + Recharts
- **Animations**: Framer Motion
- **Utilities**:
  - Axios (HTTP client)
  - date-fns (Date formatting)
  - SweetAlert2 (Alerts)
  - React Hot Toast (Notifications)
  - React CountUp (Number animations)
  - jsPDF (PDF export)

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**:
  - JWT (Access & Refresh tokens)
  - bcryptjs (Password hashing)
- **File Storage**: Cloudinary
- **Email**: Nodemailer (Hotmail/Outlook)
- **Security**:
  - CORS configuration
  - HTTP-only cookies
  - Input validation
  - Rate limiting ready

### Testing

- **E2E Testing**: Cypress
  - UI tests for all major features
  - API endpoint tests
  - Admin functionality tests
  - Authentication flow tests
  - Mobile responsive tests
- **Test Data**: Database seeding utilities

### Development Tools

- **Bundler**: Create React App
- **Linting**: ESLint
- **Package Manager**: npm
- **Concurrent Development**: Concurrently
- **Environment Variables**: dotenv
- **API Testing**: Built-in Cypress API tests

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (free tier available)
- Email account (Hotmail/Outlook for Nodemailer)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MyCashApp
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGO_URI=your_mongodb_connection_string
   # MONGO_TEST_DB=your_test_db_connection_string (optional for testing)

   # JWT Secrets
   TOKEN=your_jwt_secret_key
   TOKEN_EXPIRY=24h
   REFRESH_TOKEN=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Note: Also set these for Cloudinary (with REACT_APP prefix)
   REACT_APP_CLOUDINARY_NAME=your_cloudinary_cloud_name
   REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
   REACT_APP_CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Email Configuration (Optional - for future email features)
   EMAIL_ADD=your_outlook_email
   EMAIL_PASS=your_outlook_password

   # Client URLs
   CLIENT_URL=http://localhost:3000
   RENDER_FRONTEND_URL=your_production_frontend_url (for production)
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   ```

4. **Start Development Servers**

   Option 1: Run both frontend and backend together

   ```bash
   cd frontend
   npm run dev
   ```

   Option 2: Run separately

   Backend (from backend directory):

   ```bash
   npm run dev
   ```

   Frontend (from frontend directory):

   ```bash
   npm start
   ```

## 🧪 Testing

### Running Cypress Tests

```bash
# Run tests in headless mode
cd frontend
npm run cy:test

# Open Cypress Test Runner
npm run cy

# Run app in test mode (with test backend)
npm run test:mode
```

### Test Coverage

- **UI Tests**: Authentication, transactions, categories, calendar navigation
- **API Tests**: All CRUD operations, authentication, validation
- **Admin Tests**: User management, database operations, role changes
- **Responsive Tests**: Mobile and desktop layouts

### Cypress Test Organization

```
cypress/
├── e2e/
│   ├── admin/           # Admin panel tests
│   │   ├── admin-analytics.cy.js
│   │   ├── admin-categories.cy.js
│   │   ├── admin-database.cy.js
│   │   ├── admin-routes.cy.js
│   │   ├── admin-user-details.cy.js
│   │   └── admin-users.cy.js
│   ├── api/             # API endpoint tests
│   │   ├── auth-api.cy.js
│   │   ├── categories-api.cy.js
│   │   ├── transactions-api.cy.js
│   │   └── user-api.cy.js
│   └── ui/              # UI component tests
│       ├── auth.cy.js
│       ├── calender-month-year.cy.js
│       ├── categories-managment.cy.js
│       ├── contactUs-view.cy.js
│       ├── Landing-page.cy.js
│       ├── main-layout.cy.js
│       ├── transaction-table.cy.js
│       ├── transactions-management.cy.js
│       └── user-managment.cy.js
├── fixtures/            # Test data
├── support/             # Helper functions
└── screenshots/         # Test failure screenshots
```

## 🏗️ Project Structure

```
MyCashApp/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── db/              # Database connection
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/      # Images, icons
│   │   ├── components/  # Reusable components
│   │   ├── config/      # App configuration
│   │   ├── constants/   # App constants
│   │   ├── layout/      # Layout components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services & Redux
│   │   └── utils/       # Utility functions
│   └── cypress/         # E2E tests
└── README.md
```

## 🗄️ Database Schema

### User Schema

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  imageUrl: String,
  role: String (enum: ['admin', 'user']),
  subscription: String (enum: ['free', 'premium']),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Schema

```javascript
{
  description: String (max: 20 chars),
  amount: Number (0-1,000,000),
  date: Date,
  transactionType: String (enum: ['income', 'expense']),
  category: String,
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema

```javascript
{
  description: String,
  type: String (enum: ['income', 'expense']),
  user: ObjectId (ref: User),
  createdAt: Date
}
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/signup              # Register new user
POST   /api/auth/login               # Login user
POST   /api/auth/logout              # Logout user
```

### User Endpoints

```
GET    /api/users/profile            # Get user profile
PATCH  /api/users/updateDetails      # Update user details
POST   /api/users/uploadImage        # Upload profile image
DELETE /api/users/deleteAccount      # Delete user account
```

### Transaction Endpoints

```
GET    /api/transactions/yearly      # Get yearly statistics
GET    /api/transactions/monthly     # Get monthly transactions
POST   /api/transactions/add         # Add new transaction
PATCH  /api/transactions/update      # Update transaction
DELETE /api/transactions/delete/:id  # Delete transaction
```

### Category Endpoints

```
GET    /api/categories/get           # Get user categories
POST   /api/categories/add           # Add new category
DELETE /api/categories/delete/:id    # Delete category
```

### Admin Endpoints

```
GET    /api/admin/all                # Get all users (paginated)
GET    /api/admin/stats              # Get system statistics
GET    /api/admin/user/:id           # Get user details
DELETE /api/admin/user/:id           # Delete user
PATCH  /api/admin/user/:id/role      # Update user role
```

### Seed Endpoints (Development)

```
POST   /api/seed/admin               # Create admin user
POST   /api/seed/userAndCategories   # Create test user with data
POST   /api/seed/multipleUsers       # Create multiple test users
DELETE /api/seed/clear               # Clear database
```

## 👨‍💼 Admin Setup

### Creating an Admin User

To access the admin panel, you need to create an admin user. There are two ways:

1. **Using the seed endpoint** (Recommended for development):

   ```bash
   POST http://localhost:5000/api/seed/admin
   ```

   This creates an admin user with:

   - Email: `cypress-ad@gmail.com`
   - Password: `admin123`

2. **Manual creation**:
   - First register a regular user
   - Use MongoDB directly or create an endpoint to update the user's role to "admin"

### Default Admin User (from seed)

```json
{
  "email": "cypress-ad@gmail.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

> **Note**: Remember to change these credentials in production!

## 🚢 Deployment

### Frontend Deployment (Netlify)

1. Build the production bundle:

   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to Netlify:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables if needed

### Backend Deployment (Render/Heroku)

1. Ensure all environment variables are set in your hosting platform
2. Set start command: `npm start`
3. Enable automatic deploys from your repository

### Environment Variables for Production

Remember to update:

- `NODE_ENV=production`
- `CLIENT_URL` to your frontend URL
- Use secure, randomly generated JWT secrets
- Enable HTTPS

## 📱 Progressive Web App

The app includes PWA capabilities:

- Installable on mobile devices
- Offline support (coming soon)
- App icons and manifest file

## 🔒 Security Features

- JWT token-based authentication
- Refresh token rotation
- Password hashing with bcryptjs
- HTTP-only cookies
- CORS protection
- Input validation and sanitization
- Role-based access control (RBAC)
- Secure file upload with Cloudinary
- Email validation restrictions

## 🎯 Roadmap

- [ ] Budget planning feature
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Data export (CSV/PDF)
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Advanced filtering options
- [ ] Bill reminders
- [ ] Financial goals tracking

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure frontend URL is added to backend CORS configuration
   - Check that credentials are included in API requests

2. **Cloudinary Upload Issues**

   - Verify all Cloudinary environment variables are set correctly
   - Note: Backend needs both regular and REACT_APP prefixed variables

3. **Authentication Issues**

   - Clear browser cookies and local storage
   - Ensure JWT secrets match between restarts
   - Check token expiry settings

4. **Database Connection**

   - Verify MongoDB connection string
   - Ensure MongoDB service is running
   - Check network/firewall settings

5. **Email Features**
   - Email functionality requires Outlook/Hotmail account
   - Currently only configured for development (not fully implemented)

### Development Tips

- Use `npm run dev` in frontend to run both frontend and backend concurrently
- The app includes comprehensive Cypress tests - run them to verify your setup
- Default categories are automatically created for new users
- Admin users are redirected to `/admin/analytics` on login

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

- Email: support@mycashapp.com
- Phone: +972 052-6731280
- Create an issue in the repository

## 🙏 Acknowledgments

- Icons from FontAwesome
- UI components from React Bootstrap and Material-UI
- Charts powered by Chart.js and Recharts
- Image storage by Cloudinary

---

<div align="center">
  Made with ❤️ by the MyCashApp Team
</div>

# MyCashApp - Personal Finance Tracker

A full-stack web application for tracking personal expenses and income with comprehensive admin panel functionality.

## Features

### User Features

- 📊 Track income and expenses
- 📅 Calendar view for transactions
- 📈 Visual charts and analytics
- 🗂️ Custom categories
- 👤 User profile management
- 🔐 Secure authentication

### Admin Features

- 👥 User management (view, edit, delete users)
- 📊 System-wide statistics dashboard
- 🔧 User role management
- 📈 Analytics and reporting
- 🔍 Advanced user search and filtering
- 📄 Detailed user information views

## Tech Stack

### Frontend

- React 18
- Redux Toolkit (RTK Query)
- React Bootstrap
- Chart.js / Recharts
- React Router
- FontAwesome Icons

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image storage)
- bcryptjs (Password hashing)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Cloudinary account (for image uploads)

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
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   TOKEN=your_jwt_secret
   TOKEN_EXPIRY=24h
   REFRESH_TOKEN=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   ```

4. **Start the Application**

   Backend (from backend directory):

   ```bash
   npm run dev
   ```

   Frontend (from frontend directory):

   ```bash
   npm start
   ```

## Admin Panel

### Creating an Admin User

To access the admin panel, you need to create an admin user. Use the seed endpoint:

```bash
POST http://localhost:5000/api/seed/admin
```

This creates an admin user with:

- Email: `admin@mycashapp.com`
- Password: `admin123`
- Role: `admin`

### Accessing the Admin Panel

1. Login with the admin credentials
2. Navigate to `/admin` or click the "Admin" link in the sidebar
3. The admin panel includes:
   - **Dashboard**: System-wide statistics
   - **User Management**: View, search, and manage users
   - **Analytics**: Coming soon
   - **Settings**: Coming soon

### Admin Features

#### Dashboard Statistics

- Total users count
- Admin vs regular users
- Recent registrations (last 30 days)
- Total transactions across all users
- Total categories across all users

#### User Management

- **Search**: Find users by name or email
- **Filter**: Filter by user role (admin/user)
- **Pagination**: Navigate through large user lists
- **Actions**:
  - View detailed user information
  - Change user roles
  - Delete users (with confirmation)
  - View user statistics (transactions, income, expenses, balance)

#### User Details Modal

- Complete user information
- User statistics
- Recent activity
- Financial overview

## API Endpoints

### Admin Routes

All admin routes require authentication and admin role.

```
GET    /api/users/admin/all           # Get all users with pagination
GET    /api/users/admin/stats         # Get system statistics
GET    /api/users/admin/user/:id      # Get user details
DELETE /api/users/admin/user/:id      # Delete user
PATCH  /api/users/admin/user/:id/role # Update user role
```

### Seed Routes

```
POST   /api/seed/admin               # Create admin user
POST   /api/seed/userAndCategories   # Create test user
POST   /api/seed/multipleUsers       # Create multiple test users
DELETE /api/seed/clear               # Clear database
```

## Security Features

- JWT token authentication
- Role-based access control
- Password hashing with bcryptjs
- Protected admin routes
- CORS configuration
- Input validation and sanitization

## Database Schema

### User Schema

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  imageUrl: String,
  role: String (enum: ['admin', 'user']),
  subscription: String,
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# E2E tests with Cypress
npm run cy
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@mycashapp.com or create an issue in the repository.

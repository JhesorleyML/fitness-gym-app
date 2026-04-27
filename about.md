# Benford Gym App Documentation

## 1. Project Overview
Benford Gym App is a comprehensive gym management system designed to handle client information, subscriptions, payments, expenses, and reporting. It features a robust backend for data management and a modern React-based frontend for an intuitive user experience.

---

## 2. Tech Stack

### Backend
- **Node.js & Express**: Core server framework.
- **Sequelize (ORM)**: For database management and interactions.
- **MySQL**: Relational database for persistent storage.
- **Multer**: For handling file (image) uploads and updates.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **bcryptjs**: For password hashing and security.
- **date-fns**: For date manipulation and formatting.

### Frontend
- **React (Vite)**: Modern frontend framework and build tool.
- **React Router**: For client-side routing.
- **Axios**: For making API requests to the backend.
- **Bootstrap (React-Bootstrap)**: For responsive UI components and styling.
- **Formik & Yup**: For robust form handling and validation.
- **Chart.js (React-Chartjs-2)**: For data visualization in dashboards and reports.
- **React Icons**: For consistent iconography.
- **react-qr-code**: For generating member QR codes.
- **@yudiel/react-qr-scanner**: For USB camera QR scanning.
- **react-to-print**: For high-quality, professional report and QR printing.

---

## 3. Project Structure

### Backend (/server)
- index.js: Entry point of the application.
- models/: Database schema (includes Attendance, ClientInfo, User, etc.).
- outes/: API endpoints for different modules (auth, clients, payments, attendance, etc.).
- AuthMiddleware/: Contains authentication logic (JWT verification).
- uploads/: Directory for storing uploaded client photos and other assets.
- utils/: Utility functions like QR generation and database migration scripts.

### Frontend (/client)
- src/main.jsx: Entry point for the React application.
- src/App.jsx: Main application component, defines routes and global state.
- src/pages/: Page-level components (Dashboard, Client, Payment, Attendance Scanner, Attendance Logs, etc.).    
- src/Components/: Reusable UI components (Navbar, Footer, Modals, QRModal, EditClientModal).
- src/helpers/: Utility functions and context providers (AuthContext, ProtectedRoute).
- src/assets/: Static assets like images and CSS files.

---

## 4. Backend Documentation

### Database Models
- **User**: Stores administrative user credentials and roles.
- **ClientInfo**: Stores personal details of gym members. Now includes a unique 10-digit **qrCode**.
- **Subscription**: Defines available gym membership plans (category, amount, duration).
- **ClientSubscription**: Links clients to their chosen subscriptions, tracking start and end dates. Expiry is calculated relative to the start date.
- **Payment**: Records financial transactions. Supports custom payment dates for historical entries.
- **Attendance**: Tracks member \checkIn\, \checkOut\, and \date\.
- **EmergencyContact**: Stores emergency contact details for each client.
- **ClientInOutLog**: (Legacy/Partial) For tracking member visits.

### API Endpoints
- **Auth (\/api/auth\)**:
  - \POST /register\: Register a new admin user.
  - \POST /login\: Authenticate a user and return a JWT.
  - \GET /\: Verify current authentication status.
- **Clients (\/api/clients\)**:
  - \GET /\: Retrieve all clients with active status and emergency contact.
  - \POST /new\: Create a new client. Automatically generates a unique 10-digit \qrCode\ and handles photo upload.  
  - \PUT /update/:id\: Update client details and emergency contact. Now supports **Multer** for updating profile pictures.
- **Subscriptions (\/api/subscriptions\)**:
  - \GET /\: List all available subscription plans.
  - \POST /\: Create a new subscription plan.
- **Client Subscriptions (\/api/clientsubs\)**:
  - \POST /new\: Assign a subscription to a client. Supports a custom \paymentdate\ which also sets the subscription's \datestart\.
- **Attendance (\/api/attendance\)**:
  - \POST /scan\: Validates subscription status and toggles Check-In/Check-Out status based on the scanned \qrCode\.
  - \GET /\: Retrieves attendance logs for a specific date (defaults to today). Now includes full URLs for client photos.
- **Payments (\/api/payments\)**:
  - \GET /\: List all payments.
  - \POST /\: Record a new payment.
- **Expenses (\/api/expenses\)**:
  - \GET /\: List all gym expenses.
  - \POST /\: Add a new expense.

---

## 5. Frontend Documentation

### Key Pages
- **Dashboard**: Provides a high-level overview of gym statistics using charts.
- **Attendance Scanner**: Public-facing page for QR scanning via USB camera to log entry and exit.
- **Attendance Logs**: Displays a daily record of check-ins and check-outs with a date filter and member photos.        
- **Client Management**: List, add, and update client profiles.
  - **View QR Code**: Displays a printable QR ID for members.
  - **Edit Client**: Comprehensive modal to update personal info, emergency contacts, and profile photos with live previews.
- **Subscription Management**: Manage the different membership tiers.
- **Payment Tracking**: Record member payments. 
  - **Payment Date Selector**: Facilitates \"backward entries\" for historical tracking.
  - **Waive Payment Checkbox**: **(New)** Allows staff to set the payment amount to zero via a toggle (convenient for legacy data or promotional entries).
- **Expense Management**: Track and categorize gym-related costs.
- **Reports**: 
  - **Payment & Expense Reports**: Filter by date range or month.
  - **Client Reports**: Filter by membership or activity status.
  - **Stable Printing**: Powered by \eact-to-print\ for consistent layout and style in printouts.
  - **Dynamic Headers**: Monthly reports clearly display the selected year in the header.

### State Management
- **AuthContext**: Manages authentication state (\username\, \id\, \ole\, \status\).

### Protected Routes
- **ProtectedRoute Component**: Wraps routes that require authentication.

---

## 6. Main Features
1. **QR Attendance System**: 
   - Automated check-in/out tracking using unique 10-digit IDs.
   - Real-time subscription validation during scanning.
   - **Daily Logs**: View and filter daily attendance records with photos.
2. **Member Profiling & Management**: 
   - Detailed records with photos and emergency contacts.
   - Full editing capabilities for member data and profile pictures.
3. **Subscription Lifecycle**: Track memberships with auto-calculated expiry dates based on custom start dates. 
4. **Conditional Status Highlighting**: Visual cues for expiring subscriptions (Orange for $\le$ 5 days, Red for $\le$ 2 days).
5. **Financial Tracking**: 
   - Manage both income (payments) and outgoings (expenses).
   - **Waive Payment Toggle**: Quickly set transaction amounts to zero while maintaining subscription records.
6. **Backward Data Entry**: Record historical payments and memberships accurately.
7. **Advanced Reporting**:
   - **Professional Currency Formatting**: All financial reports use **Philippine Peso (PHP)** format with exactly 2 decimal places (\en-PH\).
   - **Print-Ready Layouts**: Automatic table expansion and clean headers for physical copies.
8. **Modern UI/UX**: 
   - Compact navigation (80px banner).
   - Polished, responsive homepage carousel.
9. **Data Visualization**: Visual performance representation through charts.
10. **Secure Access**: Role-based access (Admin/Staff) and JWT protection.

---

## 7. Setup and Installation

### Prerequisites
- Node.js installed.
- MySQL server running.

### Backend Setup
1. Navigate to \/server\.
2. Run \
pm install\.
3. Configure database settings in \config/config.json\ or \.env\.
4. Run \
px sequelize-cli db:migrate\ (if available) or let \sequelize.sync()\ create tables.
5. Start the server: \
pm start\. (This also runs auto-migration for missing QR codes).

### Frontend Setup
1. Navigate to \/client\.
2. Run \
pm install\.
3. Start the development server: \
pm run dev\.
4. Access the app via the Vite URL (usually \http://localhost:5173\).

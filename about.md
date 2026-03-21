# Benford Gym App Documentation

## 1. Project Overview
Benford Gym App is a comprehensive gym management system designed to handle client information, subscriptions, payments, expenses, and reporting. It features a robust backend for data management and a modern React-based frontend for an intuitive user experience.

---

## 2. Tech Stack

### Backend
- **Node.js & Express**: Core server framework.
- **Sequelize (ORM)**: For database management and interactions.
- **MySQL**: Relational database for persistent storage.
- **Multer**: For handling file (image) uploads.
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

---

## 3. Project Structure

### Backend (`/server`)
- `index.js`: Entry point of the application, sets up middleware and routes.
- `models/`: Contains Sequelize models defining the database schema.
- `routes/`: Defines API endpoints for different modules (auth, clients, payments, etc.).
- `AuthMiddleware/`: Contains authentication logic (JWT verification).
- `uploads/`: Directory for storing uploaded client photos and other assets.

### Frontend (`/client`)
- `src/main.jsx`: Entry point for the React application.
- `src/App.jsx`: Main application component, defines routes and global state.
- `src/pages/`: Contains page-level components (Dashboard, Client, Payment, etc.).
- `src/Components/`: Reusable UI components (Navbar, Footer, Modals, Tables).
- `src/helpers/`: Utility functions and context providers (AuthContext, ProtectedRoute).
- `src/assets/`: Static assets like images and CSS files.

---

## 4. Backend Documentation

### Database Models
- **User**: Stores administrative user credentials and roles.
- **ClientInfo**: Stores personal details of gym members (name, address, contact, photo).
- **Subscription**: Defines available gym membership plans (category, amount, duration).
- **ClientSubscription**: Links clients to their chosen subscriptions, tracking start and end dates.
- **Payment**: Records financial transactions related to client subscriptions.
- **Expense**: Tracks gym operational costs.
- **EmergencyContact**: Stores emergency contact details for each client.
- **ClientInOutLog**: (Planned/Partial) For tracking member visits.

### API Endpoints
- **Auth (`/api/auth`)**:
  - `POST /register`: Register a new admin user.
  - `POST /login`: Authenticate a user and return a JWT.
  - `GET /`: Verify current authentication status.
- **Clients (`/api/clients`)**:
  - `GET /`: Retrieve all clients with active status and emergency contact.
  - `POST /new`: Create a new client with photo upload support.
  - `PUT /update/:id`: Update client information.
- **Subscriptions (`/api/subscriptions`)**:
  - `GET /`: List all available subscription plans.
  - `POST /`: Create a new subscription plan.
- **Client Subscriptions (`/api/clientsubs`)**:
  - `POST /`: Assign a subscription to a client.
  - `GET /active`: Retrieve active subscriptions.
- **Payments (`/api/payments`)**:
  - `GET /`: List all payments.
  - `POST /`: Record a new payment.
- **Expenses (`/api/expenses`)**:
  - `GET /`: List all gym expenses.
  - `POST /`: Add a new expense.

---

## 5. Frontend Documentation

### Key Pages
- **Dashboard**: Provides a high-level overview of gym statistics (active members, monthly revenue, expenses) using charts.
- **Client Management**: List, add, and update client profiles. Includes photo upload functionality.
- **Subscription Management**: Manage the different membership tiers offered by the gym.
- **Payment Tracking**: Record and monitor member payments.
- **Expense Management**: Track and categorize gym-related costs.
- **Reports**: Generate detailed reports for payments, clients, and expenses over specific periods.

### State Management
- **AuthContext**: A React Context used to manage and provide authentication state (`username`, `id`, `role`, `status`) throughout the application.

### Protected Routes
- **ProtectedRoute Component**: Wraps routes that require authentication, redirecting unauthenticated users to the login page.

---

## 6. Main Features
1. **Member Profiling**: Detailed records including photos and emergency contacts.
2. **Subscription Lifecycle**: Track when memberships start and expire.
3. **Financial Tracking**: Manage both income (payments) and outgoings (expenses).
4. **Data Visualization**: Visual representation of gym performance through charts.
5. **Secure Access**: Role-based access and JWT-protected API endpoints.
6. **Reporting**: Generate and export data for business analysis.

---

## 7. Setup and Installation

### Prerequisites
- Node.js installed.
- MySQL server running.

### Backend Setup
1. Navigate to `/server`.
2. Run `npm install`.
3. Configure database settings in `config/config.json` or `.env`.
4. Run `npx sequelize-cli db:migrate` (if migrations are available) or let `sequelize.sync()` create tables.
5. Start the server: `npm start`.

### Frontend Setup
1. Navigate to `/client`.
2. Run `npm install`.
3. Start the development server: `npm run dev`.
4. Access the app via the provided Vite URL (usually `http://localhost:5173`).

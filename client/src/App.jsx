import "./App.css";
import TopNav from "./Components/TopNav";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { useState } from "react";
import axios from "axios";
import { AuthContext } from "./helpers/AuthContext";
import TopNavNotLoggedIn from "./Components/TopNavNotLoggedIn";
import Register from "./pages/register/Register";
import Client from "./pages/clientinfo/Client";
import "bootstrap/dist/css/bootstrap.min.css";
import Subscription from "./pages/subscription/Subscription";
import AddClient from "./pages/clientinfo/AddClient";
import Footer from "./Components/Footer";
import Payment from "./pages/payment/Payment";
import ProtectedRoute from "./helpers/ProtectedRoute";
import Reports from "./pages/reports/Reports";
import PaymentReports from "./pages/reports/PaymentReports";
import ClientReports from "./pages/reports/ClientReports";
import HomePage from "./pages/home/HomePage";
import Expenses from "./pages/expenses/Expenses";
import ExpensesReports from "./pages/reports/ExpensesReports";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";

function App() {
  const defState = { username: "", id: 0, status: false, role: "" };
  const [authState, setAuthState] = useState(defState);

  // Use TanStack Query for Auth Check
  const { isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) return defState;

      try {
        const response = await axios.get("/api/auth", {
          headers: { accessToken: token },
        });

        if (response.data.error) return defState;

        const userData = {
          username: response.data.user.username,
          id: response.data.user.id,
          status: true,
          role: response.data.user.role,
        };
        setAuthState(userData);
        return userData;
      } catch (err) {
        console.log(err);
        return defState;
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Verifying session...</span>
      </div>
    );
  }

  return (
    <>
      <div className="App-content">
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <BrowserRouter>
            {authState.status === false ? (
              <TopNavNotLoggedIn />
            ) : (
              <TopNav userRole={authState.role} />
            )}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    isAuth={authState.status}
                    component={<Dashboard />}
                  />
                }
              />
              <Route
                path="/login"
                element={<Login isLogin={authState.status} />}
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute
                    isAuth={
                      authState.status &&
                      (authState.role === "superadmin" ||
                        authState.role === "admin")
                    }
                    component={<Register />}
                  />
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute
                    isAuth={authState.status}
                    component={<Client />}
                  />
                }
              />
              <Route
                path="/clients/add"
                element={
                  <ProtectedRoute
                    isAuth={authState.status}
                    component={<AddClient />}
                  />
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute
                    isAuth={authState.status}
                    component={<Subscription />}
                  />
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute
                    isAuth={authState.status}
                    component={<Payment userId={authState.id} />}
                  />
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute
                    isAuth={authState.status && authState.role !== "staff"}
                    component={<Reports userId={authState.id} />}
                  />
                }
              />
              <Route
                path="/reports/payments"
                element={
                  <ProtectedRoute
                    isAuth={authState.status && authState.role !== "staff"}
                    component={<PaymentReports userId={authState.id} />}
                  />
                }
              />
              <Route
                path="/reports/clients"
                element={
                  <ProtectedRoute
                    isAuth={authState.status && authState.role !== "staff"}
                    component={<ClientReports userId={authState.id} />}
                  />
                }
              />
              <Route
                path="/reports/expenses"
                element={
                  <ProtectedRoute
                    isAuth={authState.status && authState.role !== "staff"}
                    component={<ExpensesReports userId={authState.id} />}
                  />
                }
              />
              <Route
                path="/expenses"
                element={
                  <ProtectedRoute
                    isAuth={authState.status}
                    component={<Expenses userId={authState.id} />}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </div>
      <Footer />
    </>
  );
}

export default App;

import "./App.css";
import TopNav from "./Components/TopNav";
import { BrowserRouter, Routes, Route } from "react-router";
//import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { useEffect, useState } from "react";
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

function App() {
  const defState = { username: "", id: 0, status: false };
  const [authState, setAuthState] = useState(defState);
  const [loading, setLoading] = useState(true); // Add a loading state

  //re-render the page if the authState Changes
  useEffect(() => {
    //check session storage if accessToken is present
    //so that authState will not change when the page is refreshed
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      axios
        .get("/api/auth", {
          headers: { accessToken: token },
        })
        .then((response) => {
          //console.log(response.data);
          if (response.data.error) {
            setAuthState(defState); //{ ...authState, status: false }
          } else {
            setAuthState({
              username: response.data.user.username,
              id: response.data.user.id,
              status: true,
              role: response.data.user.role,
            });
          }
        })
        .catch(() => setAuthState(defState))
        .finally(() => setLoading(false));
    } else {
      setAuthState(defState);
      setLoading(false);
    }
  }, []);
  if (loading) {
    // Show a loading spinner or placeholder while verifying authentication
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="App-content">
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <BrowserRouter>
            {
              //Display Login and Register on the Top Nav if not Login
              authState.status === false ? (
                <TopNavNotLoggedIn />
              ) : (
                <TopNav userRole={authState.role} />
              )
            }
            <Routes>
              {/**<Route path="/" element={<Home />} /> */}
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
              {/**Login route is only available if not logged login */}
              <Route
                path="/login"
                element={<Login isLogin={authState.status} />}
              />
              {/**Make this route only available if logged in and not logged-in*/}
              <Route path="/register" element={<Register />} />
              {/**Make this route only available if logged in*/}
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
                    isAuth={authState.status}
                    component={<Reports userId={authState.id} />}
                  />
                }
              />
              <Route
                path="/reports/payments"
                element={
                  <ProtectedRoute
                    isAuth={authState.status}
                    component={<PaymentReports userId={authState.id} />}
                  />
                }
              />
              <Route
                path="/reports/clients"
                element={
                  <ProtectedRoute
                    isAuth={authState.status}
                    component={<ClientReports userId={authState.id} />}
                  />
                }
              />
              <Route
                path="/reports/expenses"
                element={
                  <ProtectedRoute
                    isAuth={authState.status}
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

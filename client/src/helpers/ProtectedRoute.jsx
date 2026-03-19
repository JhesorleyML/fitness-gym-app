import { Navigate } from "react-router";
import PropTypes from "prop-types";

const ProtectedRoute = ({ isAuth, component }) => {
  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }
  return component;
};

ProtectedRoute.propTypes = {
  isAuth: PropTypes.bool,
  component: PropTypes.element,
};

export default ProtectedRoute;

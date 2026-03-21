import { Button, Col, Container, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { MdPerson, MdLock } from "react-icons/md";
import "./style.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Login = ({ isLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const queryClient = useQueryClient();
  let navigate = useNavigate();

  // check if already logged in
  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);

  const loginMutation = useMutation({
    mutationFn: (credentials) => axios.post("/api/auth/login", credentials),
    onSuccess: (response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        sessionStorage.setItem("accessToken", response.data.token);
        alert(response.data.message);
        
        const userData = {
          username: response.data.user.username,
          id: response.data.user.id,
          status: true,
          role: response.data.user.role,
        };
        
        setAuthState(userData);
        // Manually update the 'auth' query cache
        queryClient.setQueryData(["auth"], userData);
        
        navigate(`/dashboard`);
      }
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <Container className="d-flex justify-content-center">
      <Row>
        <Col>
          <div
            className="p-4 rounded shadow-sm mt-5"
            style={{ backgroundColor: "aliceblue", minWidth: "300px" }}
          >
            <h3 className="text-center mb-4">Log In</h3>
            <Form onSubmit={onSubmit}>
              <Form.Label className="label-left">Username</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-primary text-white">
                  <MdPerson />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="username"
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </InputGroup>

              <Form.Label className="label-left">Password</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-primary text-white">
                  <MdLock />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </InputGroup>

              <div className="d-grid">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loginMutation.isLoading}
                >
                  {loginMutation.isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              <div className="regLink mt-3">
                <p className="small text-muted mb-0">No account yet? Please contact the administrator.</p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

Login.propTypes = {
  isLogin: PropTypes.bool,
};

export default Login;

import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { MdPerson, MdLock } from "react-icons/md";
import "./style.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import PropTypes from "prop-types";

const Login = ({ isLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();
  //check if already login
  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);

  const onSubmit = () => {
    const data = { username: username, password: password };
    //console.log(data);
    axios.post("/api/auth/login", data).then((response) => {
      console.log(response.data);
      if (response.data.error) alert(response.data.error);
      else {
        sessionStorage.setItem("accessToken", response.data.token);
        alert(response.data.message);
        setAuthState({
          username: response.data.user.username,
          id: response.data.user.id,
          status: true,
          role: response.data.user.role,
        });

        navigate(`/dashboard`);
      }
    });
  };

  Login.propTypes = {
    isLogin: PropTypes.bool,
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
            <Form>
              <Form.Label className="label-left">Username</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="account-addon">
                  <MdPerson />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  aria-label="username"
                  aria-describedby="username-addon"
                  name="username"
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {/*errors.account*/}
                </Form.Control.Feedback>
              </InputGroup>
              <Form.Label className="label-left">Password</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="password-addon">
                  <MdLock />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  aria-label="Enter Password"
                  aria-describedby="password-addon"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {/*errors.amount*/}
                </Form.Control.Feedback>
              </InputGroup>
              <div className="d-grid">
                <Button variant="primary" onClick={onSubmit}>
                  {" "}
                  Login
                </Button>
              </div>
              <div className="regLink">
                <p>No account yet? Please contact the administrator.</p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

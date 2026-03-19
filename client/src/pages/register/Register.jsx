import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import {
  MdAccountCircle,
  MdAddLocation,
  MdAdminPanelSettings,
  MdHome,
  MdLock,
  MdPersonAdd,
  MdPhoneAndroid,
} from "react-icons/md";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router";

const validationSchema = Yup.object().shape({
  //enter the validation/constraints of the fields
  fullname: Yup.string().required("This is a required field!"),
  address: Yup.string().required("This is a required field!"),
  contact: Yup.string()
    .matches(/^[+]?[0-9]{11}$/, "Phone number must be a valid phone number")
    .required("This is a required field!"),
  username: Yup.string()
    .min(4, "Username must be atleast 4 characters")
    .required("This is a required field!"),
  password: Yup.string()
    .min(8, "Password must atlease 8 characters long")
    .required("This is a required field!"),
  retypePassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords did not match")
    .required("This is a required field!"),
  role: Yup.string().required("This is a required field!"),
});

const Register = () => {
  let navigate = useNavigate();
  //validation schema using yup
  const handleSubmit = (values, { resetForm }) => {
    console.log(values);
    //save the data to the database
    axios.post("/api/auth/new", values).then((response) => {
      console.log(response.data.message);
      alert(response.data.message);
    });
    resetForm();
  };

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/")}>
          <MdHome />
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate("/dashboard")}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">Register</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <div className="reg-form">
            <div>
              <h2 className="text-center">Register New User</h2>
              <p className="text-center"> Please fill up all fields.</p>
            </div>
            <Formik
              initialValues={{
                fullname: "",
                address: "",
                contact: "",
                username: "",
                password: "",
                retypePassword: "",
                role: "user",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                errors,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Label className="reg-label">Name</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="fullname-addon">
                      <MdPersonAdd />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ex. John A. Doe"
                      aria-label="Fullname"
                      aria-describedby="fullname-addon"
                      name="fullname"
                      value={values.fullname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.fullname && !!errors.fullname}
                    />
                    <Form.Control.Feedback type="invalid">
                      {" "}
                      {errors.fullname}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Label className="reg-label">Address</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="address-addon">
                      <MdAddLocation />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ex. P-1, Poblacion, San Jose, Dinagat Islands"
                      aria-label="Address"
                      aria-describedby="address-addon"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.address && !!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Label className="reg-label">Phone No.</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="contact-addon">
                      <MdPhoneAndroid />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ex. 09120125012"
                      aria-label="Contact"
                      aria-describedby="contact-addon"
                      name="contact"
                      value={values.contact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.contact && !!errors.contact}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contact}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Label className="reg-label">Username</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="username-addon">
                      <MdAccountCircle />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ex. user1"
                      aria-label="username"
                      aria-describedby="username-addon"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.username && !!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Label className="reg-label">Password</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="password-addon">
                      <MdLock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      aria-label="password"
                      aria-describedby="password-addon"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Label className="reg-label">Retype Password</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="retype-password-addon">
                      <MdLock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      aria-label="retype-password"
                      aria-describedby="retype-password-addon"
                      name="retypePassword"
                      value={values.retypePassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.retypePassword && !!errors.retypePassword
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.retypePassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Label className="reg-label">Role</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="role-addon">
                      <MdAdminPanelSettings />
                    </InputGroup.Text>
                    <Form.Select title="role" name="role">
                      <option disabled>-Select Role-</option>
                      <option value={`user`}>User</option>
                      <option value={`admin`}>Admin</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                  </InputGroup>
                  {/* Submit Button */}
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Create Account
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;

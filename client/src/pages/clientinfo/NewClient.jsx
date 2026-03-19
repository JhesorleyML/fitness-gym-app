import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import "./style.css";
import * as Yup from "yup";
import parse from "date-fns/parse";
import { Formik } from "formik";
import { useState } from "react";
import defImage from "../../assets/images/default-account.jpg";
//import DatePickerField from "../../Components/DatePickerField";

const validFileExtensions = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp"],
};

function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
}
//validation schema
const validationSchema = Yup.object().shape({
  //for firstname
  firstname: Yup.string().required("This is a required field"),
  middlename: Yup.string(),
  lastname: Yup.string().required("This is a required field"),
  address: Yup.string().required("This is a required field"),
  sex: Yup.string().required("This is a required field"),
  contact: Yup.string()
    .matches(/^[+]?[0-9]{11}$/, "Contact must be a valid mobile no.")
    .required("This is a required field"),
  bdate: Yup.date()
    .transform(function (value, originalValue) {
      if (this.isType(value)) {
        return value;
      }
      const result = parse(originalValue, "dd.MM.yyyy", new Date());
      return result;
    })
    .typeError("Please enter a valid date")
    .required("This is a required field")
    .min("1969-11-13", "Date is too early")
    .max("2015-12-31", "Invalid, the client is too young"),
  pic: Yup.mixed().test("is-valid-type", "Not a valid image type", (value) => {
    return (
      !value ||
      typeof value === "string" ||
      isValidFileType(value && value.name, "image")
    );
  }),
});

const initialValues = {
  firstname: "",
  lastname: "",
  middlename: "",
  sex: "",
  address: "",
  contact: "",
  bdate: "",
  pic: "",
};

const NewClient = () => {
  const [preview, setPreview] = useState(defImage);

  let navigate = useNavigate();

  //handles form submit
  const handleSubmit = (values, { resetForm }) => {
    if (values.pic === "") {
      //set the pic to the default image
      values.pic = null;
    } else {
      //set the pic to the uploaded image
      console.log(values.pic);
    }
    console.log(values);
    resetForm();
  };

  //handle file change
  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      //update the formik value
      console.log(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        //preview
        setPreview(reader.result);
      };
      //read preview as data URL
      reader.readAsDataURL(file);
      setFieldValue("pic", file);
    } else {
      setPreview(defImage);
      setFieldValue("Pic", null);
    }
  };

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/dashboard")}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate("/clients")}>
          Clients
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">Register</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <div className="new-account-form">
            <div className="client-header text-center">
              <h1>Register New Client</h1>
            </div>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                setFieldValue,
                values,
                touched,
                errors,
              }) => (
                <Form onSubmit={handleSubmit}>
                  {/** FIELDS: firstname */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon1"
                      className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
                    >
                      Firstname
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="firstname"
                      placeholder="Enter firstname"
                      value={values.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.firstname && !!errors.firstname}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstname}
                    </Form.Control.Feedback>
                  </InputGroup>
                  {/** FIELDS: middlename */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon2"
                      className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
                    >
                      Middlename
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="middlename"
                      value={values.middlename}
                      placeholder="Enter Middlename"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.middlename && !!errors.middlename}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.middlename}
                    </Form.Control.Feedback>
                  </InputGroup>
                  {/** FIELDS: lastname */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon3"
                      className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
                    >
                      Lastname
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="lastname"
                      placeholder="Enter Lastname"
                      value={values.lastname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.lastname && !!errors.lastname}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastname}
                    </Form.Control.Feedback>
                  </InputGroup>
                  {/** FIELDS: Sex */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon4"
                      className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
                    >
                      Sex
                    </InputGroup.Text>
                    <Form.Select
                      name="sex"
                      value={values.sex}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.sex && !!errors.sex}
                    >
                      <option>-Please Select-</option>
                      <option value={`male`}>Male</option>
                      <option value={`female`}>Female</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.sex}
                    </Form.Control.Feedback>
                  </InputGroup>
                  {/** FIELDS: address */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon4"
                      className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
                    >
                      Address
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Ex. P-1 Poblacion, San Jose, Dinagat Islands"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.address && !!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </InputGroup>
                  {/** FIELDS: contact */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon5"
                      className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
                    >
                      Contact
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ex. 09102547125"
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
                  {/** FIELDS: bdate */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon6"
                      className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
                    >
                      Birthdate
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      title="Birthdate"
                      placeholder="Enter Date Of Birth"
                      name="bdate"
                      value={values.bdate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.bdate && !!errors.bdate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.bdate}
                    </Form.Control.Feedback>
                    {/* <DatePickerField
                        dateFormat="yyyy-MM-dd"
                        //className="form-control w-100"
                        placeholderText="Select your birthdate"
                      /> */}
                  </InputGroup>
                  {/** FIELDS: pic */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon7"
                      className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
                    >
                      Upload Photo
                    </InputGroup.Text>
                    <Form.Control
                      id="photo-upload"
                      type="file"
                      name="pic"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      isInvalid={touched.pic && !!errors.pic}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.pic}
                    </Form.Control.Feedback>
                  </InputGroup>
                  {preview && (
                    <div className="mt-3 text-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                      />
                    </div>
                  )}

                  <div className="d-grid">
                    <Button variant="success" type="submit">
                      Register New Client
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

export default NewClient;

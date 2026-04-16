import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  ProgressBar,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import "./style.css";
import * as Yup from "yup";
import parse from "date-fns/parse";
import { ErrorMessage, Field, Formik } from "formik";
import { useState } from "react";
import defImage from "../../assets/images/default-account.jpg";
import axios from "axios";
import { MdHome } from "react-icons/md";

const validFileExtensions = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp"],
};

function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
}
//validation schemas
//personal info, emergency contact, photo
const validationSchemas = [
  Yup.object({
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
      .min("1900-11-13", "Date is too early")
      .max("2020-12-31", "Invalid, the client is too young"),
  }),
  Yup.object({
    emergencyName: Yup.string().required("This is a required field"),
    emergencyContact: Yup.string()
      .matches(/^[+]?[0-9]{11}$/, "Contact must be a valid mobile no.")
      .required("This is a required field"),
  }),
  Yup.object({
    pic: Yup.mixed().test(
      "is-valid-type",
      "Not a valid image type",
      (value) => {
        return (
          !value ||
          typeof value === "string" ||
          isValidFileType(value && value.name, "image")
        );
      },
    ),
  }),
];

const initialValues = {
  firstname: "",
  lastname: "",
  middlename: "",
  sex: "",
  address: "",
  contact: "",
  bdate: "",
  pic: "",
  emergencyContact: "",
  emergencyName: "",
};

const AddClient = () => {
  const [preview, setPreview] = useState(defImage);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  let navigate = useNavigate();

  //handles form submit
  const handleSubmit = (values, { resetForm }) => {
    try {
      //prepare form data
      const formData = new FormData();
      // Append all other form fields
      for (const key in values) {
        if (key === "pic" && values.pic) {
          formData.append(key, values.pic); // Append file if it exists
        } else if (key !== "pic") {
          formData.append(key, values[key]); // Append other fields
          console.log(key, values[key]);
        }
      }
      // if (values.pic === "") {
      //   //set the pic to the default image
      //   values.pic = null;
      // }
      console.log(formData);
      //save to the database
      // Send formData to the server
      axios
        .post("/api/clients/new", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(response.data);
          alert(response.data.message);
        });

      setCurrentStep(1);
      //reset form values to initial values
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    }
  };

  //handle file change for adding picture
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

  //handle next step
  const handleNext = (validateForm, setFieldTouched) => {
    //console.log(currentStep);
    validateForm().then((errors) => {
      //mark all fields touched to show errors
      Object.keys(errors).forEach((field) => setFieldTouched(field, true));
      if (Object.keys(errors).length === 0 && currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    });
  };

  //handle previous
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  //Render the form content for each step
  const renderStepCount = (setFieldValue) => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-3">
              <h4>Step 1: Personal Information</h4>
            </div>
            {/** FIELDS: firstname */}
            <div className="mb-3">
              <label htmlFor="firstname">Firstname</label>
              <Field
                name="firstname"
                type="text"
                className="form-control"
                placeholder="Enter your firstname"
              />
              <ErrorMessage
                name="firstname"
                component="div"
                className="text-danger"
              />
            </div>
            {/** FIELDS: middlename */}
            <div className="mb-3">
              <label htmlFor="middlename">Middlename</label>
              <Field
                name="middlename"
                type="text"
                className="form-control"
                placeholder="Enter your middlename"
              />
              <ErrorMessage
                name="middlename"
                component="div"
                className="text-danger"
              />
            </div>
            {/** FIELDS: lastname */}
            <div className="mb-3">
              <label htmlFor="lastname">Lastname</label>
              <Field
                name="lastname"
                type="text"
                className="form-control"
                placeholder="Enter your lastname"
              />
              <ErrorMessage
                name="lastname"
                component="div"
                className="text-danger"
              />
            </div>
            {/** FIELDS: Sex */}
            <div className="mb-3">
              <label htmlFor="sex">Sex</label>
              <Field
                as="select" // Changes input type to a dropdown
                name="sex"
                className="form-control"
              >
                <option value="" disabled>
                  Select your sex
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage
                name="sex"
                component="div"
                className="text-danger"
              />
            </div>
            {/** FIELDS: address */}
            <div className="mb-3">
              <label htmlFor="address">Address</label>
              <Field
                name="address"
                type="text"
                className="form-control"
                placeholder="Enter your address"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-danger"
              />
            </div>
            {/** FIELDS: contact */}
            <div className="mb-3">
              <label htmlFor="contact">Contact Number</label>
              <Field
                name="contact"
                type="text"
                className="form-control"
                placeholder="Enter your contact"
              />
              <ErrorMessage
                name="contact"
                component="div"
                className="text-danger"
              />
            </div>
            {/** FIELDS: bdate */}
            <div className="mb-3">
              <label htmlFor="date">Date of Birth</label>
              <Field
                name="bdate"
                type="date"
                className="form-control"
                placeholder="Enter your date of birth"
              />
              <ErrorMessage
                name="bdate"
                component="div"
                className="text-danger"
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-3">
              <h4>Step2: Emergency Contact Information</h4>
            </div>
            {/** FIELDS: emergency Name */}
            <div className="mb-3">
              <label htmlFor="emergencyName">Name</label>
              <Field
                name="emergencyName"
                type="text"
                className="form-control"
                placeholder="Enter emegency contact name"
              />
              <ErrorMessage
                name="emergencyName"
                component="div"
                className="text-danger"
              />
            </div>
            {/** FIELDS: emergency contact */}
            <div className="mb-3">
              <label htmlFor="emergencyContact">Contact Number</label>
              <Field
                name="emergencyContact"
                type="text"
                className="form-control"
                placeholder="Enter emergency contact number"
              />
              <ErrorMessage
                name="emergencyContact"
                component="div"
                className="text-danger"
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-3">
              <h4>Step 3: Client Photo</h4>
            </div>
            {/** FIELDS: pic */}
            <div className="mb-3">
              <label htmlFor="pic" className="form-label">
                Upload Photo
              </label>
              <input
                type="file"
                id="photo"
                name="pic"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setFieldValue)}
              ></input>
              <ErrorMessage
                name="pic"
                component="div"
                className="text-danger"
              />
            </div>
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
          </>
        );

      default:
        return null;
    }
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
              validationSchema={validationSchemas[currentStep - 1]}
            >
              {({
                handleSubmit,
                validateForm,
                setFieldTouched,
                setFieldValue,
                isSubmitting,
              }) => (
                <Form onSubmit={handleSubmit}>
                  {/**Steppers progress bar */}
                  <ProgressBar
                    now={(currentStep / totalSteps) * 100}
                    className="mb-4"
                  />
                  {/**Render content */}
                  {renderStepCount(setFieldValue)}
                  {/**Navigation Buttons */}
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="secondary"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      Back
                    </Button>
                    {currentStep < totalSteps ? (
                      <Button
                        variant="primary"
                        onClick={() =>
                          handleNext(validateForm, setFieldTouched)
                        }
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        Submit
                      </Button>
                    )}
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

export default AddClient;

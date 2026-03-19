import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import {
  MdCalendarToday,
  MdCategory,
  MdEditDocument,
  MdHome,
  MdInfo,
  MdMoney,
} from "react-icons/md";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import defImage from "../../assets/images/default-account.jpg";
// import { format } from "date-fns";
import ExpenseInfoModal from "./ExpenseInfoModal";
import ExpenseTable from "./ExpenseTable";

const validFileExtensions = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp"],
};

function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("This is a required field"),
  expdate: Yup.string().required("This is a required field"),
  category: Yup.string().required("This is a required field"),
  description: Yup.string().required("This is a required field"),
  amount: Yup.number().required("This is a required field"),
  image: Yup.mixed().test(
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
});

const initialValues = {
  title: "",
  expdate: "",
  category: "",
  amount: "",
  description: "",
  image: "",
};

const Expenses = () => {
  let navigate = useNavigate();
  const [listExpenses, setListExpenses] = useState([]);

  //expense details modal
  const [expDetailsModal, setExpDetailsModal] = useState(false);
  const [expDetailsModalData, setExpDetailsModalData] = useState(null);

  //new expenses modal
  const [newExpModalShow, setNewExpModalShow] = useState(false);

  //image preview
  const [preview, setPreview] = useState(defImage);

  //reload flag
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    axios.get("/api/expenses/").then((response) => {
      console.log(response.data);
      setListExpenses(response.data);
    });
  }, [reloadFlag]);

  //handles new Expense Modal
  const handleModalNewShow = () => setNewExpModalShow(true);
  const handleNewModalClose = () => setNewExpModalShow(false);

  //handles new Expense Modal On sUbmit
  const handleNewModalSubmit = (values, { resetForm }) => {
    console.log("Values:", values);
    //create a new form data
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("expdate", values.expdate);
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("amount", values.amount);

    if (values.image) {
      formData.append("pic", values.image);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    //save to database
    axios
      .post("/api/expenses/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log(response.data);
        alert(response.data.message);
        resetForm();
        setReloadFlag(!reloadFlag);
        handleNewModalClose();
      });
  };

  //handle view expense details
  const handleExpViewShow = (expense) => {
    //set data to be displayed on the modal
    setExpDetailsModalData(expense);
    setExpDetailsModal(true);
  };
  const handleExpViewClose = () => setExpDetailsModal(false);

  //image file change
  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); //set preview
      };
      //read preview as dataURL
      reader.readAsDataURL(file);
      setFieldValue("image", file);
    } else {
      setPreview(defImage);
      setFieldValue("image", null);
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
        <Breadcrumb.Item href="#">Expenses</Breadcrumb.Item>
      </Breadcrumb>

      <div className="subscription mb-3 text-center">
        <h1> Gym Expenses List </h1>
      </div>
      {/**Create new Expenses Button */}
      <Row>
        <Col md={{ span: 4, offset: 8 }}>
          <div className="d-grid mb-3">
            <Button variant="outline-success" onClick={handleModalNewShow}>
              {" "}
              Create new Expense{" "}
            </Button>
          </div>
        </Col>
      </Row>
      {/**Row for the table */}
      <Row>
        <Col>
          <ExpenseTable
            listOfExpenses={listExpenses}
            handleViewDetails={handleExpViewShow}
            isReport={false}
          />
        </Col>
      </Row>
      {/**Modal for adding new Expense Data */}
      <Modal show={newExpModalShow} onHide={handleNewModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleNewModalSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                {/**Title */}
                <Form.Label className="label-left">Expense Name</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="title-addon">
                    <MdEditDocument />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter expense name"
                    aria-label="title"
                    aria-describedby="title-addon"
                    name="title"
                    value={values.title}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.title && !!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </InputGroup>
                {/**Description */}
                <Form.Label className="label-left">Description</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="title-addon">
                    <MdInfo />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    aria-label="description"
                    aria-describedby="description-addon"
                    name="description"
                    value={values.description}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.description && !!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </InputGroup>
                {/**Category */}
                <Form.Label className="label-left">Category</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="duration-addon">
                    <MdCategory />
                  </InputGroup.Text>
                  <Form.Select
                    title="Duration"
                    name="category"
                    value={values.category}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.category && !!errors.category}
                  >
                    <option value={""}>-Select Category-</option>
                    <option value={`Gym Utilities`}>Gym Utilities </option>
                    <option value={`Others`}>Others</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </InputGroup>
                {/**Date */}
                <Form.Label className="label-left">Date</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="duration-addon">
                    <MdCalendarToday />
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="expdate"
                    aria-label="expdate"
                    aria-describedby="expdate-addon"
                    value={values.expdate}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.expdate && !!errors.expdate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {" "}
                    {errors.expdate}{" "}
                  </Form.Control.Feedback>
                </InputGroup>
                {/**Amount */}
                <Form.Label className="label-left">Amount</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="amount-addon">
                    <MdMoney />
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    aria-label="amount"
                    aria-describedby="amount-addon"
                    name="amount"
                    value={values.amount}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.amount && !!errors.amount}
                  />
                  <InputGroup.Text>.00</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </InputGroup>
                {/** FIELDS: pic */}
                <Form.Label className="label-left">Upload Photo</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    id="photo-upload"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    isInvalid={touched.image && !!errors.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
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
                  <Button
                    variant="success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Create
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <ExpenseInfoModal
        show={expDetailsModal}
        data={expDetailsModalData}
        handleClose={handleExpViewClose}
      />
    </Container>
  );
};

export default Expenses;

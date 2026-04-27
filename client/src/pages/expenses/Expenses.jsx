import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";

import { useNavigate } from "react-router";
import * as Yup from "yup";
import defImage from "../../assets/images/default-account.jpg";
import ExpenseInfoModal from "./ExpenseInfoModal";
import ExpenseTable from "./ExpenseTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

import {
  MdCalendarToday,
  MdCategory,
  MdEditDocument,
  MdHome,
  MdInfo,
  MdMoney,
  MdSearch,
} from "react-icons/md";

const initialValues = {
  title: "",
  expdate: "",
  category: "",
  amount: "",
  description: "",
  image: "",
};

const Expenses = () => {
  const queryClient = useQueryClient();
  let navigate = useNavigate();

  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchKey, setSearchKey] = useState("");

  // Modals state
  const [expDetailsModal, setExpDetailsModal] = useState(false);
  const [expDetailsModalData, setExpDetailsModalData] = useState(null);
  const [newExpModalShow, setNewExpModalShow] = useState(false);

  // image preview
  const [preview, setPreview] = useState(defImage);

  // Use TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expenses", currentPage, searchKey, limit],
    queryFn: () =>
      axios
        .get(
          `/api/expenses?page=${currentPage}&limit=${limit}&search=${searchKey}`,
        )
        .then((res) => res.data),
  });

  // Mutation for adding new expense
  const mutation = useMutation({
    mutationFn: (newExpense) =>
      axios.post("/api/expenses/new", newExpense, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: (res) => {
      alert(res.data.message);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expensesSummary"] });
      handleNewModalClose();
    },
    onError: (error) => {
      alert(error.response?.data?.message || "An error occurred");
    },
  });

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleModalNewShow = () => setNewExpModalShow(true);
  const handleNewModalClose = () => {
    setNewExpModalShow(false);
    setPreview(defImage);
  };

  const handleNewModalSubmit = (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("expdate", values.expdate);
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("amount", values.amount);

    if (values.image) {
      formData.append("pic", values.image);
    }

    mutation.mutate(formData, {
      onSettled: () => {
        setSubmitting(false);
        resetForm();
      },
    });
  };

  const handleExpViewShow = (expense) => {
    setExpDetailsModalData(expense);
    setExpDetailsModal(true);
  };
  const handleExpViewClose = () => setExpDetailsModal(false);

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFieldValue("image", file);
    } else {
      setPreview(defImage);
      setFieldValue("image", null);
    }
  };

  if (isError)
    return (
      <div className="text-center text-danger p-5">Error: {error.message}</div>
    );

  const listOfExpenses = data?.expenses || [];
  const totalPages = data?.totalPages || 0;

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

      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <MdSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search expenses..."
              value={searchKey}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col md={{ span: 4, offset: 4 }}>
          <div className="d-grid">
            <Button variant="outline-success" onClick={handleModalNewShow}>
              Create new Expense
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {isLoading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <ExpenseTable
              listOfExpenses={listOfExpenses}
              handleViewDetails={handleExpViewShow}
              isReport={false}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </Col>
      </Row>

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
                <Form.Label className="label-left">Expense Name</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="title-addon">
                    <MdEditDocument />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter expense name"
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

                <Form.Label className="label-left">Description</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="desc-addon">
                    <MdInfo />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
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

                <Form.Label className="label-left">Category</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="duration-addon">
                    <MdCategory />
                  </InputGroup.Text>
                  <Form.Select
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

                <Form.Label className="label-left">Date</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="expdate-addon">
                    <MdCalendarToday />
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="expdate"
                    value={values.expdate}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.expdate && !!errors.expdate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.expdate}
                  </Form.Control.Feedback>
                </InputGroup>

                <Form.Label className="label-left">Amount</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="amount-addon">
                    <MdMoney />
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    name="amount"
                    value={values.amount}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.amount && !!errors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </InputGroup>

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
                    disabled={isSubmitting || mutation.isLoading}
                  >
                    {mutation.isLoading ? "Creating..." : "Create"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
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

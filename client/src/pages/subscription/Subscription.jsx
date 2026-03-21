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
  Table,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  MdCategory,
  MdDataUsage,
  MdDelete,
  MdDescription,
  MdEdit,
  MdHome,
  MdMoney,
  MdViewAgenda,
} from "react-icons/md";
import { Formik } from "formik";
import * as Yup from "yup";
import AlertCustom from "../../Components/AlertCustom";
import ClientSubs from "./ClientSubs";
import UpdateSubsModal from "./UpdateSubsModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

//validation schema in yup
const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category field is required"),
  amount: Yup.number().required("Amount field is required"),
  duration: Yup.string().required("Duration field is required"),
  description: Yup.string().required("Description is required"),
});

//initial values for subscription
const initialValues = {
  category: "",
  amount: "",
  description: "",
  duration: "",
};

const Subscription = () => {
  const queryClient = useQueryClient();
  let navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [deleteId, setDeleteId] = useState();

  //for clients list modal
  const [clientListModalShow, setClientListModalShow] = useState(false);
  const [clientListModalData, setClientListModalData] = useState({
    category: "",
    id: "",
  });

  //for update modal
  const [subsUpdateModal, setSubsUpdateModal] = useState(false);
  const [subsUpdateModalData, setSubsUpdateModalData] = useState({});

  // Use TanStack Query
  const { data: listOfSubs = [], isLoading, isError, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => axios.get("/api/subscriptions/").then((res) => res.data),
  });

  // Mutation for creating new subscription
  const createMutation = useMutation({
    mutationFn: (newSubs) => axios.post("/api/subscriptions/new", newSubs),
    onSuccess: (res) => {
      alert(res.data.message);
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptionCategories"] }); // For NewPaymentModal
      handleModalClose();
    },
  });

  // Mutation for deleting subscription
  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/subscriptions/${id}`),
    onSuccess: (res) => {
      alert(res.data.message);
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptionCategories"] });
    },
  });

  //handle modal show
  const handleModalShow = () => setModalShow(true);
  //handle modal close
  const handleModalClose = () => setModalShow(false);

  //handle create new modal submit
  const handleModalSubmit = (values, { resetForm, setSubmitting }) => {
    createMutation.mutate(values, {
      onSettled: () => {
        setSubmitting(false);
        resetForm();
      }
    });
  };

  //handle viewClientsModal
  const handleViewClientsModalShow = (data) => {
    const { id, category } = data;
    setClientListModalData({ id: id, category: category });
    setClientListModalShow(true);
  };

  const handleViewClientsModalClose = () => setClientListModalShow(false);

  //handleDeleteConfirmation
  const deleteConfirmation = (id) => {
    setAlertShow(true);
    setDeleteId(id);
  };

  //handle alert close
  const handleAlertClose = () => setAlertShow(false);

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleAlertClose();
  };

  //updateModal show
  const handleSubsUpdateShow = (subs) => {
    setSubsUpdateModalData(subs);
    setSubsUpdateModal(true);
  };
  //updatemodal close
  const handleSubsUpdateClose = () => setSubsUpdateModal(false);

  if (isError) return <div className="text-center text-danger p-5">Error: {error.message}</div>;

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/")}>
          <MdHome />
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate("/dashboard")}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">Subscription</Breadcrumb.Item>
      </Breadcrumb>
      {/**Alert */}
      <AlertCustom
        show={alertShow}
        handleClose={handleAlertClose}
        type={"Deletion"}
        id={deleteId}
        onDeletion={handleDelete}
      />
      <div className="subscription mb-3 text-center">
        <h1> Gym Subscription List </h1>
      </div>
      {/**Create new Subscription */}
      <Row>
        <Col md={{ span: 4, offset: 8 }}>
          <div className="d-grid mb-3">
            <Button variant="outline-success" onClick={handleModalShow}>
              Create new Subscription
            </Button>
          </div>
        </Col>
      </Row>
      {/**Subs Table row */}
      <Row>
        <Col>
          {isLoading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Subscription Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th style={{ width: "200px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listOfSubs.map((subs, key) => {
                  const dur = subs.duration == 0 ? "Lifetime" : `${subs.duration} days`;
                  return (
                    <tr key={subs.id || key}>
                      <td>{key + 1}</td>
                      <td>{subs.category}</td>
                      <td>{subs.description}</td>
                      <td>{subs.amount}</td>
                      <td>{dur}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="warning"
                          title="Edit"
                          onClick={() => handleSubsUpdateShow(subs)}
                        >
                          <MdEdit />
                        </Button>{" "}
                        <Button
                          size="sm"
                          variant="info"
                          title="View Clients"
                          onClick={() => handleViewClientsModalShow(subs)}
                        >
                          <MdViewAgenda />
                        </Button>{" "}
                        <Button
                          size="sm"
                          variant="danger"
                          title="Delete"
                          onClick={() => deleteConfirmation(subs.id)}
                        >
                          <MdDelete />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      {/**Modal for adding new data */}
      <Modal
        show={modalShow}
        onHide={handleModalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleModalSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Label className="label-left">Category</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="category-addon">
                    <MdCategory />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter category"
                    name="category"
                    value={values.category}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.category && !!errors.category}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </InputGroup>
                <Form.Label className="label-left">Description</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="desc-addon">
                    <MdDescription />
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
                  <InputGroup.Text>.00</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </InputGroup>
                <Form.Label className="label-left">Duration</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="duration-addon">
                    <MdDataUsage />
                  </InputGroup.Text>
                  <Form.Select
                    title="Duration"
                    name="duration"
                    value={values.duration}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.duration && !!errors.duration}
                  >
                    <option value={""}>-Select Duration (in days)-</option>
                    <option value={`1`}>1 - (One) </option>
                    <option value={`30`}>30 - (Thirty)</option>
                    <option value={`0`}>Lifetime</option>
                  </Form.Select>
                  <InputGroup.Text>days</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.duration}
                  </Form.Control.Feedback>
                </InputGroup>
                <div className="d-grid">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={isSubmitting || createMutation.isLoading}
                  >
                    {createMutation.isLoading ? "Creating..." : "Create"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {/**Modal for updating the subscription */}
      <UpdateSubsModal
        modalShow={subsUpdateModal}
        validationSchema={validationSchema}
        data={subsUpdateModalData}
        handleModalClose={handleSubsUpdateClose}
      />
      {/**Modal for viewing client list */}
      <ClientSubs
        show={clientListModalShow}
        handleClose={handleViewClientsModalClose}
        subsCategory={clientListModalData}
      />
    </Container>
  );
};

export default Subscription;

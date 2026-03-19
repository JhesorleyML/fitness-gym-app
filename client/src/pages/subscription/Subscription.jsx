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
  Table,
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
  let navigate = useNavigate();

  const [listOfSubs, setListOfSubs] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);

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

  //fetch data from the database and store into an array listOfSubs
  useEffect(() => {
    axios.get("/api/subscriptions/").then((response) => {
      //console.log(response.data);
      setListOfSubs(response.data);
    });
  }, [reloadFlag]);

  //handle modal show
  const handleModalShow = () => {
    //console.log(modalShow);
    setModalShow(true);
  };
  //handle modal close
  const handleModalClose = () => setModalShow(false);

  //handle create new modal submit
  const handleModalSubmit = (values, { resetForm }) => {
    //save the date to the database:
    axios
      .post("http://localhost:3005/api/subscriptions/new", values)
      .then((response) => {
        //console.log(response.data);
        alert(response.data.message);
        //trigger the useEffect to refetch the data
        setReloadFlag(!reloadFlag);
      });
    //modal form fields is set to initial values
    resetForm();

    //close the modal
    handleModalClose();

    //create new subs
    //setListOfSubs((prev) => [...prev, values]);
  };

  //handle viewClientsModal
  const handleViewClientsModalShow = (data) => {
    //console.log(data);
    const { id, category } = data;
    setClientListModalData({ id: id, category: category });
    setClientListModalShow(true);
    //console.log(clientListModalData);
  };

  const handleViewClientsModalClose = () => {
    setClientListModalShow(false);
  };

  //handleDeleteConfirmation
  const deleteConfirmation = (id) => {
    setAlertShow(true);
    setDeleteId(id);
  };

  //handle alert close
  const handleAlertClose = () => {
    setAlertShow(false);
  };

  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:3005/api/subscriptions/${id}`)
      .then((response) => {
        console.log(response.data);
        const message = `${response.data.message}`;
        alert(message);
        //reload
        setReloadFlag(!reloadFlag);
      });
    handleAlertClose();
  };

  //updateModal show
  const handleSubsUpdateShow = (subs) => {
    //console.log(subs);
    setSubsUpdateModalData(subs);
    setSubsUpdateModal(true);
  };
  //updatemodal close
  const handleSubsUpdateClose = () => {
    setSubsUpdateModal(false);
  };
  //updateModal OnSubmit
  const handleSubsUpdateModalSubmit = () => {
    //close the modal
    handleSubsUpdateClose();
    //tell react to rerender table
    setReloadFlag(!reloadFlag);
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
              {" "}
              Create new Subscription{" "}
            </Button>
          </div>
        </Col>
      </Row>
      {/**Subs Table row */}
      <Row>
        <Col>
          <Table striped bordered hover>
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
                const dur = subs.duration == 0 ? "Lifetime" : subs.duration;
                return (
                  <tr key={key}>
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
                {/**Category */}
                <Form.Label className="label-left">Category</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="category-addon">
                    <MdCategory />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter category"
                    aria-label="category"
                    aria-describedby="category-addon"
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
                {/**Description */}
                <Form.Label className="label-left">Description</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="desc-addon">
                    <MdDescription />
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
                {/**Duration */}
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
      {/**Modal for updating the subscription */}
      <UpdateSubsModal
        modalShow={subsUpdateModal}
        validationSchema={validationSchema}
        data={subsUpdateModalData}
        handleModalClose={handleSubsUpdateClose}
        handleModalSubmit={handleSubsUpdateModalSubmit}
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

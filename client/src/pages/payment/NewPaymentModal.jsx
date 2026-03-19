import PropTypes from "prop-types";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { MdCategory, MdMonetizationOn, MdPerson2 } from "react-icons/md";
import { useEffect, useState } from "react";

const validationSchema = Yup.object().shape({
  clientId: Yup.string().required("Client name is required."),
  subsId: Yup.string().required("Subscription type is a required field"),
  amount: Yup.number().required("This field is required"),
});

const initialValues = {
  clientId: "",
  subsId: "",
  amount: "",
};

const NewPaymentModal = ({
  show,
  handleClose,
  handleReloadOnSubmit,
  userId,
}) => {
  //list of clients
  const [listOfClients, setListOfClients] = useState([]);

  //list of category
  const [listOfCategory, setListOfCategory] = useState([]);

  const [duration, setDuration] = useState("");

  //fetch data for the list of Clients and list of Category
  useEffect(() => {
    axios.get("http://localhost:3005/api/clients/").then((response) => {
      //console.log(response.data);
      const clients = response.data.map((clientData) => {
        const fullname = `${clientData.firstname} ${clientData.middlename} ${clientData.lastname} `;
        const id = clientData.id;
        const data = { id, fullname };
        return data;
      });
      //console.log(clients);
      setListOfClients(clients);
    });

    axios.get("http://localhost:3005/api/subscriptions/").then((response) => {
      //console.log(response.data);
      setListOfCategory(response.data);
    });
  }, []);

  const handleSubsChange = (event, { setFieldValue }) => {
    const selectedIndex = event.target.value;
    //console.log(selectedIndex);
    const selectedCategory = listOfCategory.find(
      (subs) => subs.id.toString() === selectedIndex,
    );
    setFieldValue("subsId", selectedIndex);
    setFieldValue("amount", selectedCategory?.amount || "");
    setDuration(selectedCategory?.duration || "");
    //console.log(selectedCategory);
    //setAmount(selectedCategory?.amount || "");
  };

  const handleModalSubmit = (values, { setSubmitting, resetForm }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const datestart = formattedDate;
    const paymentdate = formattedDate;

    const formData = {
      ...values,
      datestart,
      paymentdate,
      duration,
      userId,
    };
    //console.log(formData);
    //submit the form
    axios.post("/api/clientsubs/new", formData).then((response) => {
      alert(response.data.message);
      //call the reload
      handleReloadOnSubmit();
    });

    //reset the form
    resetForm();

    //close the modal
    setSubmitting(false);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard="false">
      <Modal.Header closeButton>
        <Modal.Title> New Payment Transaction </Modal.Title>
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
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              {/**Client Name */}
              <Form.Label className="label-left">Client Name</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="name-addon" className="bg-info">
                  <MdPerson2 />
                </InputGroup.Text>
                <Form.Select
                  className="form-control"
                  aria-label="name"
                  aria-describedby="name-addon"
                  name="clientId"
                  value={values.clientId}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.clientId && !!errors.clientId}
                >
                  <option value={""} disabled>
                    Please Select Client
                  </option>
                  {
                    //map the list of clients to the dropdown box
                    listOfClients.map((client, key) => (
                      <option key={key} value={client.id}>
                        {client.fullname}
                      </option>
                    ))
                  }
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.clientId}
                </Form.Control.Feedback>
              </InputGroup>
              {/**Subscription */}
              <Form.Label className="label-left">Subscription Type</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="subs-addon" className="bg-info">
                  <MdCategory />
                </InputGroup.Text>
                <Form.Select
                  className="form-control"
                  aria-label="subs"
                  aria-describedby="subs-addon"
                  name="subsId"
                  onChange={(event) =>
                    handleSubsChange(event, { setFieldValue })
                  }
                  value={values.subsId}
                  onBlur={handleBlur}
                  isInvalid={touched.subsId && !!errors.subsId}
                >
                  <option value={""} disabled>
                    Please Select Subscription Type
                  </option>
                  {
                    //map the list of clients to the dropdown box
                    listOfCategory.map((subs, key) => (
                      <option key={key} value={subs.id}>
                        {subs.category}
                      </option>
                    ))
                  }
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.subsId}
                </Form.Control.Feedback>
              </InputGroup>
              {/**Amount field */}
              <Form.Label className="label-left">Amount</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="amount-addon" className="bg-info">
                  <MdMonetizationOn />
                </InputGroup.Text>
                <Form.Control
                  readOnly
                  className="form-control"
                  aria-label="amount"
                  aria-describedby="amount-addon"
                  name="amount"
                  type="text"
                  value={values.amount}
                  onBlur={handleBlur}
                  isInvalid={touched.duration && !!errors.duration}
                />
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </InputGroup>
              <div className="d-grid">
                <Button
                  variant="outline-primary"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Submit Payment
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

NewPaymentModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleReloadOnSubmit: PropTypes.func,
  userId: PropTypes.number,
};

export default NewPaymentModal;

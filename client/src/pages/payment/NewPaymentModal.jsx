import PropTypes from "prop-types";
import { Button, Form, InputGroup, Modal, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { MdCategory, MdMonetizationOn, MdPerson2 } from "react-icons/md";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  userId,
}) => {
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState("");

  // Use TanStack Query for dependencies
  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ["clientsForSelect"],
    queryFn: () => axios.get("/api/clients/").then(res => 
      res.data.map(c => ({
        id: c.id,
        fullname: `${c.firstname} ${c.middlename} ${c.lastname}`
      }))
    ),
    enabled: show, // Only fetch when modal is open
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["subscriptionCategories"],
    queryFn: () => axios.get("/api/subscriptions/").then(res => res.data),
    enabled: show,
  });

  // Mutation for adding payment
  const mutation = useMutation({
    mutationFn: (newPayment) => axios.post("/api/clientsubs/new", newPayment),
    onSuccess: (response) => {
      alert(response.data.message || "Payment recorded successfully");
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["paymentsSummary"] });
      handleClose();
    },
    onError: (error) => {
      alert(error.response?.data?.message || "An error occurred");
    }
  });

  const handleSubsChange = (event, { setFieldValue }) => {
    const selectedId = event.target.value;
    const selectedCategory = categories.find(
      (subs) => subs.id.toString() === selectedId,
    );
    setFieldValue("subsId", selectedId);
    setFieldValue("amount", selectedCategory?.amount || "");
    setDuration(selectedCategory?.duration || "");
  };

  const handleModalSubmit = (values, { setSubmitting, resetForm }) => {
    const formattedDate = new Date().toISOString().split("T")[0];
    
    const payload = {
      ...values,
      datestart: formattedDate,
      paymentdate: formattedDate,
      duration,
      userId,
    };

    mutation.mutate(payload, {
      onSettled: () => {
        setSubmitting(false);
        resetForm();
      }
    });
  };

  const isLoadingDeps = loadingClients || loadingCategories;

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title> New Payment Transaction </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoadingDeps ? (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" /> Loading options...
          </div>
        ) : (
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
                  <InputGroup.Text id="name-addon" className="bg-info text-white">
                    <MdPerson2 />
                  </InputGroup.Text>
                  <Form.Select
                    name="clientId"
                    value={values.clientId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.clientId && !!errors.clientId}
                  >
                    <option value={""} disabled>
                      Please Select Client
                    </option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.fullname}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.clientId}
                  </Form.Control.Feedback>
                </InputGroup>

                {/**Subscription */}
                <Form.Label className="label-left">Subscription Type</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="subs-addon" className="bg-info text-white">
                    <MdCategory />
                  </InputGroup.Text>
                  <Form.Select
                    name="subsId"
                    onChange={(event) => handleSubsChange(event, { setFieldValue })}
                    value={values.subsId}
                    onBlur={handleBlur}
                    isInvalid={touched.subsId && !!errors.subsId}
                  >
                    <option value={""} disabled>
                      Please Select Subscription Type
                    </option>
                    {categories.map((subs) => (
                      <option key={subs.id} value={subs.id}>
                        {subs.category}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.subsId}
                  </Form.Control.Feedback>
                </InputGroup>

                {/**Amount field */}
                <Form.Label className="label-left">Amount</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="amount-addon" className="bg-info text-white">
                    <MdMonetizationOn />
                  </InputGroup.Text>
                  <Form.Control
                    readOnly
                    name="amount"
                    type="text"
                    value={values.amount}
                    onBlur={handleBlur}
                  />
                </InputGroup>

                <div className="d-grid mt-4">
                  <Button
                    variant="primary"
                    disabled={isSubmitting || mutation.isLoading}
                    type="submit"
                  >
                    {mutation.isLoading ? "Processing..." : "Submit Payment"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Modal.Body>
    </Modal>
  );
};

NewPaymentModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  userId: PropTypes.number,
};

export default NewPaymentModal;

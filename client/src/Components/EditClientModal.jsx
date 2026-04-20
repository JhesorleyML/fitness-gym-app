import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required("Firstname is required"),
  lastname: Yup.string().required("Lastname is required"),
  middlename: Yup.string(),
  address: Yup.string().required("Address is required"),
  sex: Yup.string().required("Sex is required"),
  contactno: Yup.string().required("Contact number is required"),
  bdate: Yup.date().required("Birthdate is required"),
  emergencyName: Yup.string().required("Emergency name is required"),
  emergencyContact: Yup.string().required("Emergency contact is required"),
  pic: Yup.mixed().nullable(),
});

const EditClientModal = ({ show, handleClose, client }) => {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (client) {
      setPreview(client.pic || null);
    }
  }, [client]);

  const mutation = useMutation({
    mutationFn: (formData) =>
      axios.put(`/api/clients/update/${client.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      alert("Client information updated successfully!");
      handleClose();
    },
    onError: (error) => {
      alert(
        error.response?.data?.message || "An error occurred during update.",
      );
    },
  });

  if (!client) return null;

  const initialValues = {
    firstname: client.firstname || "",
    lastname: client.lastname || "",
    middlename: client.middlename || "",
    address: client.address || "",
    sex: client.sex || "",
    contactno: client.contactno || "",
    bdate: client.bdate ? format(new Date(client.bdate), "yyyy-MM-dd") : "",
    emergencyName: client.EmergencyContact?.name || "",
    emergencyContact: client.EmergencyContact?.contact || "",
    pic: null,
  };

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("pic", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("fname", values.firstname);
    formData.append("lname", values.lastname);
    formData.append("mname", values.middlename);
    formData.append("address", values.address);
    formData.append("bdate", values.bdate);
    formData.append("contact", values.contactno);
    formData.append("sex", values.sex);
    formData.append("ename", values.emergencyName);
    formData.append("econtact", values.emergencyContact);

    if (values.pic) {
      formData.append("pic", values.pic);
    } else {
      // If no new pic, send the existing filename to keep it
      formData.append(
        "pic",
        client.pic ? client.pic.split("/").pop() : "default.jpg",
      );
    }

    mutation.mutate(formData, {
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Client Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
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
              <Row>
                <Col md={4} className="text-center mb-4">
                  <img
                    src={preview || "/default-account.jpg"}
                    alt="Preview"
                    className="rounded-circle border mb-2"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <Form.Group>
                    <Form.Label className="btn btn-outline-primary btn-sm">
                      Change Photo
                      <Form.Control
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                      />
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <h5 className="text-primary mb-3">Personal Information</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control
                          name="firstname"
                          value={values.firstname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.firstname && !!errors.firstname}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control
                          name="lastname"
                          value={values.lastname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.lastname && !!errors.lastname}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Middlename</Form.Label>
                        <Form.Control
                          name="middlename"
                          value={values.middlename}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Sex</Form.Label>
                        <Form.Select
                          name="sex"
                          value={values.sex}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.sex && !!errors.sex}
                        >
                          <option value="">Select Sex</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Birthdate</Form.Label>
                    <Form.Control
                      type="date"
                      name="bdate"
                      value={values.bdate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.bdate && !!errors.bdate}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      name="contactno"
                      value={values.contactno}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.contactno && !!errors.contactno}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.address && !!errors.address}
                />
              </Form.Group>

              <h5 className="text-primary mt-4 mb-3">Emergency Contact</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Contact Name</Form.Label>
                    <Form.Control
                      name="emergencyName"
                      value={values.emergencyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.emergencyName && !!errors.emergencyName
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      name="emergencyContact"
                      value={values.emergencyContact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.emergencyContact && !!errors.emergencyContact
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || mutation.isLoading}
                >
                  {isSubmitting || mutation.isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Client Information"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

// ClientInfoModal.propTypes = {
//   data: PropTypes.object,
//   handleClose: PropTypes.func,
//   show: PropTypes.bool,
// };

EditClientModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  client: PropTypes.object,
};

export default EditClientModal;

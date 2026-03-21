import { useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";
import PaymentTable from "./PaymentTable";
import NewPaymentModal from "./NewPaymentModal";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { MdHome, MdSearch } from "react-icons/md";
import PaymentInfoModal from "./PaymentInfoModal";
import { useQuery } from "@tanstack/react-query";

const Payment = ({ userId }) => {
  let navigate = useNavigate();
  
  // Pagination and Search states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchKey, setSearchKey] = useState("");

  // Modals state
  const [newPaymentModalShow, setnewPaymentModalShow] = useState(false);
  const [paymentDetailsModalShow, setPaymentDetailsModalShow] = useState(false);
  const [paymentDetailsModalData, setPaymentDetailsModalData] = useState({});

  // Use TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payments", currentPage, searchKey, limit],
    queryFn: () => 
      axios.get(`/api/payments?page=${currentPage}&limit=${limit}&search=${searchKey}`)
        .then(res => res.data),
  });

  // format data to be displayed
  const formattedPayments = data?.payments.map((paymentData) => {
    const { firstname, middlename, lastname } =
      paymentData.ClientSubscription.ClientInfo;
    const fullname = `${firstname} ${middlename} ${lastname} `;
    const formattedDate = format(
      new Date(paymentData.paymentdate),
      "MM/dd/yyyy",
    );
    return { ...paymentData, fullname, formattedDate };
  }) || [];

  const totalPages = data?.totalPages || 0;

  const handleModalClose = () => setnewPaymentModalShow(false);
  const handleModalOpen = () => setnewPaymentModalShow(true);

  const handleViewDetailsShow = (payment) => {
    setPaymentDetailsModalData(payment);
    setPaymentDetailsModalShow(true);
  };

  const handleViewDetailsClose = () => setPaymentDetailsModalShow(false);

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        <Breadcrumb.Item href="#">Payments</Breadcrumb.Item>
      </Breadcrumb>
      <div className="mb-3 text-center">
        <h1>Payments</h1>
      </div>
      <Row>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <MdSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              value={searchKey}
              placeholder="Enter client name"
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col md={{ span: 4, offset: 4 }}>
          <div className="d-grid mb-3">
            <Button variant="outline-success" onClick={handleModalOpen}>
              Accept new Payment
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
            <PaymentTable
              listOfPayments={formattedPayments}
              handleViewDetails={handleViewDetailsShow}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </Col>
      </Row>

      <NewPaymentModal
        show={newPaymentModalShow}
        handleClose={handleModalClose}
        userId={userId}
      />

      <PaymentInfoModal
        show={paymentDetailsModalShow}
        data={paymentDetailsModalData}
        handleClose={handleViewDetailsClose}
      />
    </Container>
  );
};

Payment.propTypes = {
  userId: PropTypes.number,
};

export default Payment;

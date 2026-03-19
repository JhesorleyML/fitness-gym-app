import { useEffect, useState } from "react";
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
import axios from "axios";
import PaymentTable from "./PaymentTable";
import NewPaymentModal from "./NewPaymentModal";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { MdHome, MdSearch } from "react-icons/md";
import PaymentInfoModal from "./PaymentInfoModal";

const Payment = ({ userId }) => {
  //console.log(userId);
  let navigate = useNavigate();
  const [listOfPayments, setListOfPayments] = useState([]);
  const [listOfPaymentsCopy, setListOfPaymentsCopy] = useState([]);
  //new payment modal
  const [newPaymentModalShow, setnewPaymentModalShow] = useState(false);
  //tell the browser when to reload
  const [reloadFlag, setReloadFlag] = useState(false);

  //view details modal
  const [paymentDetailsModalShow, setPaymentDetailsModalShow] = useState(false);
  const [paymentDetailsModalData, setPaymentDetailsModalData] = useState({});

  //for searching
  const [searchKey, setSearchKey] = useState("");

  //handle new Payment modal close
  const handleModalClose = () => {
    setnewPaymentModalShow(false);
  };
  //handle new Payment modal open
  const handleModalOpen = () => {
    setnewPaymentModalShow(true);
  };

  //fetch payment list
  useEffect(() => {
    axios.get("/api/payments/").then((response) => {
      //console.log(response.data);
      //format data to be display
      const payments = response.data.map((paymentData) => {
        const { firstname, middlename, lastname } =
          paymentData.ClientSubscription.ClientInfo;
        //format fullname
        const fullname = `${firstname} ${middlename} ${lastname} `;
        //format payment date
        const formattedDate = format(
          new Date(paymentData.paymentdate),
          "MM/dd/yyyy",
        );
        //add the fullname to the original array
        const data = { ...paymentData, fullname, formattedDate };
        return data;
      });

      setListOfPayments(payments);
      setListOfPaymentsCopy(payments);
    });
  }, [reloadFlag]);

  //handle view details modal
  const handleViewDetailsShow = (payment) => {
    //console.log(payment);
    setPaymentDetailsModalData(payment);
    setPaymentDetailsModalShow(true);
  };

  const handleViewDetailsClose = () => {
    setPaymentDetailsModalShow(false);
  };

  //handles search
  const handleSearch = (e) => {
    const input = e.target.value;
    setSearchKey(input); // Update the input value
    //do not search if search field is empty
    if (!input.trim()) {
      setListOfPayments(listOfPaymentsCopy);
      return;
    }
    //search data from the list of payments
    //console.log(searchKey);
    const lowercasedSearchKey = input.toLowerCase();
    const result = listOfPayments.filter((item) =>
      item.fullname.toLowerCase().includes(lowercasedSearchKey),
    );
    if (result.length === 0) {
      alert("No results found");
    }
    //console.log(result);
    setListOfPayments(result);
  };

  //handles reload modal
  const handleReloadOnModal = () => {
    setReloadFlag((prev) => !prev);
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
        <Breadcrumb.Item href="#">Payments</Breadcrumb.Item>
      </Breadcrumb>
      <div className="mb-3 text-center">
        <h1>Payments</h1>
      </div>
      <Row>
        {/**Search */}
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              {" "}
              <MdSearch />
            </InputGroup.Text>
            <Form.Control
              aria-label="search field"
              aria-describedby="basic-search"
              type="text"
              value={searchKey}
              placeholder="Enter client name"
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        {/**Create new Payment */}
        <Col md={{ span: 4, offset: 4 }}>
          <div className="d-grid mb-3">
            <Button variant="outline-success" onClick={handleModalOpen}>
              {" "}
              Accept new Payment{" "}
            </Button>
          </div>
        </Col>
      </Row>
      {/**Payment List  */}
      <Row>
        <Col>
          <PaymentTable
            listOfPayments={listOfPayments}
            handleViewDetails={handleViewDetailsShow}
          />
        </Col>
      </Row>
      {/**New Payment Modal */}
      <NewPaymentModal
        show={newPaymentModalShow}
        handleClose={handleModalClose}
        userId={userId}
        handleReloadOnSubmit={handleReloadOnModal}
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

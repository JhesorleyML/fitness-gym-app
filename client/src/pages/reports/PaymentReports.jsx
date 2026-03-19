import { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import axios from "axios";
import PaymentTable from "../payment/PaymentTable";
import { differenceInDays, format, isEqual, startOfDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MonthlyReportTable from "./MonthlyReportTable";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";

const PaymentReports = () => {
  let navigate = useNavigate();

  //get currentdate
  const [currentDate] = useState(new Date());
  //use for printing
  const reportRef = useRef();
  const [showAllPages, setShowAllPages] = useState(false);
  //list of payments
  const [listOfPayments, setListOfPayments] = useState([]);
  const [listOfPaymentsCopy, setListOfPaymentsCopy] = useState([]);

  //type of filter
  const [filterType, setFilterType] = useState(0);
  const [dateFrom, setDateFrom] = useState(""); //default should be today
  const [dateTo, setDateTo] = useState(""); //default should be today
  //monthly and yearly filters
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState({ month: "", amount: 0 });
  //computes the total amount of the all filtered payments
  const [totalAmount, setTotalAmount] = useState("0");

  //fetch data
  useEffect(() => {
    axios.get("http://localhost:3005/api/payments/").then((response) => {
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
          "MM/dd/yyyy"
        );
        //add the fullname to the original array
        const data = { ...paymentData, fullname, formattedDate };
        return data;
      });
      setListOfPayments(payments);
      setListOfPaymentsCopy(payments);
      getTotal(payments);
      //console.log(payments);
      setMonthlyData(
        getMonthlyReportWithZeros(payments, currentDate.getFullYear())
      ); //comment
    });
    //setCurrentDate during pageLoads
    setDateFrom(currentDate);
    setDateTo(currentDate);
  }, [currentDate]);

  //display data based on filter type
  useEffect(() => {
    //const today = format(currentDate, "MM/dd/yyyy");
    console.log(listOfPaymentsCopy);
    let filteredPayments = [];
    switch (parseInt(filterType)) {
      case 1: //TODAY
        //if payment date == currentday; neglecting time
        filteredPayments = listOfPayments.filter((payment) =>
          isEqual(startOfDay(payment.paymentdate), startOfDay(currentDate))
        );
        setListOfPaymentsCopy(filteredPayments);
        getTotal(filteredPayments);
        break;
      case 2: //YESTERDAY
        //if day difference between the current day and payment date is 1
        filteredPayments = listOfPayments.filter(
          (payment) =>
            differenceInDays(
              startOfDay(currentDate),
              startOfDay(payment.paymentdate)
            ) === 1
        );
        setListOfPaymentsCopy(filteredPayments);
        getTotal(filteredPayments);
        break;
      case 3: //DATE RANGE
        //dateFrom: 1-02; dateTo: 1-02  1-03 //payment date >= to datefrom && payment date <= dateTo;
        filteredPayments = listOfPayments.filter(
          (payment) =>
            startOfDay(payment.paymentdate) >= startOfDay(dateFrom) &&
            startOfDay(payment.paymentdate) <= startOfDay(dateTo)
        );
        setListOfPaymentsCopy(filteredPayments);
        getTotal(filteredPayments);
        break;
      case 4: //MONTHLY
        //monthly Reports
        filteredPayments = getMonthlyReportWithZeros(
          listOfPayments,
          filterYear
        );
        //console.log(filteredPayments);
        setMonthlyData(filteredPayments);
        getTotal(filteredPayments);
        break;
      default: //ALL RECORDS
        filteredPayments = listOfPayments;
        setListOfPaymentsCopy(filteredPayments);
        getTotal(filteredPayments);
        break;
    }
  }, [filterType, listOfPayments, currentDate, dateFrom, dateTo, filterYear]);

  //function for getting total
  const getTotal = (paymentList) => {
    const total = paymentList.reduce(
      (total, payment) => total + parseFloat(payment.amount),
      0
    );
    //format to currency
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(total);
    setTotalAmount(formattedAmount);
  };

  //handle select
  const onFilterSelect = (e) => {
    const filterType = e.target.value;
    setFilterType(filterType);
    //console.log(filterType);
  };

  const onFilterYear = (e) => {
    setFilterYear(e.target.value);
  };

  //print
  const handlePrint = () => {
    setShowAllPages(true); // Show all pages before printing
    setTimeout(() => {
      const printContent = reportRef.current;
      const windowPrint = window.open("", "", "width=900,height=650");
      windowPrint.document.write("<html><head><title>Print Report</title>");
      windowPrint.document.write(
        '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">'
      );
      windowPrint.document.write("</head><body>");
      windowPrint.document.write(
        "<div class='text-center'><h1>BENFOR FITNESS GYM<h1></div>"
      );
      windowPrint.document.write(printContent.innerHTML);
      windowPrint.document.write("</body></html>");
      windowPrint.document.close();
      windowPrint.focus();
      windowPrint.print();
      setShowAllPages(false); // Restore original pagination after printing
    }, 500);
  };

  const getMonthlyReportWithZeros = (data, year) => {
    // Create a full list of year-month keys
    const fullMonths = [];
    for (let month = 1; month <= 12; month++) {
      fullMonths.push({
        month: `${year}-${String(month).padStart(2, "0")}`,
        amount: 0,
      });
      //console.log(fullMonths);
    }
    // Aggregate data into a map of year-month keys and their amounts
    const reportMap = data.reduce((acc, item) => {
      const date = new Date(item.paymentdate);
      const yearMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      acc[yearMonth] = (acc[yearMonth] || 0) + parseFloat(item.amount);
      return acc;
    }, {});

    // Update the full months list with actual amounts from the report map
    fullMonths.forEach((entry) => {
      if (reportMap[entry.month]) {
        entry.amount = reportMap[entry.month];
      }
    });

    return fullMonths;
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
        <Breadcrumb.Item>Reports</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Payments</Breadcrumb.Item>
      </Breadcrumb>
      <div className="mb-3 text-center"></div>
      <Row>
        {/**filter section */}
        <Col md={3}>
          {/**Dropdown for Filter */}
          <InputGroup className="mb-3">
            <InputGroup.Text className="bg-info">Select </InputGroup.Text>
            <Form.Select
              name="filterSelect"
              value={filterType}
              onChange={onFilterSelect}
            >
              <option value="0">All record</option>
              <option value="1">Today</option>
              <option value="2">Yesterday</option>
              <option value="3">Date Range</option>
              <option value="4">Monthly</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col>
          {/**Condition for filter */}
          {/**daily or date ranges filter */}
          {parseInt(filterType) === 3 && (
            <Row className="justify-content-center">
              <Col md={6} lg={5} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>From: </InputGroup.Text>
                  <DatePicker
                    style={{ width: "auto" }}
                    className="w-75 form-control"
                    name="dateFrom"
                    maxDate={dateTo}
                    selected={dateFrom}
                    showMonthDropdown
                    onChange={(date) => setDateFrom(date)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} lg={5} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>To: </InputGroup.Text>
                  <DatePicker
                    className="form-control w-75"
                    name="dateTo"
                    selected={dateTo}
                    maxDate={currentDate}
                    minDate={dateFrom}
                    showMonthDropdown
                    onChange={(date) => setDateTo(date)}
                  />
                </InputGroup>
              </Col>
            </Row>
          )}
          {/**monthly filter */}
          {parseInt(filterType) === 4 && (
            <Col md={8} lg={6} className="mb-3">
              <InputGroup>
                <InputGroup.Text>Select Year </InputGroup.Text>
                <Form.Select
                  name="filterYear"
                  value={filterYear}
                  onChange={onFilterYear}
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </Form.Select>
              </InputGroup>
            </Col>
          )}
        </Col>
        {/**PrintButton */}
        <Col md={2}>
          <div className="d-grid">
            <Button variant="outline-success" onClick={handlePrint}>
              Print Report
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div ref={reportRef} className="mt-3">
            <div className="report-title text-center">
              <h3>Payment Reports</h3>
            </div>
            <Row>
              <Col md={6}>
                <div className="mb-2">
                  <p>
                    No of Records:{" "}
                    {filterType == 4
                      ? monthlyData.length
                      : listOfPaymentsCopy.length}{" "}
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <p>Total: {totalAmount} </p>
                </div>
              </Col>
            </Row>
            {/**check if what filter type where selected to display appropriate table*/}
            {parseInt(filterType) === 4 ? (
              <MonthlyReportTable data={monthlyData} />
            ) : (
              <PaymentTable
                listOfPayments={listOfPaymentsCopy}
                showAllPages={showAllPages}
                isReport={true}
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentReports;

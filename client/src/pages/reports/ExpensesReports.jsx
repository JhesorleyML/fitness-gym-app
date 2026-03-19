import axios from "axios";
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
import DatePicker from "react-datepicker";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";
import ExpenseTable from "../expenses/ExpenseTable";
import MonthlyReportTable from "./MonthlyReportTable";
import { differenceInDays, isEqual, startOfDay } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const ExpensesReports = () => {
  let navigate = useNavigate();

  //get currentdate
  const [currentDate] = useState(new Date());
  //use for printing
  const reportRef = useRef();
  const [showAllPages, setShowAllPages] = useState(false);

  //list of expenses
  const [listOfExpenses, setLisOfExpenses] = useState([]);
  const [listOfExpensesCopy, setListOfExpensesCopy] = useState([]);

  //type of filter
  const [filterType, setFilterType] = useState(0);
  const [dateFrom, setDateFrom] = useState(""); //default should be today
  const [dateTo, setDateTo] = useState(""); //default should be today
  //monthly and yearly filters
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState({ month: "", amount: 0 });
  //computes the total amount of the all filtered expenses
  const [totalAmount, setTotalAmount] = useState("0");

  //fetch data
  useEffect(() => {
    axios.get("/api/expenses/").then((response) => {
      const expenses = response.data;
      setLisOfExpenses(expenses);
      setListOfExpensesCopy(expenses);
      getTotal(expenses);
      setMonthlyData(
        getMonthlyReportWithZeros(expenses, currentDate.getFullYear()),
      );
    });
    //setCurrentDate during pageLoads
    setDateFrom(currentDate);
    setDateTo(currentDate);
  }, [currentDate]);

  //display data based on filter type
  useEffect(() => {
    //const today = format(currentDate, "MM/dd/yyyy");
    //console.log(listOfExpensesCopy);
    let filteredExpenses = [];
    switch (parseInt(filterType)) {
      case 1: //TODAY
        filteredExpenses = listOfExpenses.filter((expense) => {
          isEqual(startOfDay(expense.expdate), startOfDay(currentDate));
        });
        setListOfExpensesCopy(filteredExpenses);
        getTotal(filteredExpenses);
        break;
      case 2: //YESTERDAY
        //if day difference between the current day and payment date is 1
        filteredExpenses = listOfExpenses.filter(
          (expense) =>
            differenceInDays(
              startOfDay(currentDate),
              startOfDay(expense.expdate),
            ) === 1,
        );
        setListOfExpensesCopy(filteredExpenses);
        getTotal(filteredExpenses);
        break;
      case 3: //DATE RANGE
        filteredExpenses = listOfExpenses.filter(
          (payment) =>
            startOfDay(payment.paymentdate) >= startOfDay(dateFrom) &&
            startOfDay(payment.paymentdate) <= startOfDay(dateTo),
        );
        setListOfExpensesCopy(filteredExpenses);
        getTotal(filteredExpenses);
        break;
      case 4: //MONTHLY
        //monthly Reports
        filteredExpenses = getMonthlyReportWithZeros(
          listOfExpenses,
          filterYear,
        );
        //console.log(filteredExpenses);
        setMonthlyData(filteredExpenses);
        getTotal(filteredExpenses);
        break;
      default: //ALL RECORDS
        filteredExpenses = listOfExpenses;
        setListOfExpensesCopy(filteredExpenses);
        getTotal(filteredExpenses);
        break;
    }
  }, [filterType, listOfExpenses, currentDate, dateFrom, dateTo, filterYear]);

  //function for getting total
  const getTotal = (expenseData) => {
    const total = expenseData.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0,
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
        '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">',
      );
      windowPrint.document.write("</head><body>");
      windowPrint.document.write(
        "<div class='text-center'><h1>BENFOR FITNESS GYM<h1></div>",
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
      const date = new Date(item.expdate);
      const yearMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
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
        <Breadcrumb.Item href="#">Expenses</Breadcrumb.Item>
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
              <h3>Expense Reports</h3>
            </div>
            <Row>
              <Col md={6}>
                <div className="mb-2">
                  <p>
                    No of Records:{" "}
                    {filterType == 4
                      ? monthlyData.length
                      : listOfExpensesCopy.length}{" "}
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
              <ExpenseTable
                listOfExpenses={listOfExpensesCopy}
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

export default ExpensesReports;

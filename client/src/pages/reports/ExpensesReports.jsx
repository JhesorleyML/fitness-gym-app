import axios from "axios";
import { useRef, useState, useMemo } from "react";
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
import DatePicker from "react-datepicker";
import { MdHome, MdPrint } from "react-icons/md";
import { useNavigate } from "react-router";
import ExpenseTable from "../expenses/ExpenseTable";
import MonthlyReportTable from "./MonthlyReportTable";
import { differenceInDays, isEqual, startOfDay, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";

const ExpensesReports = () => {
  let navigate = useNavigate();
  const reportRef = useRef();
  const [showAllPages, setShowAllPages] = useState(false);

  // type of filter
  const [filterType, setFilterType] = useState("0");
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString(),
  );

  // Use TanStack Query
  const {
    data: rawExpenses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allExpensesReport"],
    queryFn: () =>
      axios
        .get("/api/expenses?limit=10000")
        .then((res) => res.data.expenses || res.data),
    staleTime: 5 * 60 * 1000,
  });

  // Derived filtered data
  const { filteredExpenses, monthlyData, totalAmount } = useMemo(() => {
    const today = startOfDay(new Date());
    let filtered = [];
    let monthly = [];

    switch (parseInt(filterType)) {
      case 1: // TODAY
        filtered = rawExpenses.filter((e) =>
          isEqual(startOfDay(new Date(e.expdate)), today),
        );
        break;
      case 2: // YESTERDAY
        filtered = rawExpenses.filter(
          (e) => differenceInDays(today, startOfDay(new Date(e.expdate))) === 1,
        );
        break;
      case 3: // DATE RANGE
        filtered = rawExpenses.filter((e) => {
          const d = startOfDay(new Date(e.expdate));
          return d >= startOfDay(dateFrom) && d <= startOfDay(dateTo);
        });
        break;
      case 4: { // MONTHLY
        for (let month = 1; month <= 12; month++) {
          monthly.push({
            month: `${filterYear}-${String(month).padStart(2, "0")}`,
            amount: 0,
          });
        }
        const reportMap = rawExpenses.reduce((acc, item) => {
          const date = new Date(item.expdate);
          if (date.getFullYear().toString() === filterYear) {
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            acc[yearMonth] = (acc[yearMonth] || 0) + parseFloat(item.amount);
          }
          return acc;
        }, {});
        monthly.forEach((entry) => {
          if (reportMap[entry.month]) entry.amount = reportMap[entry.month];
        });
        break;
      }
      default: // ALL RECORDS
        filtered = rawExpenses;
        break;
    }

    const total = (parseInt(filterType) === 4 ? monthly : filtered).reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0,
    );

    const formattedTotal = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(total);

    return {
      filteredExpenses: filtered,
      monthlyData: monthly,
      totalAmount: formattedTotal,
    };
  }, [filterType, rawExpenses, dateFrom, dateTo, filterYear]);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    onBeforeGetContent: () => {
      setShowAllPages(true);
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    },
    onAfterPrint: () => setShowAllPages(false),
  });

  if (isError)
    return (
      <div className="text-center text-danger p-5">Error: {error.message}</div>
    );

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

      <Row className="mb-3 no-print">
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text className="bg-info text-white">
              Filter
            </InputGroup.Text>
            <Form.Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="0">All records</option>
              <option value="1">Today</option>
              <option value="2">Yesterday</option>
              <option value="3">Date Range</option>
              <option value="4">Monthly</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col>
          {filterType === "3" && (
            <Row>
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>From:</InputGroup.Text>
                  <DatePicker
                    className="form-control"
                    selected={dateFrom}
                    onChange={setDateFrom}
                  />
                </InputGroup>
              </Col>
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>To:</InputGroup.Text>
                  <DatePicker
                    className="form-control"
                    selected={dateTo}
                    onChange={setDateTo}
                  />
                </InputGroup>
              </Col>
            </Row>
          )}
          {filterType === "4" && (
            <InputGroup style={{ maxWidth: "200px" }}>
              <InputGroup.Text>Year</InputGroup.Text>
              <Form.Select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </Form.Select>
            </InputGroup>
          )}
        </Col>
        <Col md={2}>
          <Button
            variant="outline-success"
            className="w-100"
            onClick={handlePrint}
            disabled={isLoading}
          >
            <MdPrint className="me-2" />
            Print Report
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div ref={reportRef} className="p-4 bg-white">
          <div className="text-center mb-4">
            <h1 className="fw-bold">BENFORD FITNESS GYM</h1>
            <h3 className="text-muted">Expense Reports</h3>
            {filterType === "3" && (
              <h6>
                From: {format(dateFrom, "MMMM d, yyyy")} To{" "}
                {format(dateTo, "MMMM d, yyyy")}
              </h6>
            )}
            {filterType === "4" && (
              <h6>Year: {filterYear}</h6>
            )}
            <hr />
          </div>
          
          <Row className="mb-2 fw-bold">
            <Col>
              No. of Records:{" "}
              {filterType === "4"
                ? monthlyData.length
                : filteredExpenses.length}
            </Col>
            <Col className="text-end text-danger">Total: {totalAmount}</Col>
          </Row>
          {filterType === "4" ? (
            <MonthlyReportTable data={monthlyData} />
          ) : (
            <ExpenseTable
              listOfExpenses={filteredExpenses}
              showAllPages={showAllPages}
              isReport={true}
            />
          )}
        </div>
      )}
    </Container>
  );
};

export default ExpensesReports;

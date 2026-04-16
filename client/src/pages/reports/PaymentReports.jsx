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
import axios from "axios";
import PaymentTable from "../payment/PaymentTable";
import { differenceInDays, format, isEqual, startOfDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MonthlyReportTable from "./MonthlyReportTable";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

const PaymentReports = () => {
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

  // Use TanStack Query for large data retrieval
  const {
    data: rawPayments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allPaymentsReport"],
    queryFn: () =>
      axios
        .get("/api/payments?limit=10000")
        .then((res) => res.data.payments || res.data),
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
  });

  // Format payments once when raw data changes
  const formattedPayments = useMemo(() => {
    return rawPayments.map((paymentData) => {
      const { firstname, middlename, lastname } =
        paymentData.ClientSubscription.ClientInfo;
      const fullname = `${firstname} ${middlename} ${lastname}`;
      const formattedDate = format(
        new Date(paymentData.paymentdate),
        "MM/dd/yyyy",
      );
      return { ...paymentData, fullname, formattedDate };
    });
  }, [rawPayments]);

  // Derived filtered data using useMemo
  const { filteredPayments, monthlyData, totalAmount } = useMemo(() => {
    const today = startOfDay(new Date());
    let filtered = [];
    let monthly = [];

    switch (parseInt(filterType)) {
      case 1: // TODAY
        filtered = formattedPayments.filter((p) =>
          isEqual(startOfDay(new Date(p.paymentdate)), today),
        );
        break;
      case 2: // YESTERDAY
        filtered = formattedPayments.filter(
          (p) =>
            differenceInDays(today, startOfDay(new Date(p.paymentdate))) === 1,
        );
        break;
      case 3: // DATE RANGE
        filtered = formattedPayments.filter((p) => {
          const d = startOfDay(new Date(p.paymentdate));
          return d >= startOfDay(dateFrom) && d <= startOfDay(dateTo);
        });
        break;
      case 4: // Create full list of year-month keys // MONTHLY
      {
        for (let month = 1; month <= 12; month++) {
          monthly.push({
            month: `${filterYear}-${String(month).padStart(2, "0")}`,
            amount: 0,
          });
        }
        const reportMap = formattedPayments.reduce((acc, item) => {
          const date = new Date(item.paymentdate);
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
        filtered = formattedPayments;
        break;
    }

    const total = (parseInt(filterType) === 4 ? monthly : filtered).reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0,
    );

    const formattedTotal = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(total);

    return {
      filteredPayments: filtered,
      monthlyData: monthly,
      totalAmount: formattedTotal,
    };
  }, [filterType, formattedPayments, dateFrom, dateTo, filterYear]);

  const handlePrint = () => {
    setShowAllPages(true);
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
      setShowAllPages(false);
    }, 500);
  };

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
        <Breadcrumb.Item href="#">Payments</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mb-3">
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
            Print Report
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div ref={reportRef} className="mt-3">
          <div className="report-title text-center">
            <h3>Payment Reports</h3>
            {filterType === "3" && (
              <h6>
                Range: {format(dateFrom, "MMMM d, yyyy")} to{" "}
                {format(dateTo, "MMMM d, yyyy")}
              </h6>
            )}
          </div>
          <Row className="mb-2 fw-bold">
            <Col>
              No. of Records:{" "}
              {filterType === "4"
                ? monthlyData.length
                : filteredPayments.length}
            </Col>
            <Col className="text-end">Total: {totalAmount}</Col>
          </Row>
          {filterType === "4" ? (
            <MonthlyReportTable data={monthlyData} />
          ) : (
            <PaymentTable
              listOfPayments={filteredPayments}
              showAllPages={showAllPages}
              isReport={true}
            />
          )}
        </div>
      )}
    </Container>
  );
};

export default PaymentReports;

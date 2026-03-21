import { Breadcrumb, Col, Container, Row, Spinner } from "react-bootstrap";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";
import SubPaymentChart from "./SubPaymentChart";
import ExpensesChart from "./ExpensesChart";
import { useMemo, useState } from "react";
import axios from "axios";
import { startOfDay } from "date-fns";
import SampleCards from "./SampleCards";
import { useQuery } from "@tanstack/react-query";

const MONTH_ARR = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Dashboard = () => {
  let navigate = useNavigate();
  const [currentDate] = useState(new Date());

  // Use TanStack Query for all server-side data
  const { data: listOfClients = [], isLoading: loadingClients } = useQuery({
    queryKey: ["activeClients"],
    queryFn: () => axios.get("/api/clientsubs/active/all").then((res) => res.data),
  });

  const { data: listOfPayments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ["paymentsSummary"],
    queryFn: () => axios.get("/api/payments/summary").then((res) => res.data),
  });

  const { data: listOfMembers = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["allMembers"],
    queryFn: () => axios.get("/api/clients").then((res) => res.data),
  });

  const { data: listOfExpenses = [], isLoading: loadingExpenses } = useQuery({
    queryKey: ["expensesSummary"],
    queryFn: () => axios.get("/api/expenses/summary").then((res) => res.data),
  });

  // Deriving client stats with useMemo (Performance Optimization)
  const clientStats = useMemo(() => {
    const today = startOfDay(currentDate);

    const members = listOfMembers.filter((client) => client.isMember === true);

    const activeMem = listOfClients.filter(
      (client) =>
        client.ClientInfo.isMember === true &&
        startOfDay(new Date(client.dateend)) >= today,
    );

    const nonMem = listOfClients.filter(
      (client) =>
        client.ClientInfo.isMember === false &&
        startOfDay(new Date(client.dateend)) >= today,
    );

    const activeClientList = listOfClients.filter(
      (client) => startOfDay(new Date(client.dateend)) >= today,
    );

    return {
      membersCount: members.length,
      activeMembersCount: activeMem.length,
      activeNonMembersCount: nonMem.length,
      activeClientsCount: activeClientList.length,
    };
  }, [listOfClients, listOfMembers, currentDate]);

  // Deriving chart data with useMemo
  const paymentData = useMemo(() => {
    const getLastDateOfCurrentMonth = () => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    };

    let reportData = [];
    if (currentDate.getDate() < 15) {
      for (let index = 1; index <= 15; index++) {
        const toISODate = new Date(
          Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), index),
        );
        reportData.push({
          dateDay: index,
          month: MONTH_ARR[currentDate.getMonth()],
          amount: 0,
          date: toISODate.toISOString(),
        });
      }
    } else {
      for (let index = 0; index < 15; index++) {
        const val = currentDate.getDate() - 13 + index;
        const toISODate = new Date(
          Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), val),
        );
        if (val > getLastDateOfCurrentMonth().getDate()) break;
        reportData.push({
          dateDay: val,
          month: MONTH_ARR[currentDate.getMonth()],
          amount: 0,
          date: toISODate.toISOString(),
        });
      }
    }

    // Map summary data correctly
    reportData.forEach((report) => {
      const matchingAgg = listOfPayments.find((agg) =>
        report.date.startsWith(agg.date),
      );
      if (matchingAgg) {
        report.amount = parseFloat(matchingAgg.totalAmount);
      }
    });

    return reportData;
  }, [currentDate, listOfPayments]);

  const isLoading = loadingClients || loadingPayments || loadingMembers || loadingExpenses;

  if (isLoading) {
    return (
      <Container className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading Dashboard Data...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/")}>
          <MdHome />
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate("/dashboard")}>
          Dashboard
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <div className="div mb-2">Gym Clients </div>
      </Row>
      <Row>
        {/**Active Clients */}
        <Col md={3}>
          <SampleCards
            data={clientStats.activeClientsCount}
            isMember={false}
            cardTitle={`Active Gym Clients`}
            desc={`Clients that are currently with active gym session`}
          />
        </Col>
        {/**Active Members */}
        <Col md={3}>
          <SampleCards
            data={clientStats.activeMembersCount}
            isMember={true}
            cardTitle={`Active Gym Members`}
            desc={`Gym members with active gymn sessions`}
          />
        </Col>
        {/**Active Non Members */}
        <Col md={3}>
          <SampleCards
            data={clientStats.activeNonMembersCount}
            isMember={false}
            cardTitle={`Active Non Members`}
            desc={`Non-member clients currently with active session`}
          />
        </Col>
        {/**Members */}
        <Col md={3}>
          <SampleCards
            data={clientStats.membersCount}
            isMember={true}
            cardTitle={`Gym Members`}
            desc={`Clients that currently avails membership status`}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <div className="div mb-2 mt-2">Subscription Payments</div>
      </Row>
      <Row>
        <Col md={8} className="mb-3">
          <SubPaymentChart tableData={paymentData} />
        </Col>
        <Col md={4} className="mb-3">
          <ExpensesChart 
            paymentData={listOfPayments} 
            expensesData={listOfExpenses} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

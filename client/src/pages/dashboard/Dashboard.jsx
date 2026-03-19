import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";
import SubPaymentChart from "./SubPaymentChart";
import ExpensesChart from "./ExpensesChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { startOfDay } from "date-fns";
import SampleCards from "./SampleCards";

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
  const [listOfClients, setListOfClients] = useState([]);
  const [listOfPayments, setListOfPayments] = useState([]);
  const [listOfMembers, setListOfMembers] = useState([]);
  const [listOfExpenses, setListOfExpenses] = useState([]);
  //const [clientData, setClientData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [activeClients, setActiveClients] = useState([]);
  const [activeMember, setActiveMembers] = useState([]);
  const [activeNonMem, setActiveNonMem] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentDate] = useState(new Date());

  //fetch data
  useEffect(() => {
    //fetch clients data
    axios.get("/api/clientsubs/active/all").then((response) => {
      //console.log("Clients:", response.data);
      setListOfClients(response.data);
    });
    //fetch payments data
    axios.get("/api/payments").then((response) => {
      //console.log("Payments:", response.data);
      setListOfPayments(response.data);
    });
    //fetch all memberclients
    axios.get("/api/clients").then((response) => {
      //console.log(response.data);
      setListOfMembers(response.data);
    });
    //fetch all expenses data
    axios.get("/api/expenses").then((response) => {
      setListOfExpenses(response.data);
    });
  }, []);

  //set ActiveClientsDate
  useEffect(() => {
    //set member gymn clients
    const members = listOfMembers.filter((client) => client.isMember === true);

    //set member gymn clients that are active
    const activeMem = listOfClients.filter(
      (client) =>
        client.ClientInfo.isMember === true &&
        startOfDay(new Date(client.dateend)) >= startOfDay(currentDate),
    );

    //set nonmember gymn clients that are active
    const nonMem = listOfClients.filter(
      (client) =>
        client.ClientInfo.isMember === false &&
        startOfDay(new Date(client.dateend)) >= startOfDay(currentDate),
    );

    //set active clients members and non members
    const activeClientList = listOfClients.filter(
      (client) =>
        startOfDay(new Date(client.dateend)) >= startOfDay(currentDate),
    );
    setMembers(members);
    setActiveMembers(activeMem);
    setActiveNonMem(nonMem);
    setActiveClients(activeClientList);
  }, [listOfClients, currentDate, listOfMembers]);

  //graph data for subscription payments
  useEffect(() => {
    const getLastDateOfCurrentMonth = () => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    };
    const setReportData = () => {
      let reportData = [];
      if (currentDate.getDate() < 15) {
        for (let index = 1; index <= 15; index++) {
          //reportData[index - 1] = index + `-${MONTH_ARR[currentDate.getMonth()]}`;
          const toISODate = new Date(
            Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), index),
          );
          // console.log("ISO Date", toISODate);
          reportData.push({
            dateDay: index,
            month: MONTH_ARR[currentDate.getMonth()],
            amount: 0,
            date: toISODate.toISOString(),
          });
          //console.log("hi");
        }
      } else if (currentDate.getDate() >= 15) {
        for (let index = 0; index < 15; index++) {
          const val = currentDate.getDate() - 13 + index;
          const toISODate = new Date(
            Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), val),
          );
          if (val > getLastDateOfCurrentMonth().getDate()) break;
          //reportData[index] = val + `-${MONTH_ARR[currentDate.getMonth()]}`;
          //console.log("ISO Date", toISODate);
          reportData.push({
            dateDay: val,
            month: MONTH_ARR[currentDate.getMonth()],
            amount: 0,
            date: toISODate.toISOString(),
          });
        }
      }

      //get daily aggregated data object
      const aggregated = listOfPayments.reduce((acc, payment) => {
        const { paymentdate, amount } = payment;
        // If the date already exists, add to the total; otherwise, initialize it
        acc[paymentdate] = (acc[paymentdate] || 0) + parseFloat(amount);
        return acc;
      }, {});
      //console.log("agg:", aggregated);

      //conToarrayOfObject
      const aggregatedToObj = Object.entries(aggregated).map(
        ([date, amount]) => ({ date, amount }),
      );
      //console.log("aggToObj:", aggregatedToObj);

      //aggupdate the reportData
      //console.log("REPORT DATA:", reportData);
      reportData.forEach((report) => {
        const matchingAgg = aggregatedToObj.find((agg) => {
          // Compare the date strings (not the Date objects) for equality
          //console.log(report, agg);
          return agg.date === report.date;
        });
        //console.log(matchingAgg);

        if (matchingAgg) {
          report.amount = matchingAgg.amount;
          //console.log(matchingAgg.amount);
        }
      });

      //console.log("aggToObj", aggregatedToObj);
      return reportData;
    };
    const data = setReportData();
    setPaymentData(data);
    //console.log("data:", data);
  }, [currentDate, listOfPayments]);

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
            data={activeClients.length}
            isMember={false}
            cardTitle={`Active Gym Clients`}
            desc={`Clients that are currently with active gym session`}
          />
        </Col>
        {/**Active Members */}
        <Col md={3}>
          <SampleCards
            data={activeMember.length}
            isMember={true}
            cardTitle={`Active Gym Members`}
            desc={`Gym members with active gymn sessions`}
          />
        </Col>
        {/**Active Non Members */}
        <Col md={3}>
          <SampleCards
            data={activeNonMem.length}
            isMember={false}
            cardTitle={`Active Non Members`}
            desc={`Non-member clients currently with active session`}
          />
        </Col>
        {/**Members */}
        <Col md={3}>
          <SampleCards
            data={members.length}
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
          <ExpensesChart />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

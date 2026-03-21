import { useRef, useState, useMemo } from "react";
import { Breadcrumb, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import ClientTable from "../../Components/ClientTable";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

const ClientReports = () => {
  let navigate = useNavigate();
  const reportRef = useRef();
  const [showAllPages, setShowAllPages] = useState(false);

  // use in filtering client list
  const [isMember, setIsMember] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Use TanStack Query
  const { data: listOfClients = [], isLoading, isError, error } = useQuery({
    queryKey: ["allClientsReport"],
    queryFn: () => axios.get("/api/clients/").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  // Filter data using useMemo
  const filteredClients = useMemo(() => {
    return listOfClients.filter(
      (client) => client.isMember === isMember && client.isActive === isActive,
    );
  }, [listOfClients, isMember, isActive]);

  const handleSwitchChangeIsMember = () => {
    setIsMember((prevState) => !prevState);
  };
  const handleSwitchChangeIsActive = () => {
    setIsActive((prevState) => !prevState);
  };

  const handlePrint = () => {
    setShowAllPages(true);
    setTimeout(() => {
      const printContent = reportRef.current;
      const windowPrint = window.open("", "", "width=900,height=650");
      windowPrint.document.write("<html><head><title>Print Report</title>");
      windowPrint.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
      windowPrint.document.write("</head><body>");
      windowPrint.document.write("<div class='text-center'><h1>BENFOR FITNESS GYM<h1></div>");
      windowPrint.document.write(printContent.innerHTML);
      windowPrint.document.write("</body></html>");
      windowPrint.document.close();
      windowPrint.focus();
      windowPrint.print();
      setShowAllPages(false);
    }, 500);
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
        <Breadcrumb.Item>Reports</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Clients</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Check
            type="switch"
            id="member-switch"
            label="With Membership Subscription"
            checked={isMember}
            onChange={handleSwitchChangeIsMember}
          />
        </Col>
        <Col md={4}>
          <Form.Check
            type="switch"
            id="active-switch"
            label="With Active Sessions"
            checked={isActive}
            onChange={handleSwitchChangeIsActive}
          />
        </Col>
        <Col md={{ span: 2, offset: 2 }}>
          <Button variant="outline-success" className="w-100" onClick={handlePrint} disabled={isLoading}>
            Print Report
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <div ref={reportRef} className="mt-3">
          <div className="report-title text-center">
            <h3>
              {isMember
                ? `List of Gym Clients with Memberships`
                : `List of Gym Clients without Memberships`}
            </h3>
          </div>
          <div className="mb-2 fw-bold">
            No of Records: {filteredClients.length}
          </div>
          <ClientTable
            listOfClients={filteredClients}
            isReport={true}
            showAllPages={showAllPages}
            isSubList={isActive}
          />
        </div>
      )}
    </Container>
  );
};

export default ClientReports;

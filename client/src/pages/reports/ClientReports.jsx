import { useEffect, useRef, useState } from "react";
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import ClientTable from "../../Components/ClientTable";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";

const ClientReports = () => {
  let navigate = useNavigate();
  const reportRef = useRef();
  const [listOfClients, setListOfClients] = useState([]);
  const [listOfClientsCopy, setListOfClientsCopy] = useState([]);
  //use in filtering client list
  const [isMember, setIsMember] = useState(false);
  const [isActive, setIsActive] = useState(true); //default is with active sessions
  //modify pagination during printing
  const [showAllPages, setShowAllPages] = useState(false);

  //fetch data from the database
  useEffect(() => {
    axios.get("/api/clients/").then((response) => {
      //console.log(response.data);
      setListOfClients(response.data);
      setListOfClientsCopy(response.data);
    });
  }, []);

  // Filter data based on the `isMember` and `isActive` state
  useEffect(() => {
    const filteredClients = listOfClients.filter(
      (client) => client.isMember === isMember && client.isActive === isActive,
    );
    console.log("Filtered Clients:", filteredClients);
    setListOfClientsCopy(filteredClients);
  }, [isMember, isActive, listOfClients]);

  const handleSwitchChangeIsMember = () => {
    setIsMember((prevState) => !prevState); // Toggle the isMember state
  };
  const handleSwitchChangeIsActive = () => {
    setIsActive((prevState) => !prevState); // Toggle the isActive state
  };

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
      <div className="mb-3 text-center"></div>
      <Row>
        {/**Buttons for filter */}
        <Col md={4} className="mb-3">
          <Form>
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              label="With Membership Subscription"
              checked={isMember}
              onChange={handleSwitchChangeIsMember}
            />
          </Form>
        </Col>
        <Col md={4} className="mb-3">
          <Form>
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              label="With Active Sessions"
              checked={isActive}
              onChange={handleSwitchChangeIsActive}
            />
          </Form>
        </Col>
        <Col md={{ span: 2, offset: 2 }}>
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
              <h3>
                {isMember
                  ? `List of Gym Clients with Memberships`
                  : `List of Gym Clients without Memberships`}
              </h3>
            </div>
            <div className="mb-2">
              <p>No of Records: {listOfClientsCopy.length}</p>
            </div>
            <ClientTable
              listOfClients={listOfClientsCopy}
              isReport={true}
              showAllPages={showAllPages}
              isSubList={isActive}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientReports;

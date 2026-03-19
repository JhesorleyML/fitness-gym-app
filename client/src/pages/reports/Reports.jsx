import { useRef } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router";

const Reports = () => {
  let navigate = useNavigate();
  const reportRef = useRef();

  const handlePrint = () => {
    const printContent = reportRef.current;
    const windowPrint = window.open("", "", "width=900,height=650");
    windowPrint.document.write("<html><head><title>Print Report</title>");
    windowPrint.document.write(
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">'
    );
    windowPrint.document.write("</head><body>");
    windowPrint.document.write(printContent.innerHTML);
    windowPrint.document.write("</body></html>");
    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
  };

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/dashboard")}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">Reports</Breadcrumb.Item>
      </Breadcrumb>
      <div className="mb-3 text-center">
        <h1>Reports</h1>
      </div>
      <Row>
        {/**Buttons for filter */}
        <Col></Col>
      </Row>
      <Row>
        <Col>
          <h1>Print Report Example</h1>
          <Button variant="primary" onClick={handlePrint}>
            Print Report
          </Button>
          {/**Report Page  */}
          <div ref={reportRef} className="mt-3">
            <h2>Report Title</h2>
            <p>Here is some detailed report content.</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>29</td>
                  <td>New York</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jane Smith</td>
                  <td>34</td>
                  <td>San Francisco</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;

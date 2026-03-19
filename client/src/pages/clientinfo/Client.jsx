import { Breadcrumb, Col, Container, Form, Row } from "react-bootstrap";
import ClientTable from "../../Components/ClientTable";
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import ClientInfoModal from "../../Components/ClientInfoModal";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";

const Client = () => {
  let navigate = useNavigate();
  const [listOfClients, setListOfClients] = useState([]);
  const [listOfClientsCopy, setListOfClientsCopy] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState(null);

  //use in filtering client list
  const [isMember, setIsMember] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    axios.get("/api/clients/").then((response) => {
      console.log(response.data);
      setListOfClients(response.data);
      setListOfClientsCopy(response.data);
    });
  }, []);

  const viewClientDetails = (client) => {
    //format the data to be passed to the modal
    setModalData(client);
    setModalShow(true);
  };
  const handleModalClose = () => {
    setModalShow(false);
  };

  // Filter data based on the `isMember` state
  useEffect(() => {
    const filteredClients = listOfClients.filter(
      (client) => client.isMember === isMember && client.isActive === isActive,
    );
    //console.log("Filtered Clients:", filteredClients);
    setListOfClientsCopy(filteredClients);
  }, [isMember, isActive, listOfClients]);

  const handleSwitchChangeIsMember = () => {
    setIsMember((prevState) => !prevState); // Toggle the isMember state
  };
  const handleSwitchChangeIsActive = () => {
    setIsActive((prevState) => !prevState); // Toggle the isMember state
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
        <Breadcrumb.Item href="#">Clients</Breadcrumb.Item>
      </Breadcrumb>
      <div className="client-header text-center">
        <h1>List of Gym Clients</h1>
      </div>
      {/**For Filter */}
      <Row>
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
      </Row>
      <ClientTable
        listOfClients={listOfClientsCopy}
        isReport={false}
        handleViewDetails={viewClientDetails}
        showAllPages={false}
        isSubList={isActive}
      />
      <ClientInfoModal
        show={modalShow}
        handleClose={handleModalClose}
        data={modalData}
        backdrop="static"
        keyboard={false}
      />
    </Container>
  );
};

export default Client;

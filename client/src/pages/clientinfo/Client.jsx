import { Breadcrumb, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import ClientTable from "../../Components/ClientTable";
import { useMemo, useState } from "react";
import axios from "axios";
import "./style.css";
import ClientInfoModal from "../../Components/ClientInfoModal";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

const Client = () => {
  let navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState(null);

  // use in filtering client list
  const [isMember, setIsMember] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Use TanStack Query
  const { data: listOfClients = [], isLoading, isError, error } = useQuery({
    queryKey: ["clients"],
    queryFn: () => axios.get("/api/clients/").then((res) => res.data),
  });

  // Filter data using useMemo (Performance Optimization)
  const filteredClients = useMemo(() => {
    return listOfClients.filter(
      (client) => client.isMember === isMember && client.isActive === isActive,
    );
  }, [listOfClients, isMember, isActive]);

  const viewClientDetails = (client) => {
    setModalData(client);
    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
  };

  const handleSwitchChangeIsMember = () => {
    setIsMember((prevState) => !prevState);
  };

  const handleSwitchChangeIsActive = () => {
    setIsActive((prevState) => !prevState);
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
        <Breadcrumb.Item href="#">Clients</Breadcrumb.Item>
      </Breadcrumb>
      <div className="client-header text-center">
        <h1>List of Gym Clients</h1>
      </div>
      {/**For Filter */}
      <Row>
        <Col md={4} className="mb-3">
          <Form>
            <Form.Check
              type="switch"
              id="member-switch"
              label="With Membership Subscription"
              checked={isMember}
              onChange={handleSwitchChangeIsMember}
            />
          </Form>
        </Col>
        <Col md={4} className="mb-3">
          <Form>
            <Form.Check
              type="switch"
              id="active-switch"
              label="With Active Sessions"
              checked={isActive}
              onChange={handleSwitchChangeIsActive}
            />
          </Form>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <ClientTable
          listOfClients={filteredClients}
          isReport={false}
          handleViewDetails={viewClientDetails}
          showAllPages={false}
          isSubList={isActive}
        />
      )}

      <ClientInfoModal
        show={modalShow}
        handleClose={handleModalClose}
        data={modalData}
      />
    </Container>
  );
};

export default Client;

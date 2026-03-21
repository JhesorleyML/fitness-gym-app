import { Modal, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import ClientTable from "../../Components/ClientTable";
import axios from "axios";
import { startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";

const ClientSubs = ({ show, handleClose, subsCategory }) => {
  // Use TanStack Query
  const { data: listOfClients = [], isLoading, isError, error } = useQuery({
    queryKey: ["clientSubsByCategory", subsCategory?.id],
    queryFn: () => axios.get(`/api/clientsubs/subs/${subsCategory.id}`).then((res) => {
      // Transform data format
      const today = startOfDay(new Date());
      return res.data
        .map((item) => {
          const { firstname, lastname, middlename, sex } = item.ClientInfo;
          const { datestart, dateend } = item;
          
          if (dateend == null || startOfDay(new Date(dateend)) >= today) {
            return { datestart, dateend, firstname, middlename, lastname, sex };
          }
          return null;
        })
        .filter((item) => item !== null);
    }),
    enabled: !!subsCategory?.id && show, // Only fetch when modal is open and has ID
  });

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Clients List with {subsCategory?.category} Subscription
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" /> Loading clients...
          </div>
        ) : isError ? (
          <div className="text-danger p-3">Error: {error.message}</div>
        ) : (
          <>
            <div className="text-primary count-info mb-1">
              There are {listOfClients.length} clients
              {subsCategory?.category === "Membership"
                ? ` who availed memberships `
                : ` with active sessions `}
            </div>
            <ClientTable
              listOfClients={listOfClients}
              isReport={true}
              isSubList={true}
            />
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

ClientSubs.propTypes = {
  subsCategory: PropTypes.object,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default ClientSubs;

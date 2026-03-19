import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import ClientTable from "../../Components/ClientTable";
import axios from "axios";
import { startOfDay } from "date-fns";

const ClientSubs = ({ show, handleClose, subsCategory }) => {
  const [categorySubs, setCategorySubs] = useState({ category: "", id: 0 });
  const [listOfClients, setListOfClients] = useState([]);

  useEffect(() => {
    if (subsCategory) {
      setCategorySubs(subsCategory);
      //console.log(subsCategory);
    }
  }, [subsCategory]);

  useEffect(() => {
    //fetch data from the database
    axios.get(`/api/clientsubs/subs/${subsCategory.id}`).then((response) => {
      //console.log(response.data);
      //transform data format
      const data = response.data
        .map((item) => {
          let obj = {};
          const { firstname, lastname, middlename, sex } = item.ClientInfo;
          const { datestart, dateend } = item;
          // prettier-ignore
          if ( startOfDay(new Date(dateend)) > startOfDay(new Date()) ||  dateend == null ) {
            obj = {datestart,dateend,firstname,middlename,lastname,sex, };
          }
          return obj;
        })
        .filter((item) => Object.keys(item).length > 0);
      //console.log(response.data);
      setListOfClients(data);
    });
  }, [subsCategory]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard="false"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          Clients List with {categorySubs.category} Subscription
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-primary count-info mb-1">
          There are {listOfClients.length} clients
          {subsCategory.category === "Membership"
            ? ` who availed memberships `
            : ` with active sessions `}
        </div>
        <ClientTable
          listOfClients={listOfClients}
          isReport={true}
          isSubList={true}
        />
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

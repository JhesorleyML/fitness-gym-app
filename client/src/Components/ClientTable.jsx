import { useState } from "react";
import { Button, Pagination, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import { MdVisibility } from "react-icons/md";
import { format, differenceInDays, startOfDay } from "date-fns";
import "./style.css";

const ClientTable = ({
  listOfClients,
  handleViewDetails,
  isReport,
  isSubList,
  showAllPages,
}) => {
  //set how many entries per page
  const entriesPerPage = 10;

  //set the currentPage to page 1
  const [currentPage, setCurrentPage] = useState(1);

  //calculate how many pages
  const totalPages = Math.ceil(listOfClients.length / entriesPerPage);

  //determine the indexes of first and last entries
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  //get the list of clients of the current page
  const currentClients = showAllPages
    ? listOfClients
    : listOfClients.slice(indexOfFirstEntry, indexOfLastEntry);

  //handle page changes pass the pagenumber as parameter
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatdate = (date) => {
    if (date === null) {
      return "LifeTime";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No.</th>
            <th>Lastname</th>
            <th>Firstname</th>
            <th>Middlename</th>
            <th>Sex</th>
            <th>Address</th>
            {/* <th>{!isSubList ? `Address` : `Active Until`}</th> */}
            {isSubList && <th>Active Until</th>}
            {!isReport && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentClients.map((client, key) => {
            const rowNumber = (currentPage - 1) * entriesPerPage + key + 1;

            let rowClass = "";
            if (isSubList && client.dateend) {
              const daysLeft = differenceInDays(
                startOfDay(new Date(client.dateend)),
                startOfDay(new Date())
              );

              if (daysLeft <= 2) {
                rowClass = "row-danger";
              } else if (daysLeft <= 5) {
                rowClass = "row-warning";
              }
            }

            return (
              <tr key={key} className={rowClass}>
                <td>{rowNumber}</td>
                <td>{client.lastname}</td>
                <td>{client.firstname}</td>
                <td>{client.middlename}</td>
                <td>{client.sex}</td>
                <td>{client.address}</td>
                {/* <td>
                  {!isSubList ? client.address : formatdate(client.dateend)}
                </td> */}
                {isSubList && (
                  <td>{isSubList && formatdate(client.dateend)}</td>
                )}
                {!isReport && (
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleViewDetails(client)}
                    >
                      <MdVisibility />
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        {/**First Page */}
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        {/**Previous Page */}
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {/**Numbered Pages */}
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}

        {/**Next Page */}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        {/**Last Page */}
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </>
  );
};

ClientTable.propTypes = {
  listOfClients: PropTypes.array,
  handleViewDetails: PropTypes.func,
  isReport: PropTypes.bool,
  showAllPages: PropTypes.bool,
  isSubList: PropTypes.bool,
};

export default ClientTable;

import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Pagination, Table } from "react-bootstrap";
import { MdVisibility } from "react-icons/md";
import { format } from "date-fns";

const PaymentTable = ({
  listOfPayments,
  handleViewDetails,
  showAllPages,
  isReport,
}) => {
  //console.log(listOfPayments);
  //set how many entries per page
  const entriesPerPage = 10;

  //set the currentPage to page 1
  const [currentPage, setCurrentPage] = useState(1);

  //calculate how many pages
  const totalPages = Math.ceil(listOfPayments.length / entriesPerPage);

  //determine the indexes of first and last entries
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  //get the list of clients of the current page
  const currentPayments = showAllPages
    ? listOfPayments
    : listOfPayments.slice(indexOfFirstEntry, indexOfLastEntry);

  //handle page changes pass the pagenumber as parameter
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-end">No.</th>
            <th>Client name</th>
            <th className="text-end">Amount</th>
            <th>Payment Date</th>
            {!isReport && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentPayments.map((payment, key) => {
            const formattedDate = format(payment.paymentdate, "MMMM d, yyyy");
            return (
              <tr key={key}>
                <td className="text-end">{key + 1}</td>
                <td>{payment.fullname}</td>
                <td className="text-end">{payment.amount}</td>
                <td>{formattedDate}</td>
                {!isReport && (
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleViewDetails(payment)}
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
      {!showAllPages && (
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
      )}
    </>
  );
};

PaymentTable.propTypes = {
  listOfPayments: PropTypes.array,
  handleViewDetails: PropTypes.func,
  isReport: PropTypes.bool,
  showAllPages: PropTypes.bool,
};

export default PaymentTable;

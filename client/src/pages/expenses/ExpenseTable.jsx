import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Pagination, Table } from "react-bootstrap";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { format } from "date-fns";

const ExpenseTable = ({
  listOfExpenses,
  handleViewDetails,
  showAllPages,
  isReport,
}) => {
  //console.log(listOfExpenses);
  //set how many entries per page
  const entriesPerPage = 10;

  //set the currentPage to page 1
  const [currentPage, setCurrentPage] = useState(1);

  //calculate how many pages
  const totalPages = Math.ceil(listOfExpenses.length / entriesPerPage);

  //determine the indexes of first and last entries
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  //get the list of clients of the current page
  const currentExpenses = showAllPages
    ? listOfExpenses
    : listOfExpenses.slice(indexOfFirstEntry, indexOfLastEntry);

  //handle page changes pass the pagenumber as parameter
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No.</th>
            <th>Expense Name</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            {!isReport && <th style={{ width: "200px" }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentExpenses.map((expense, key) => {
            const formattedDate = format(expense.expdate, "MMMM d, yyyy");
            return (
              <tr key={key}>
                <td>{key + 1}</td>
                <td>{expense.title}</td>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>{formattedDate}</td>
                {!isReport && (
                  <td>
                    <Button size="sm" variant="warning" title="Edit">
                      <MdEdit />
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="info"
                      title="View"
                      onClick={() => handleViewDetails(expense)}
                    >
                      <MdVisibility />
                    </Button>{" "}
                    <Button size="sm" variant="danger" title="Delete">
                      <MdDelete />
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

ExpenseTable.propTypes = {
  listOfExpenses: PropTypes.array,
  handleViewDetails: PropTypes.func,
  isReport: PropTypes.bool,
  showAllPages: PropTypes.bool,
};

export default ExpenseTable;

import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Pagination, Table } from "react-bootstrap";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { format } from "date-fns";

const ExpenseTable = ({
  listOfExpenses,
  handleViewDetails,
  isReport,
  currentPage = 1,
  totalPages,
  onPageChange,
  showAllPages = false,
}) => {
  // Logic for client-side pagination fallback (used in reports)
  const [localPage, setLocalPage] = useState(1);
  const itemsPerPage = 10;
  
  // If we're NOT using server-side pagination (i.e., onPageChange is not provided)
  const isServerSide = !!onPageChange;
  const activePage = isServerSide ? currentPage : localPage;
  
  const displayExpenses = (isServerSide || showAllPages) 
    ? listOfExpenses 
    : listOfExpenses.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const localTotalPages = Math.ceil(listOfExpenses.length / itemsPerPage);
  const finalTotalPages = isServerSide ? totalPages : localTotalPages;

  const handlePageClick = (pageNum) => {
    if (isServerSide) {
      onPageChange(pageNum);
    } else {
      setLocalPage(pageNum);
    }
  };

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-end">No.</th>
            <th>Expense Name</th>
            <th>Category</th>
            <th className="text-end">Amount</th>
            <th>Date</th>
            {!isReport && <th className="text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {displayExpenses.length > 0 ? (
            displayExpenses.map((expense, index) => {
              const formattedDate = format(new Date(expense.expdate), "MMMM d, yyyy");
              const rowNumber = isServerSide 
                ? index + 1 + (activePage - 1) * 10
                : index + 1 + (activePage - 1) * itemsPerPage;

              return (
                <tr key={expense.id || index}>
                  <td className="text-end">{rowNumber}</td>
                  <td>{expense.title}</td>
                  <td>{expense.category}</td>
                  <td className="text-end">
                    {parseFloat(expense.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{formattedDate}</td>
                  {!isReport && (
                    <td className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(expense)}
                        title="View"
                      >
                        <MdVisibility /> View
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={isReport ? 5 : 6} className="text-center">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {!showAllPages && finalTotalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.First
            onClick={() => handlePageClick(1)}
            disabled={activePage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageClick(activePage - 1)}
            disabled={activePage === 1}
          />
          {[...Array(finalTotalPages)].map((_, i) => {
            const pageNum = i + 1;
            if (
              pageNum === 1 ||
              pageNum === finalTotalPages ||
              (pageNum >= activePage - 2 && pageNum <= activePage + 2)
            ) {
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === activePage}
                  onClick={() => handlePageClick(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            } else if (
              pageNum === activePage - 3 ||
              pageNum === activePage + 3
            ) {
              return <Pagination.Ellipsis key={pageNum} disabled />;
            }
            return null;
          })}
          <Pagination.Next
            onClick={() => handlePageClick(activePage + 1)}
            disabled={activePage === finalTotalPages}
          />
          <Pagination.Last
            onClick={() => handlePageClick(finalTotalPages)}
            disabled={activePage === finalTotalPages}
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
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  showAllPages: PropTypes.bool,
};

export default ExpenseTable;

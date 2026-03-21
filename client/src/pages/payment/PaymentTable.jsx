import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Pagination, Table } from "react-bootstrap";
import { MdVisibility } from "react-icons/md";
import { format } from "date-fns";

const PaymentTable = ({
  listOfPayments,
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
  
  const displayPayments = (isServerSide || showAllPages) 
    ? listOfPayments 
    : listOfPayments.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const localTotalPages = Math.ceil(listOfPayments.length / itemsPerPage);
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
            <th>Client name</th>
            <th className="text-end">Amount</th>
            <th>Payment Date</th>
            {!isReport && <th className="text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {displayPayments.length > 0 ? (
            displayPayments.map((payment, index) => {
              const rowNumber = isServerSide 
                ? index + 1 + (activePage - 1) * 10
                : index + 1 + (activePage - 1) * itemsPerPage;
              
              return (
                <tr key={payment.id || index}>
                  <td className="text-end">{rowNumber}</td>
                  <td>{payment.fullname}</td>
                  <td className="text-end">
                    {parseFloat(payment.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{payment.formattedDate}</td>
                  {!isReport && (
                    <td className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(payment)}
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
              <td colSpan={isReport ? 4 : 5} className="text-center">
                No payments found.
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
          
          {/* Show a range of pages if there are many */}
          {[...Array(finalTotalPages)].map((_, i) => {
            const pageNum = i + 1;
            // Simple logic to only show pages near current page
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

PaymentTable.propTypes = {
  listOfPayments: PropTypes.array,
  handleViewDetails: PropTypes.func,
  isReport: PropTypes.bool,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  showAllPages: PropTypes.bool,
};

export default PaymentTable;

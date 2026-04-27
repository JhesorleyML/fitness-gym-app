import { Table } from "react-bootstrap";
import PropTypes from "prop-types";

const MonthlyReportTable = ({ data }) => {
  // Currency Formatter
  const currencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  //separate map and year func
  const separateYearMonth = (monthYear) => {
    const [year, month] = monthYear.split("-");
    return { year, month };
  };

  const getMonthNameIntl = (monthNo) => {
    const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });
    const date = new Date(2000, parseInt(monthNo, 10) - 1); // Use any year, just set the month
    return formatter.format(date);
  };
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>No.</th>
          <th>Month</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((monthlyPayment, key) => {
          const { month } = separateYearMonth(monthlyPayment.month);
          return (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>{getMonthNameIntl(month)}</td>
              <td>{currencyFormatter.format(monthlyPayment.amount)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

MonthlyReportTable.propTypes = {
  data: PropTypes.array,
};

export default MonthlyReportTable;

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerField = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  return (
    <DatePicker
      id="date-picker"
      selected={selectedDate}
      onChange={setSelectedDate}
      dateFormat="yyyy-MM-dd" // Format the displayed date
      className="form-control" // Use Bootstrap's form styling
      placeholderText="Select a date"
      maxDate={new Date(2020, 11, 31)} // Allow dates up to December 31, 2022
      showYearDropdown
      showMonthDropdown
      isClearable
    />
  );
};

export default DatePickerField;

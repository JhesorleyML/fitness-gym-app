import { useState } from "react";
import { Container, Table, Form, Spinner, Breadcrumb } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { MdHome, MdEventNote } from "react-icons/md";
import { useNavigate } from "react-router";

const AttendanceLogs = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  const {
    data: logs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["attendanceLogs", selectedDate],
    queryFn: () =>
      axios.get(`/api/attendance?date=${selectedDate}`).then((res) => res.data),
  });

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return "---";
    return format(new Date(dateTime), "hh:mm a");
  };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/")}>
          <MdHome />
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate("/dashboard")}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Attendance Logs</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <MdEventNote className="me-2 text-primary" />
          Daily Attendance Logs
        </h2>
        <div style={{ width: "200px" }}>
          <Form.Group controlId="logDate">
            <Form.Label className="small fw-bold">Select Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Form.Group>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading logs...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-danger text-center">
          Error loading attendance logs.
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded">
          <Table responsive hover striped className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>No.</th>
                <th>Client Photo</th>
                <th>Client Name</th>
                <th className="text-center">Check-In</th>
                <th className="text-center">Check-Out</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No attendance records found for this date.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={log.id} className="align-middle">
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={log.ClientInfo.pic || "/default.jpg"}
                        alt="Profile"
                        className="rounded-circle border"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="fw-bold">
                      {`${log.ClientInfo.firstname} ${log.ClientInfo.lastname}`}
                    </td>
                    <td className="text-center text-success fw-bold">
                      {formatTime(log.checkIn)}
                    </td>
                    <td className="text-center text-primary fw-bold">
                      {formatTime(log.checkOut)}
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge bg-${log.checkOut ? "info" : "success"}`}
                      >
                        {log.checkOut ? "Completed" : "Still In"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AttendanceLogs;

import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import "./attendance.css";

const AttendanceScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastScannedCode, setLastScannedCode] = useState("");

  // Clear status after 8 seconds
  useEffect(() => {
    if (scanResult || error) {
      const timer = setTimeout(() => {
        setScanResult(null);
        setError(null);
        setLastScannedCode("");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [scanResult, error]);

  const handleScan = async (result) => {
    if (!result || result[0].rawValue === lastScannedCode) return;

    const code = result[0].rawValue;
    setLastScannedCode(code);
    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await axios.post("/api/attendance/scan", {
        qrCode: code,
      });
      setScanResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data || { message: "An error occurred during scanning." },
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (error) return "danger";
    if (scanResult?.type === "IN") return "success";
    if (scanResult?.type === "OUT") return "primary";
    return "info";
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Scan QR for Gym Attendance</h2>
      <Row>
        <Col md={6}>
          <Card className="scanner-card">
            <Card.Header className="bg-dark text-white text-center">
              Scan Your QR Code
            </Card.Header>
            <Card.Body className="p-0 scanner-container">
              <Scanner
                onScan={handleScan}
                onError={(err) => console.error(err)}
                allowMultiple={true}
                scanDelay={2000}
              />
              {loading && (
                <div className="scanner-overlay">
                  <Spinner animation="border" variant="light" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className={`status-card border-${getStatusColor()}`}>
            <Card.Header
              className={`bg-${getStatusColor()} text-white text-center h4`}
            >
              Status Board
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center min-vh-50">
              {!scanResult && !error && !loading && (
                <div className="text-center text-muted">
                  <h3>Ready to Scan</h3>
                  <p>Please place your QR code in front of the camera.</p>
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <Spinner animation="grow" variant="info" />
                  <h3 className="mt-3">Processing...</h3>
                </div>
              )}

              {error && (
                <div className="text-center w-100">
                  <Alert variant="danger" className="h4 py-4">
                    {error.message}
                  </Alert>
                  {error.client && (
                    <div className="mt-3">
                      <img
                        src={
                          error.client.pic
                            ? `/uploads/${error.client.pic}`
                            : "/default-account.jpg"
                        }
                        alt="Client"
                        className="rounded-circle mb-3 shadow"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <h2>{error.client.fullname}</h2>
                    </div>
                  )}
                </div>
              )}

              {scanResult && (
                <div className="text-center w-100">
                  <Alert variant={getStatusColor()} className="h3 py-4">
                    {scanResult.message}
                  </Alert>
                  <div className="mt-3">
                    <img
                      src={
                        scanResult.client.pic
                          ? `/uploads/${scanResult.client.pic}`
                          : "/default-account.jpg"
                      }
                      alt="Client"
                      className="rounded-circle mb-3 shadow"
                      style={{
                        width: "180px",
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />
                    <h2 className="display-6 fw-bold">
                      {scanResult.client.fullname}
                    </h2>
                    <h4 className="text-muted mt-2">
                      Subscription Active Until: <br />
                      <span className="text-dark">
                        {scanResult.client.expiry
                          ? new Date(
                              scanResult.client.expiry,
                            ).toLocaleDateString() //scanResult.client.expiry
                          : "LifeTime"}
                      </span>
                    </h4>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AttendanceScanner;

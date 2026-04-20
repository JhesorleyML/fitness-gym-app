import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";

const QRModal = ({ show, handleClose, client }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  if (!client) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Client QR Code</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div ref={componentRef} className="p-4 bg-white d-inline-block">
          <h3 className="mb-3">{`${client.firstname} ${client.lastname}`}</h3>
          <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={client.qrCode || ""}
              viewBox={`0 0 256 256`}
            />
          </div>
          <p className="mt-3 text-muted">QR ID: {client.qrCode}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          Print QR Code
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRModal;

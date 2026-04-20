# Implementation Plan - QR Code Check-In/Out System (Progress Tracking)

## 1. Objective
To automate client attendance tracking using QR codes. Each client has a unique 10-digit `qrCode`. Scanning this code toggles their attendance (Check-In/Out) and verifies their subscription.

## 2. Database Design Changes
- [x] **ClientInfo Model**: Added `qrCode` (10-digit STRING, unique).
- [x] **Attendance Model**: Created `Attendance.js` with `checkIn`, `checkOut`, and `date`.

## 3. Implementation Steps

### Phase 0: Client Model & Generation Logic
- [x] **Update Model**: Added `qrCode` to `server/models/ClientInfo.js`.
- [x] **Unique Code Generator**: Created `server/utils/qrGenerator.js`.
- [x] **Existing Clients Migration**: Created `server/utils/migration.js` and integrated into `server/index.js` to populate missing codes on startup.

### Phase 1: Registration Update
- [x] **Backend**: Updated `POST /api/clients/new` to generate `qrCode` automatically.

### Phase 2: Backend Attendance Logic
- [x] **Attendance Routes**: Created `server/routes/attendance.js` with `POST /scan` logic (toggle In/Out).
- [x] **Server Integration**: Mounted `/api/attendance` in `server/index.js`.

### Phase 3: QR Code Generation (Frontend)
- [x] **Library Installation**: Installed `react-qr-code` and `@yudiel/react-qr-scanner`.
- [ ] **QRModal Component**: Create a modal to display and print the QR code.
- [ ] **Client Table Integration**: Add "View QR" button to the client list.

### Phase 4: Scanning Interface
- [ ] **Attendance Scanner Page**: Create the scanning interface using the USB camera.
- [ ] **Navigation**: Add "Attendance" link to the TopNav.

## 4. Verification & Testing
- [ ] Test uniqueness of 10-digit codes.
- [ ] Verify Check-In/Out toggle flow.
- [ ] Verify "No active session" error message.

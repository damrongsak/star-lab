# TASK.md

## 📅 Active Sprint (Sept 2025)

### 1. User Management & Authentication

* [ ] **Customer Registration & Profile**

  * Capture company name, ID card/tax ID, address, shipping address
  * Upload supporting documents
  * Email confirmation
* [ ] **Internal Lab User Management**

  * Admins can add/edit/delete staff
  * Roles: Admin, Technician, Doctor, Approval
  * Role-based route protection

### 2. Customer Portal

* [ ] **Request List**

  * View/search submitted test requests
  * Show request date, request number, status
  * Allow edit/delete if permitted
* [ ] **Add/Edit Request**

  * Auto-generate request number
  * Manage dynamic sample list (ID, date, specimen, panel, qty)
  * Save Draft / Submit
* [ ] **Invoice Page**

  * Show invoice details (lab + customer info, items, tax, total)
  * Upload payment slip

### 3. Lab Internal Operations

* [ ] **Admin Dashboard**

  * Search/filter requests
  * View statuses and actions (acknowledge, approve/reject, mark paid)
* [ ] **Receive Sample**

  * Adjust received quantity
  * Confirm acknowledgement
* [ ] **Lab Result Entry**

  * Input results per sample
  * Upload result attachments (PDF/CSV/image)
  * Submit for doctor approval

### 4. Doctor Approval

* [ ] **Approval Workflow**

  * List pending documents
  * Review results & attachments
  * Approve → notify customer + enable invoice
  * Reject → capture reason, return to technician

---

## 🔄 Discovered During Work

* [ ] Integrate BullMQ background parsing stub (PDF/CSV)
* [ ] Ensure tests for all new routes (frontend/backend)
* [ ] Configure Google Cloud Storage for uploads

---

## ✅ Completed

*(Mark items here after merge)*

---

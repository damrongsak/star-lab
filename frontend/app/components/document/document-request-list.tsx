// src/components/document-request-list.tsx

import React from "react";
import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faPrint,
  faCheckCircle,
  faTimesCircle,
  faCaretDown, // Added for dropdown arrow
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(
  faEdit,
  faTrashAlt,
  faPrint,
  faCheckCircle,
  faTimesCircle,
  faCaretDown
);

interface DocumentRequest {
  id: string;
  requestDate: string;
  requestNo: string;
  company: string;
  requester: string;
  documentStatus: string;
  paid: boolean;
}

interface DocumentRequestListProps {
  requests: DocumentRequest[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number; // Added itemsPerPage to props
  handleItemsPerPageChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void; // Added handler to props
}

const DocumentRequestList: React.FC<DocumentRequestListProps> = ({
  requests,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  handleItemsPerPageChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return "blue";
      case "acknowledged":
        return "orange";
      case "paid":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div className="document-request-list" style={{ fontSize: "14px" }}>
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => console.log("Add New Request")}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
          }}
        >
          + Add New Request
        </button>
        <div style={{ fontSize: "14px", color: "#555" }}>
          <span>
            {" "}
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "blue" }}
            />{" "}
            Submitted{" "}
          </span>
          <span>
            {" "}
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "orange" }}
            />{" "}
            Acknowledged{" "}
          </span>
          <span>
            {" "}
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "yellow" }}
            />{" "}
            Paid{" "}
          </span>
          <span>
            {" "}
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "green" }}
            />{" "}
            Approved{" "}
          </span>
          <span>
            {" "}
            <FontAwesomeIcon
              icon={faTimesCircle}
              style={{ color: "red" }}
            />{" "}
            Rejected{" "}
          </span>
        </div>
      </div>
      <div style={{ marginTop: "16px", fontSize: "14px", color: "#555" }}></div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Request Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Request No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requester
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Document Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paid
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Edit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Delete
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Print
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {request.requestDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {request.requestNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{request.company}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {request.requester}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap"
                style={{ color: getStatusColor(request.documentStatus) }}
              >
                {request.documentStatus}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {request.paid ? (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{ color: "green" }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    style={{ color: "red" }}
                  />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <NavLink
                  to={`/edit/${request.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FontAwesomeIcon icon={faEdit} size="lg" />
                </NavLink>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <NavLink
                  to={`/delete/${request.id}`}
                  className="text-red-600 hover:text-red-900"
                >
                  <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </NavLink>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <NavLink
                  to={`/print/${request.id}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FontAwesomeIcon icon={faPrint} size="lg" />
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "16px",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ position: "relative", marginRight: "8px" }}>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{
              padding: "8px 30px 8px 8px", // Added padding for arrow
              borderRadius: "4px",
              border: "1px solid #ccc",
              appearance: "none", // Remove default arrow
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <FontAwesomeIcon
            icon={faCaretDown}
            style={{
              position: "absolute",
              top: "50%",
              right: "8px",
              transform: "translateY(-50%)",
              pointerEvents: "none", // Prevent click events on the icon
            }}
          />
        </div>

        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginRight: "8px",
          }}
        >
          PREV
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={currentPage === page}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginRight: "4px",
              backgroundColor: currentPage === page ? "#f0f0f0" : "white",
            }}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default DocumentRequestList;

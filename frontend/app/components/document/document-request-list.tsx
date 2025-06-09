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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.requestDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.requestNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.company}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                  to={`/customer/requests/edit/${request.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FontAwesomeIcon icon={faEdit} size="lg" />
                </NavLink>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <NavLink
                  to={`/customer/requests/delete/${request.id}`}
                  className="text-red-600 hover:text-red-900"
                >
                  <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </NavLink>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <NavLink
                  to={`/customer/requests/print/${request.id}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FontAwesomeIcon icon={faPrint} size="lg" />
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentRequestList;

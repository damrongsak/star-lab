import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon

interface SearchDocumentRequestProps {
  onSearch: (filters: any) => void; // Define the type for filters
}

const formatDate = (date: string) => {
  const [month, day, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export function SearchDocumentRequest({
  onSearch,
}: SearchDocumentRequestProps) {
  const [requestNumber, setRequestNumber] = useState("");
  const [documentStatus, setDocumentStatus] = useState("All");
  const [description, setDescription] = useState("");
  const [requester, setRequester] = useState("");
  const [company, setCompany] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSearch = () => {
    const filters = {
      requestNumber,
      documentStatus,
      description,
      requester,
      company,
      fromDate: fromDate ? formatDate(fromDate) : "",
      toDate: toDate ? formatDate(toDate) : "",
    };
    onSearch(filters);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Request Number
          </label>
          <input
            type="text"
            value={requestNumber}
            onChange={(e) => setRequestNumber(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
            placeholder="Enter requester number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Document status
          </label>
          <select
            value={documentStatus}
            onChange={(e) => setDocumentStatus(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
          >
            <option value="All">All</option>
            {/* Add more options as needed */}
            <option value="Submited">Submited</option>
            <option value="Acknowledged">
              Acknowledged and Received Sample
            </option>
            <option value="Paid">Paid</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
            placeholder="Enter Description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Requester
          </label>
          <input
            type="text"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
            placeholder="Enter request name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
          >
            <option value="All">All</option>
            {/* Add more options as needed */}
            <option value="Company A">Company A</option>
            <option value="Company B">Company B</option>
          </select>
        </div>
        <div className="flex items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Request Date
            </label>
            <div className="flex items-center mt-1">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
              <FaCalendarAlt className="ml-2 text-gray-500" />
            </div>
          </div>
          <div className="flex-1 ml-4">
            <label className="block text-sm font-medium text-gray-700">
              &nbsp;
            </label>{" "}
            {/* Placeholder label */}
            <div className="flex items-center mt-1">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
              <FaCalendarAlt className="ml-2 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

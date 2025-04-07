// routes/customer.request-list.tsx

import React, { useState } from "react";
import type { Route } from "./+types/customer.request-list";

import { SearchDocumentRequest } from "../components/document/search-document-request";
import DocumentRequestList from "../components/document/document-request-list";

// Assuming you have a type for DocumentRequest
interface DocumentRequest {
  id: string;
  requestDate: string;
  requestNo: string;
  company: string;
  requester: string;
  documentStatus: string;
  paid: boolean;
  // ... other properties
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "List all lab request." },
  ];
}

export default function RequestList() {
  const [requests, setRequests] = useState<DocumentRequest[]>([
    {
      id: "1",
      requestDate: "09/09/2024 09:30:39",
      requestNo: "Req-20240909-001",
      company: "ซี พี เอ ฟ (ประเทศไทย) จำกัด มหาชน (บน)",
      requester: "สพ. ผู้ขอให้กดสอน",
      documentStatus: "Submitted",
      paid: false,
    },
    {
      id: "2",
      requestDate: "09/09/2024 09:00:00",
      requestNo: "Req-20240909-002",
      company: "ซี พี เอ ฟ (ประเทศไทย) จำกัด มหาชน (บางนา)",
      requester: "สพ. ผู้ขอให้ทดสอบ",
      documentStatus: "Submitted",
      paid: false,
    },
    // ... add more sample data
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSearch = (filters: any) => {
    // Implement search logic here using the 'filters'
    // For now, let's just log the filters
    console.log(filters);

    // If you need to filter the requests array based on the filters,
    // you can update the 'requests' state here with the filtered results.
    // Example:
    // const filteredRequests = requests.filter(...);
    // setRequests(filteredRequests);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Document Request List</h1>
      <div className="mb-4">
        <SearchDocumentRequest onSearch={handleSearch} />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <DocumentRequestList
          requests={currentRequests}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}

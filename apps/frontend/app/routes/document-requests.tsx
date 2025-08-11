import React from "react";

const DocumentRequests: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] bg-light-bg-secondary dark:bg-dark-bg-main text-light-text-main dark:text-dark-text-main p-4">
      <h1 className="text-3xl font-bold mb-4">Document Requests</h1>
      <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
        This page will display document requests and their statuses.
      </p>
      {/* Additional content can be added here */}
    </div>
  );
};

export default DocumentRequests;
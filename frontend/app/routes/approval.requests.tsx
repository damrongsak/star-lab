import React from "react";
import type { Route } from "./+types/approval.requests";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Approval" },
    { name: "Approval management", content: "Manage requests." },
  ];
}

export default function ApprovalRequests() {
  return (
    <div>
      <h1>Approval Requests</h1>
    </div>
  );
}

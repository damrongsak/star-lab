import React from "react";
import type { Route } from "./+types/approval.request-details";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Approval" },
    { name: "Approval management", content: "Request details." },
  ];
}

export default function RequestDetails() {
  return (
    <div>
      <h1>Request Details</h1>
    </div>
  );
}

import React from "react";
import type { Route } from "./+types/customer.request-details";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Request details." },
  ];
}

export default function RequestDetails() {
  return (
    <div>
      <h1>Request Detailsx</h1>
    </div>
  );
}

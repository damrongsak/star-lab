import React from "react";
import type { Route } from "./+types/admin.request-details";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Manage requests." },
  ];
}

export default function RequestDetails() {
  return (
    <div>
      <h1>Request Details</h1>
    </div>
  );
}

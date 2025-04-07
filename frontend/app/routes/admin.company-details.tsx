import React from "react";
import type { Route } from "./+types/admin.company-details";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Manage company details." },
  ];
}

export default function AdminCompanyDetails() {
  return (
    <div>
      <h1>Admin Company Details</h1>
    </div>
  );
}

import React from "react";
import type { Route } from "./+types/admin.companies";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Manage companies." },
  ];
}

export default function AdminCompanies() {
  return (
    <div>
      <h1>Admin Companies</h1>
    </div>
  );
}

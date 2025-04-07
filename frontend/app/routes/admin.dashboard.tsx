import React from "react";
import type { Route } from "./+types/admin.dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Admin dashboard." },
  ];
}

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}

import React from "react";
import type { Route } from "./+types/admin.user-details";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Manage user details." },
  ];
}

export default function AdminUserDetails() {
  return (
    <div>
      <h1>Admin User Details</h1>
    </div>
  );
}

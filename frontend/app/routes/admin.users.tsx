import React from "react";
import type { Route } from "./+types/admin.users";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Manage users." },
  ];
}

export default function AdminUsers() {
  return (
    <div>
      <h1>Admin Users</h1>
    </div>
  );
}

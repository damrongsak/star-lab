import React from "react";
import type { Route } from "./+types/admin.requests";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Manage requests." },
  ];
}

export default function Requests() {
  return (
    <div>
      <h1>Requests List</h1>
    </div>
  );
}

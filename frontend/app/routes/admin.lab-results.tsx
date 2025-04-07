import React from "react";
import type { Route } from "./+types/admin.lab-results";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Manage lab results." },
  ];
}

export default function LabResults() {
  return (
    <div>
      <h1>Admin Lab Results</h1>
    </div>
  );
}

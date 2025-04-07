import React from "react";
import type { Route } from "./+types/admin.result-details";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Result details." },
  ];
}

export default function ResultDetails() {
  return (
    <div>
      <h1>Result Details</h1>
    </div>
  );
}

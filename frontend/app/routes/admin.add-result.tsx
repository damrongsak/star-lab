import React from "react";
import type { Route } from "./+types/admin.add-result";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "Admin management", content: "Add result." },
  ];
}

export default function AddResult() {
  return (
    <div>
      <h1>Add Result</h1>
    </div>
  );
}

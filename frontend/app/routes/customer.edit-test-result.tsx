import React from "react";
import type { Route } from "./+types/customer.edit-test-result";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Edit test result." },
  ];
}

export default function EditTestResult() {
  return (
    <div>
      <h1>Edit Test Result</h1>
    </div>
  );
}

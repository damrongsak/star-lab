import React from "react";
import type { Route } from "./+types/customer.add-test-result";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Add test result." },
  ];
}

export default function AddTestResult() {
  return (
    <div>
      <h1>Add Test Result</h1>
    </div>
  );
}

import React from "react";
import type { Route } from "./+types/customer.delete-test-result";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Delete test result." },
  ];
}

export default function DeleteTestResult() {
  return (
    <div>
      <h1>Delete Test Result</h1>
    </div>
  );
}

import React from "react";
import type { Route } from "./+types/customer.sample-details";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Sample details." },
  ];
}

export default function SampleDetails() {
  return (
    <div>
      <h1>Sample Details</h1>
    </div>
  );
}

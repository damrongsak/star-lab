import React from "react";
import type { Route } from "./+types/customer.request-test";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Request test." },
  ];
}

export default function RequestTest() {
  return (
    <div>
      <h1>Request Test</h1>
    </div>
  );
}

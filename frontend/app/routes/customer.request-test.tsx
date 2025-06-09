import React from "react";
import type { Route } from "./+types/customer.request-test";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Customer request test." },
  ];
}

export default function RequestTest() {
  return (
    <div>
      <h1>Customer request test</h1>
    </div>
  );
}

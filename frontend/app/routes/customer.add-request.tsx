import React from "react";
import type { Route } from "./+types/customer.add-request";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Add lab request." },
  ];
}

export default function AddRequest() {
  return (
    <div>
      <h1>Add Request</h1>
    </div>
  );
}

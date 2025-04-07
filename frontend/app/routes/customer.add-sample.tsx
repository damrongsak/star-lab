import React from "react";
import type { Route } from "./+types/customer.add-sample";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Add lab sample." },
  ];
}

export default function AddSample() {
  return (
    <div>
      <h1>Add Sample</h1>
    </div>
  );
}

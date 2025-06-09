import React, { useState } from "react";
import type { Route } from "./+types/customer.edit-request";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer" },
    { name: "Customer management", content: "Edit customer request." },
  ];
}

export default function CustomerEditRequest() {
  return (
    <div>
      <h1>Edit Customer Request</h1>
    </div>
  );
}

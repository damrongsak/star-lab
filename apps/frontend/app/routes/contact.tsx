import React from "react";

export default function ContactCard() {
  const contactData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Elm Street, Star City, SC 54321",
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "300px",
        margin: "20px auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>Contact Card</h2>
      <p>
        <strong>Name:</strong> {contactData.name}
      </p>
      <p>
        <strong>Email:</strong> {contactData.email}
      </p>
      <p>
        <strong>Phone:</strong> {contactData.phone}
      </p>
      <p>
        <strong>Address:</strong> {contactData.address}
      </p>
    </div>
  );
}

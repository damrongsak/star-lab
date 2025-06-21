import React from "react";

const AboutUsCard = () => {
  const exampleData = {
    title: "About Us",
    description:
      "We are a team of passionate developers dedicated to building amazing applications.",
    teamMembers: [
      { name: "Alice", role: "Frontend Developer" },
      { name: "Bob", role: "Backend Developer" },
      { name: "Charlie", role: "UI/UX Designer" },
    ],
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h1>{exampleData.title}</h1>
      <p>{exampleData.description}</p>
      <h2>Our Team</h2>
      <ul>
        {exampleData.teamMembers.map((member, index) => (
          <li key={index}>
            <strong>{member.name}</strong> - {member.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AboutUsCard;

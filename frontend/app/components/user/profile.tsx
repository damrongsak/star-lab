import React from "react";

interface ProfileProps {
  data: any;
}

export function Profile({ data }: ProfileProps) {
  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
      <p>Username: {data.username}</p>
    </div>
  );
}

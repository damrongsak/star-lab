import React from "react";
import type { Route } from "./+types/register";
import { Register } from "../components/user/register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User" },
    { name: "User management", content: "Manage user registration." },
  ];
}

export async function ClientLoader({ params }: Route.LoaderArgs) {
  const id = params.id;
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const user = await res.json();
  return user;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export async function action() {}

export default function register() {
  return (
    <div>
      <Register />
    </div>
  );
}

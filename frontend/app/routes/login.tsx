import type { Route } from "./+types/login";
import { Login } from "../components/login/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Auth() {
  return <Login />;
}

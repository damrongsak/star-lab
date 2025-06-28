import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("products", "routes/products.tsx"),
  route("blog", "routes/blog.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("profile", "routes/profile.tsx"),
  route("login", "routes/login.tsx"),
  route("settings", "routes/settings.tsx"),
  route("document-requests", "routes/document-requests.tsx"),
  route("test-requests", "routes/test-requests.tsx"),
  route("invoices", "routes/invoices.tsx"),
  route("customers", "routes/customers.tsx"),
] satisfies RouteConfig;

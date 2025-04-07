import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8080; // Default port if PORT env var is not set

// Proxy requests to the auth-service
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://auth-service:5001",
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
  })
);

// Proxy requests to other services
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://other-service:5002",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  })
);

// Start the server
app.listen(port, () => {
  console.log(`API Gateway is running on http://localhost:${port}`);
});
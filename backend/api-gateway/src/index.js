"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_proxy_middleware_1 = require("http-proxy-middleware");
var app = (0, express_1.default)();
// Proxy requests to the auth-service
app.use("/auth", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: "http://auth-service:5000",
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
}));
// Proxy requests to other services
app.use("/api", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: "http://other-service:5001",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
}));
// Start the server
app.listen(80, function () {
    console.log("API Gateway running on port 80");
});

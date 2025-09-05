import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // กำหนด root ของ Turbopack ให้ชี้ไปที่ root ของ monorepo
    root: path.join(__dirname, '..'),
  },
};

export default nextConfig;

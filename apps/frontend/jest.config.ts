import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // Adjust this if your aliases are different
    "^@star-lab/shared$": "<rootDir>/../../packages/shared/index.ts",
    "^@star-lab/shared/(.*)$": "<rootDir>/../../packages/shared/$1",
    "^@star-lab/(.*)$": "<rootDir>/../../packages/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!src/**/*.d.ts",
  ],
  coverageReporters: ["json", "lcov", "text", "clover"],
};

export default config;

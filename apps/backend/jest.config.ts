import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // If you are using path aliases in tsconfig.json
  },
  modulePaths: [
    "<rootDir>", // To help Jest find modules relative to the project root if needed
  ],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.ts", "**/*.(test|spec).ts"], // More explicit test matching
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!src/**/*.d.ts", // Exclude declaration files if you have them
  ],
  coverageReporters: ["json", "lcov", "text", "clover"],
};

export default config;

// export default {
//   preset: "ts-jest",
//   testEnvironment: "jsdom",
//   setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
// };

import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Add this line
  rootDir: ".",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // Adjust this if your aliases are different
    "^@star-lab/shared$": "<rootDir>/../../packages/shared/index.ts",
    "^@star-lab/shared/(.*)$": "<rootDir>/../../packages/shared/$1",
    "^@star-lab/(.*)$": "<rootDir>/../../packages/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
        },
      },
    ],
  },
  testMatch: ["<rootDir>/**/__tests__/**/*.ts?(x)", "<rootDir>/**/?(*.)+(spec|test).ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
  coverageReporters: ["json", "lcov", "text", "clover"],
};

export default config;
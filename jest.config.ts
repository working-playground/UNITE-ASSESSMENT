import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    clearMocks: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/service/**/*.ts",
        "src/persistence/**/*.ts",
        "!src/**/index.ts",
        "!src/main.ts"
    ]
};

export default config;

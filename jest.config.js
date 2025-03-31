module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "json", "vue", "ts", "tsx"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/tests/**/*.[jt]s?(x)",
    "**/__tests__/*.[jt]s?(x)",
    "**/src/**/*.spec.[jt]s?(x)",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,vue,ts}",
    "!src/main.ts",
    "!src/**/*.d.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: ["<rootDir>/tests/setup.ts"],
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: "./",
  projects: [
    {
      displayName: "Client",
      preset: 'ts-jest',
      testEnvironment: "jsdom",
      transform: {
        "^.+\\.(css|less|sass|scss|png|jpg|gif|ttf|woff|woff2|svg)$": "jest-transform-stub",
        "^.+\\.(js|jsx)?$": "babel-jest",
        "^.+\\.(ts|tsx)?$": "ts-jest",
      },
      transformIgnorePatterns: [
        '/node_modules/(?!@mui/x-charts|@mui/material|@babel/runtime|d3-(color|format|interpolate|scale|shape|time|time-format|path|array)|internmap)',
      ],
      testMatch: ['<rootDir>/client/tests/*.test.*'],
    },
    {
      displayName: "Server",
      preset: 'ts-jest',
      testEnvironment: "node",
      transform: {
        "^.+\\.(css|less|sass|scss|png|jpg|gif|ttf|woff|woff2|svg)$": "jest-transform-stub",
        "^.+\\.(js|jsx)?$": "babel-jest",
        "^.+\\.(ts|tsx)?$": "ts-jest",
      },
      testMatch: ['<rootDir>/server/tests/*.test.*'],
    },
  ]
};

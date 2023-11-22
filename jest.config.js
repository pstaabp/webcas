/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // moduleNameMapper: {
  //   "/^@\/(.*)$/": "<rootDir>/src/$1",
  // },
	roots: [
    "<rootDir>"
  ],
  modulePaths: [
    "<rootDir>/src/",
  ],
  moduleDirectories: [
    "node_modules",
		"<rootDir>/src"
  ],
};

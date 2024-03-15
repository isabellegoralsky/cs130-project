const config = {
    verbose: true,
    moduleNameMapper: {
        '\\.css$': '<rootDir>/cssMock.js',
      },
      "testEnvironment": "jsdom"
  };
  
module.exports = config;
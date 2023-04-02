const path = require("path");

// module.exports = {
//   presets: ["@babel/preset-typescript", "@babel/preset-env"],
//   plugins: [path.resolve(__dirname, "dist/babel-plugin/index.js")],
// };

module.exports = {
  plugins: [
    [
      "./dist/babel-plugin/index.js",
      {
        tagName: "styled",
      },
    ],
  ],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
  ],
};

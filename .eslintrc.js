module.exports = {
  plugins: ["import"],
  rules: {
    "import/no-unresolved": "error",
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@mui/material", "./node_modules/@mui/material"]],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};

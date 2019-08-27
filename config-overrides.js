const path = require('path')
const {override, fixBabelImports, addWebpackAlias, addLessLoader} = require('customize-cra');
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  }),
  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { '@primary-color': '#ff18e3' }
  })
);
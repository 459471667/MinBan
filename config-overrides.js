const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');
const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, 'src/ant-default-vars.less'), 'utf8'));

module.exports = function override(config, env) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(['import', {libraryName: 'antd', libraryDirectory: 'es', style: true}], config);
    config = rewireLess.withLoaderOptions({
        modifyVars: themeVariables,
    })(config, env);
    return config;
};
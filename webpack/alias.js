const path = require("path");
const paths = require('./paths');

const alias = {
    'Sass': path.resolve(paths.appSrc, "Sass"),
    'Requests': path.resolve(paths.appSrc, "Requests"),
    'Constants': path.resolve(paths.appSrc, "Constants"),
    'Containers': path.resolve(paths.appSrc, "Containers"),
    'Components': path.resolve(paths.appSrc, "Components"),
    'Reducers': path.resolve(paths.appSrc, "Reducers"),
    'Actions': path.resolve(paths.appSrc, "Actions"),
    'Assets': path.resolve(paths.appPublic, "assets"),
    'Store': path.resolve(paths.appSrc, "Store"),
}

module.exports = alias;

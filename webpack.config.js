const path = require("path");
const webpack = require("webpack");
const paths = require('./webpack/paths');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const env = require('./webpack/env');

const alias = require('./webpack/alias');
const loaders = require('./webpack/loaders');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3000"

const config = {
	// Don't attempt to continue if there are any errors.
	bail: true,
	entry: [
		'webpack/hot/only-dev-server',
		'webpack-dev-server/client?http://'+ HOST +':'+ PORT,
		require.resolve('./webpack/polyfills'),
		// Finally, this is your app's code:
		paths.appIndexJs,
	],
	output: {
		path: paths.appBuild,
		publicPath: publicPath,
		filename: "[name].[hash:7].js",
		chunkFilename: '[id].bundle.js',
		sourceMapFilename: '[file].map',
		devtoolModuleFilenameTemplate: '/[absolute-resource-path]',
	},
	devtool: "cheap-module-source-map",
	resolve: {
		modules: ['node_modules'].concat(paths.appNodeModules),
		extensions: ['.js', '.json', '.jsx', ".sass", ".scss"],
		alias: alias,
		plugins: [
			// Prevents users from importing files from outside of src/ (or node_modules/).
			// This often causes confusion because we only process files within src/ with babel.
			// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
			// please link the files into your node_modules/ and let module-resolution kick in.
			// Make sure your source files are compiled, as they will not be processed in any way.
			new ModuleScopePlugin(paths.appSrc),
		],
	},
	module: {
		rules: [
			...loaders
		]
	},
	devServer: {
		contentBase: paths.appSrc,
		watchContentBase: true,
		compress: true,
		clientLogLevel: 'none',
		watchOptions: {
			ignored: /node_modules/,
		},
		port: PORT,
		host: HOST,
		hot: true,
		quiet: false,
		overlay: true,
		stats: {
			colors: true
		},
		historyApiFallback: {
			disableDotRule: true,
		},
	},
	plugins: [
		new CaseSensitivePathsPlugin(),
		new WatchMissingNodeModulesPlugin(paths.appNodeModules),

		new webpack.DefinePlugin(env()),
		// enable HMR globally
		new webpack.HotModuleReplacementPlugin(),

		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
		}),
		// Moment.js is an extremely popular library that bundles large locale files
		// by default due to how Webpack interprets its code. This is a practical
		// solution that requires the user to opt into importing specific locales.
		// https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
		// You can remove this if you don't use Moment.js:
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		__dirname: true,
	},
	performance: {
		hints: false,
	},
};

module.exports = config;

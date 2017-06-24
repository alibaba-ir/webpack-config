const path = require("path");
const webpack = require("webpack");
const paths = require('./webpack/paths');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const WatchMissingNodeModulesPlugin = require('./webpack/WatchMissingNodeModulesPlugin');
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
	context: paths.appSrc,
	entry: {
		app: [
			"react-hot-loader/patch",
			"babel-polyfill",
			"./index.js"
		],
		devServer: [
			'webpack/hot/only-dev-server',
			'webpack-dev-server/client?http://'+ HOST +':'+ PORT,
			'webpack-hot-middleware/client?reload=true',
		]
	},
	output: {
		path: paths.appBuild,
		publicPath: publicPath,
		filename: "[name].[hash:7].js",
		chunkFilename: '[id].bundle.js',
		sourceMapFilename: '[file].map',
		library: '__init__',
		libraryTarget: 'this',
		devtoolModuleFilenameTemplate: '/[resource-path]',
	},
	devtool: process.env.NODE_ENV !== "production" ? "cheap-module-source-map" : "",
	resolve: {
		modules: ['node_modules'].concat(paths.appNodeModules),
		extensions: ['.js', '.json', '.jsx', ".sass", ".scss"],
		alias: alias,
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
		inline: true,
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
		new webpack.ProgressPlugin(),

		new webpack.DefinePlugin(env()),
		new webpack.HotModuleReplacementPlugin(),
		// enable HMR globally

		new webpack.NamedModulesPlugin(),
		// prints more readable module names in the browser console on HMR updates

		new webpack.NoEmitOnErrorsPlugin(),
		// do not emit compiled assets that include errors
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

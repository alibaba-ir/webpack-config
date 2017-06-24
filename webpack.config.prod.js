const path = require("path");
const webpack = require("webpack");
const paths = require('./webpack/paths');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const WatchMissingNodeModulesPlugin = require('./webpack/WatchMissingNodeModulesPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const env = require('./webpack/env');

const alias = require('./webpack/alias');
const loaders = require('./webpack/loaders-prod');

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3000"

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Note: defined here because it will be used more than once.
const cssFilename = 'static/css/[name].[contenthash:8].css';

const config = {
	// Don't attempt to continue if there are any errors.
	bail: true,
	context: paths.appSrc,
	entry: {
		app: [
			"babel-polyfill",
			"./index.js"
		]
	},
	output: {
		path: paths.appBuild,
		publicPath: publicPath,
		filename: 'static/js/[name].[hash:8].js',
		chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
		sourceMapFilename: '[file].map',
		library: '__init__',
		libraryTarget: 'this',
		devtoolModuleFilenameTemplate: '/[resource-path]',
	},
	devtool: 'source-map',
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
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			comments: false,
			compress: {
				warnings: false,
				drop_console: true,
				screw_ie8: true
			},
			mangle: {
				except: [
					'$', 'webpackJsonp'
				],
				screw_ie8: true,
				keep_fnames: true
			},
			output: {
				comments: false,
				screw_ie8: true
			},
			minimize: true,
			sourceMap: true,
		}),
		// Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
		new ExtractTextPlugin({
			filename: cssFilename,
		}),
		// Generate a manifest file which contains a mapping of all asset filenames
		// to their corresponding output file so that tools can pick it up without
		// having to parse `index.html`.
		new ManifestPlugin({
			fileName: 'asset-manifest.json',
		}),
		// Generate a service worker script that will precache, and keep up to date,
		// the HTML & assets that are part of the Webpack build.
		new SWPrecacheWebpackPlugin({
			// By default, a cache-busting query parameter is appended to requests
			// used to populate the caches, to ensure the responses are fresh.
			// If a URL is already hashed by Webpack, then there is no concern
			// about it being stale, and the cache-busting can be skipped.
			dontCacheBustUrlsMatching: /\.\w{8}\./,
			filename: 'service-worker.js',
			logger(message) {
				if (message.indexOf('Total precache size is') === 0) {
					// This message occurs for every build and is a bit too noisy.
					return;
				}
				console.log(message);
			},
			minify: true,
			// For unknown URLs, fallback to the index page
			navigateFallback: publicUrl + '/index.html',
			// Ignores URLs starting from /__ (useful for Firebase):
			// https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
			navigateFallbackWhitelist: [/^(?!\/__).*/],
			// Don't precache sourcemaps (they're large) and build asset manifest:
			staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
			// Work around Windows path issue in SWPrecacheWebpackPlugin:
			// https://github.com/facebookincubator/create-react-app/issues/2235
			stripPrefix: paths.appBuild.replace(/\\/g, '/') + '/',
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
};

module.exports = config;

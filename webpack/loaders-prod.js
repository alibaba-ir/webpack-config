const findCacheDir = require('find-cache-dir');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const loaders = [
	{
		test: /\.jsx?$/,
		exclude: /node_modules/,
		use: [
			{
				loader: "babel-loader",
				options: {
					presets: ["alibaba"],
					cacheDirectory: findCacheDir({name: "cache-directory"}),
					ignore: /node_modules/,
					babelrc: false
				}
			}
		]
	},
	{
		test: /\.scss$/,
		use: ExtractTextPlugin.extract({
			fallback: 'style-loader',
			//resolve-url-loader may be chained before sass-loader if necessary
			use: [
				{
					loader: 'css-loader', // translates CSS into CommonJS
					options: {
						module: true,
						minimize: true,
						importLoaders: 2,
						localIdentName: '[name]__[local]--[hash:base64:7]',
					}
				},
				{
					loader: "sass-loader", // compiles Sass to CSS
					options: {
						sourceMap: true,
						data: "$env: " + process.env.NODE_ENV + ";"
					}
				}
			]
		}),
	}
];

module.exports = loaders;

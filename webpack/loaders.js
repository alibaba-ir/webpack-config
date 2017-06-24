const findCacheDir = require('find-cache-dir');

const loaders = [
	{
		test: /\.jsx?$/,
		exclude: /node_modules/,
		use: [
			{
				loader: "babel-loader",
				options: {
					presets: ["alibaba", "react-hmre"],
					plugins: ["react-hot-loader/babel"],
					cacheDirectory: findCacheDir({name: "cache-directory"}),
					ignore: /node_modules/,
					babelrc: false
				}
			}
		]
	},
	{
		test: /\.scss$/,
		use: [
			{
				loader: "style-loader" // creates style nodes from JS strings
			},
			{
				loader: "css-loader", // translates CSS into CommonJS
				options: {
					sourceMap: true,
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
	}
];

module.exports = loaders;

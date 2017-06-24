const findCacheDir = require('find-cache-dir');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const loaders = [
	// ** ADDING/UPDATING LOADERS **
	// The "file" loader handles all assets unless explicitly excluded.
	// The `exclude` list *must* be updated with every change to loader extensions.
	// When adding a new loader, you must add its `test`
	// as a new entry in the `exclude` list for "file" loader.

	// "file" loader makes sure those assets get served by WebpackDevServer.
	// When you `import` an asset, you get its (virtual) filename.
	// In production, they would get copied to the `build` folder.
	{
		exclude: [
			/\.html$/,
			/\.(js|jsx)$/,
			/\.css$/,
			/\.json$/,
			/\.bmp$/,
			/\.gif$/,
			/\.jpe?g$/,
			/\.png$/,
		],
		loader: "file-loader",
		options: {
			name: "static/media/[name].[hash:7].[ext]",
		},
	},
	// "url" loader works like "file" loader except that it embeds assets
	// smaller than specified limit in bytes as data URLs to avoid requests.
	// A missing `test` is equivalent to a match.
	{
		test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
		loader: "url-loader",
		options: {
			limit: 10000,
			name: 'static/media/[name].[hash:7].[ext]',
		},
	},
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

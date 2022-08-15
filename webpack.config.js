const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: {
		bundle: "./src/index.ts",
	},
	output: {
		path: `${__dirname}/dist`,
		filename: "index.js",
		assetModuleFilename: '[name][ext][query]'
	},
	mode: "development",
	resolve: {
		extensions: [".ts", ".js"]
	},
	devServer: {
		static: {
			directory: `${__dirname}/dist`
		},
		open: true
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader"
			},
			{
				test: /\.html$/,
				loader: "html-loader"
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader"
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [{
					loader: "file-loader",
					options: {
						name: "assets/[name].[ext]"
					}
				}]				
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		}),
		new MiniCssExtractPlugin({
			filename: "style.css"
		}),
		new CleanWebpackPlugin(),
	],
	stats: {
		children: false
	}
};
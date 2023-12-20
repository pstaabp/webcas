const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = {
	// entry: './src/views/gauss-elim.ts',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
        test: /\.(css)$/,
        use: ['css-loader', 'sass-loader'],
      },
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'@styles': path.join(__dirname, 'src/style'),
		},
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new HtmlBundlerPlugin({
			// path to templates
			entry: 'src/views/',
			js: {
				// output filename for JS
				filename: 'js/[name].[contenthash:8].js',
			},
			css: {
				// output filename for CSS
				filename: 'css/[name].[contenthash:8].css',
			},
		}),
	],
	// enable HMR with live reload
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
};

import pkg from './package.json'
import pluginTypescript from '@rollup/plugin-typescript'

export default {
	input: './src/index.ts',
	output: [
		{
			format: 'cjs',
			file: pkg.main
		},
		{
			format: 'es',
			file: pkg.module
		}
	],
	plugins: [
		pluginTypescript()
	]
}
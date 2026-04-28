import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined, // SPA fallback file (e.g., '200.html' or 'index.html')
			precompress: false, // Generate .gz and .br compressed versions
			strict: true // Fail build if any page can't be prerendered
		})
	}
};

export default config;

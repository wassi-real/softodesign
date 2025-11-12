import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			strict: false
		},
		allowedHosts: [
			'localhost',
			'127.0.0.1',
			'.ngrok-free.app',
			'.ngrok.io'
		]
	},
	optimizeDeps: {
		exclude: ['@supabase/supabase-js']
	},
	ssr: {
		noExternal: []
	}
});

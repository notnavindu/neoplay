import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: host || false,
		port: 5173,
		strictPort: true,
		hmr: host
			? {
					protocol: 'ws',
					host: host,
					port: 5174
				}
			: undefined
	}
});

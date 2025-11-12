import { error, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

// Handle app file requests
export const GET: RequestHandler = async ({ params, url }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw error(500, 'Missing Supabase configuration');
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { slug } = params;
	const filePath = url.searchParams.get('path') || 'index.html';

	if (!slug) {
		throw error(400, 'Missing slug parameter');
	}

	// Get app from database to verify it exists and get storage path
	const { data: app, error: appError } = await supabase
		.from('apps')
		.select('storage_path, entry_url')
		.eq('slug', slug)
		.single();

	if (appError || !app) {
		throw error(404, 'App not found');
	}

	// If app has storage_path, serve from Supabase Storage
	if (app.storage_path) {
		const fullPath = `${app.storage_path}${filePath}`;

		// Get file from Supabase Storage
		const { data: fileData, error: fileError } = await supabase.storage
			.from('softo-apps')
			.download(fullPath);

		if (fileError || !fileData) {
			throw error(404, 'File not found');
		}

		// Determine content type
		let contentType = 'text/plain';
		if (filePath.endsWith('.html')) contentType = 'text/html';
		else if (filePath.endsWith('.css')) contentType = 'text/css';
		else if (filePath.endsWith('.js')) contentType = 'application/javascript';
		else if (filePath.endsWith('.json')) contentType = 'application/json';
		else if (filePath.endsWith('.png')) contentType = 'image/png';
		else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
		else if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';
		else if (filePath.endsWith('.gif')) contentType = 'image/gif';
		else if (filePath.endsWith('.woff') || filePath.endsWith('.woff2')) contentType = 'font/woff2';

		// For HTML files, rewrite relative paths to use our route
		let finalContent = fileData;
		if (filePath.endsWith('.html')) {
			const htmlText = await fileData.text();
			// Rewrite relative paths (not starting with http://, https://, or /)
			const rewrittenHtml = htmlText
				.replace(/href=["']([^"']+\.css)["']/gi, (match, path) => {
					if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
						return match;
					}
					return `href="/apps/${slug}?path=${path}"`;
				})
				.replace(/src=["']([^"']+\.js)["']/gi, (match, path) => {
					if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
						return match;
					}
					return `src="/apps/${slug}?path=${path}"`;
				})
				.replace(/src=["']([^"']+\.(png|jpg|jpeg|svg|gif|webp))["']/gi, (match, path) => {
					if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
						return match;
					}
					return `src="/apps/${slug}?path=${path}"`;
				});
			
			finalContent = new Blob([rewrittenHtml], { type: contentType });
		}

		// Return file with proper headers
		return new Response(finalContent, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000',
				'X-Content-Type-Options': 'nosniff'
			}
		});
	}

	// Fallback to entry_url if no storage_path
	if (app.entry_url) {
		// Redirect to external URL
		return new Response(null, {
			status: 302,
			headers: {
				Location: app.entry_url
			}
		});
	}

	throw error(404, 'App file not found');
};

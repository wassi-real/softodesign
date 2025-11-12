import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { originalUrl, customAlias, title, description } = await request.json();

	if (!originalUrl) {
		throw error(400, 'Original URL is required');
	}

	// Validate URL
	try {
		new URL(originalUrl);
	} catch {
		throw error(400, 'Invalid URL format');
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY) {
		throw error(500, 'Server configuration error');
	}

	const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			persistSession: false
		}
	});

	// Check if custom alias already exists
	if (customAlias) {
		const { data: existing } = await supabase
			.from('url_shortener')
			.select('id')
			.eq('custom_alias', customAlias)
			.maybeSingle();

		if (existing) {
			throw error(400, 'Custom alias already exists');
		}
	}

	// Generate short code
	let shortCode = customAlias;
	if (!shortCode) {
		const { data: codeData, error: codeError } = await supabase.rpc('generate_short_code', {
			length: 6
		});

		if (codeError) {
			// Fallback: generate code manually
			shortCode = Math.random().toString(36).substring(2, 8);
		} else {
			shortCode = codeData;
		}
	}

	// Create shortened URL
	const { data: newUrl, error: insertError } = await supabase
		.from('url_shortener')
		.insert({
			user_id: locals.user.id,
			original_url: originalUrl,
			short_code: shortCode,
			custom_alias: customAlias || null,
			title: title || null,
			description: description || null
		})
		.select()
		.single();

	if (insertError) {
		console.error('Error creating URL:', insertError);
		throw error(500, 'Failed to create shortened URL');
	}

	return json({ success: true, url: newUrl });
};


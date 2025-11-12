import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { id } = await request.json();

	if (!id) {
		throw error(400, 'URL ID is required');
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

	// Verify ownership
	const { data: url, error: fetchError } = await supabase
		.from('url_shortener')
		.select('user_id')
		.eq('id', id)
		.maybeSingle();

	if (fetchError || !url) {
		throw error(404, 'URL not found');
	}

	if (url.user_id !== locals.user.id) {
		throw error(403, 'Unauthorized');
	}

	// Delete the URL (cascade will delete clicks)
	const { error: deleteError } = await supabase.from('url_shortener').delete().eq('id', id);

	if (deleteError) {
		console.error('Error deleting URL:', deleteError);
		throw error(500, 'Failed to delete URL');
	}

	return json({ success: true });
};


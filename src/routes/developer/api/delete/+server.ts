import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

export const DELETE: RequestHandler = async ({ request, cookies, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return json({ error: 'Missing Supabase configuration' }, { status: 500 });
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	const accessToken = cookies.get('sb-access-token');
	if (!accessToken) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: cookies.get('sb-refresh-token') || ''
	});

	const { appId } = await request.json();

	if (!appId) {
		return json({ error: 'App ID is required' }, { status: 400 });
	}

	// Verify the app belongs to the user
	const { data: app, error: fetchError } = await supabase
		.from('apps')
		.select('owner_id')
		.eq('id', appId)
		.single();

	if (fetchError || !app) {
		return json({ error: 'App not found' }, { status: 404 });
	}

	if (app.owner_id !== locals.user.id) {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	// Delete the app (cascade will handle user_apps and app_sales)
	const { error: deleteError } = await supabase.from('apps').delete().eq('id', appId);

	if (deleteError) {
		return json({ error: deleteError.message }, { status: 400 });
	}

	return json({ success: true });
};


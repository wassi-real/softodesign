import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw error(500, 'Missing Supabase configuration');
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	const accessToken = cookies.get('sb-access-token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	// Set the session for this request
	const { error: sessionError } = await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: cookies.get('sb-refresh-token') || ''
	});

	if (sessionError) {
		throw error(401, 'Unauthorized');
	}

	const { slug } = params;

	// Verify user has installed this app
	const { data: userApp, error: userAppError } = await supabase
		.from('user_apps')
		.select(
			`
			id,
			apps (
				id,
				name,
				slug,
				description,
				category,
				logo_url,
				entry_url,
				storage_path,
				price,
				verified
			)
		`
		)
		.eq('user_id', locals.user.id)
		.eq('apps.slug', slug)
		.single();

	if (userAppError || !userApp || !userApp.apps) {
		throw error(404, 'App not found or not installed');
	}

	return {
		user: locals.user,
		app: {
			id: userApp.apps.id,
			name: userApp.apps.name,
			slug: userApp.apps.slug,
			description: userApp.apps.description,
			category: userApp.apps.category,
			logo_url: userApp.apps.logo_url,
			entry_url: userApp.apps.entry_url,
			storage_path: userApp.apps.storage_path,
			price: userApp.apps.price,
			verified: userApp.apps.verified
		}
	};
};


import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

export const POST: RequestHandler = async ({ request, cookies }) => {
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
	const refreshToken = cookies.get('sb-refresh-token');

	if (!accessToken || !refreshToken) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Set session and verify user
	const { error: sessionError } = await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: refreshToken
	});

	let currentUser;
	if (sessionError) {
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser(accessToken);

		if (userError || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
		currentUser = user;
	} else {
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
		currentUser = user;
	}

	const { name, description, category, price, entry_url, logo_url } = await request.json();

	if (!name || !entry_url) {
		return json({ error: 'Name and entry URL are required' }, { status: 400 });
	}

	// Generate slug from name
	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	// Check if slug already exists
	const { data: existingApp } = await supabase
		.from('apps')
		.select('id')
		.eq('slug', slug)
		.single();

	if (existingApp) {
		// Append timestamp to make it unique
		const uniqueSlug = `${slug}-${Date.now()}`;
		const { data: app, error: appError } = await supabase
			.from('apps')
			.insert({
				name,
				slug: uniqueSlug,
				description: description || null,
				category: category || null,
				price: price ? Number(price) : 0,
				entry_url,
				logo_url: logo_url || null,
				owner_id: currentUser.id
			})
			.select()
			.single();

		if (appError) {
			return json({ error: appError.message }, { status: 400 });
		}

		return json({ success: true, app });
	}

	const { data: app, error: appError } = await supabase
		.from('apps')
		.insert({
			name,
			slug,
			description: description || null,
			category: category || null,
			price: price ? Number(price) : 0,
			entry_url,
			logo_url: logo_url || null,
			owner_id: currentUser.id
		})
		.select()
		.single();

	if (appError) {
		return json({ error: appError.message }, { status: 400 });
	}

	return json({ success: true, app });
};


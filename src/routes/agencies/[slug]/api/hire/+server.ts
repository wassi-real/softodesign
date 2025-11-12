import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, cookies }) => {
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
	const refreshToken = cookies.get('sb-refresh-token');

	if (!accessToken || !refreshToken) {
		return json({ error: 'You must be logged in' }, { status: 401 });
	}

	const { error: sessionError } = await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: refreshToken
	});

	if (sessionError) {
		return json({ error: 'Invalid session' }, { status: 401 });
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) {
		return json({ error: 'User not found' }, { status: 401 });
	}

	// Get or create founder profile
	let { data: founder } = await supabase
		.from('founders')
		.select('id')
		.eq('user_id', user.id)
		.single();

	if (!founder) {
		const { data: newFounder, error: createError } = await supabase
			.from('founders')
			.insert({ user_id: user.id })
			.select('id')
			.single();

		if (createError || !newFounder) {
			return json({ error: 'Failed to create founder profile' }, { status: 500 });
		}
		founder = newFounder;
	}

	// Get agency by slug
	const { data: agency } = await supabase
		.from('agencies')
		.select('id')
		.eq('slug', params.slug)
		.single();

	if (!agency) {
		return json({ error: 'Agency not found' }, { status: 404 });
	}

	// Check if already hired
	const { data: existing } = await supabase
		.from('founder_agencies')
		.select('id')
		.eq('founder_id', founder.id)
		.eq('agency_id', agency.id)
		.single();

	if (existing) {
		return json({ error: 'Agency is already in your list' }, { status: 400 });
	}

	// Add to agencies
	const { error: insertError } = await supabase
		.from('founder_agencies')
		.insert({
			founder_id: founder.id,
			agency_id: agency.id
		});

	if (insertError) {
		return json({ error: insertError.message }, { status: 400 });
	}

	return json({ success: true });
};


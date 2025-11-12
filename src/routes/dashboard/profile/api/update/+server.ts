import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
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

	const { founder_name, bio, pfp, social_links } = await request.json();

	// Get or create founder profile
	let { data: founder } = await supabase
		.from('founders')
		.select('id')
		.eq('user_id', user.id)
		.single();

	if (!founder) {
		const { data: newFounder, error: createError } = await supabase
			.from('founders')
			.insert({
				user_id: user.id,
				founder_name: founder_name || null,
				bio: bio || null,
				pfp: pfp || null,
				social_links: social_links || null
			})
			.select('id')
			.single();

		if (createError || !newFounder) {
			return json({ error: 'Failed to create founder profile' }, { status: 500 });
		}
		founder = newFounder;
	}

	// Update founder profile
	const { error: updateError } = await supabase
		.from('founders')
		.update({
			founder_name: founder_name || null,
			bio: bio || null,
			pfp: pfp || null,
			social_links: social_links || null
		})
		.eq('id', founder.id);

	if (updateError) {
		return json({ error: updateError.message }, { status: 400 });
	}

	return json({ success: true });
};

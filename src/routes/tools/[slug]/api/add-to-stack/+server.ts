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

	// Get tool by slug
	const { data: tool } = await supabase
		.from('saas_tools')
		.select('id')
		.eq('slug', params.slug)
		.single();

	if (!tool) {
		return json({ error: 'Tool not found' }, { status: 404 });
	}

	// Check if already in stack
	const { data: existing } = await supabase
		.from('founder_stacks')
		.select('id')
		.eq('founder_id', founder.id)
		.eq('tool_id', tool.id)
		.single();

	if (existing) {
		return json({ error: 'Tool is already in your stack' }, { status: 400 });
	}

	// Add to stack
	const { error: insertError } = await supabase
		.from('founder_stacks')
		.insert({
			founder_id: founder.id,
			tool_id: tool.id
		});

	if (insertError) {
		return json({ error: insertError.message }, { status: 400 });
	}

	return json({ success: true });
};


import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const PUT: RequestHandler = async ({ request, params, cookies }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY) {
		return json({ error: 'Missing Supabase configuration' }, { status: 500 });
	}

	const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
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

	// Get founder profile
	const { data: founder, error: founderError } = await supabase
		.from('founders')
		.select('id')
		.eq('user_id', user.id)
		.single();

	if (founderError || !founder) {
		return json({ error: 'Founder profile not found' }, { status: 403 });
	}

	// Verify ownership
	const { data: existingPost, error: fetchError } = await supabase
		.from('community_posts')
		.select('founder_id')
		.eq('id', params.id)
		.single();

	if (fetchError || !existingPost || existingPost.founder_id !== founder.id) {
		return json({ error: 'Unauthorized to update this post' }, { status: 403 });
	}

	const { title, content } = await request.json();

	if (!title || !content || !title.trim() || !content.trim()) {
		return json({ error: 'Title and content are required' }, { status: 400 });
	}

	const { data: post, error: updateError } = await supabase
		.from('community_posts')
		.update({
			title: title.trim(),
			content: content.trim(),
			updated_at: new Date().toISOString()
		})
		.eq('id', params.id)
		.select('*')
		.single();

	if (updateError) {
		return json({ error: updateError.message }, { status: 400 });
	}

	return json({ success: true, post });
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY) {
		return json({ error: 'Missing Supabase configuration' }, { status: 500 });
	}

	const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
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

	// Get founder profile
	const { data: founder, error: founderError } = await supabase
		.from('founders')
		.select('id')
		.eq('user_id', user.id)
		.single();

	if (founderError || !founder) {
		return json({ error: 'Founder profile not found' }, { status: 403 });
	}

	// Verify ownership
	const { data: existingPost, error: fetchError } = await supabase
		.from('community_posts')
		.select('founder_id')
		.eq('id', params.id)
		.single();

	if (fetchError || !existingPost || existingPost.founder_id !== founder.id) {
		return json({ error: 'Unauthorized to delete this post' }, { status: 403 });
	}

	const { error: deleteError } = await supabase
		.from('community_posts')
		.delete()
		.eq('id', params.id);

	if (deleteError) {
		return json({ error: deleteError.message }, { status: 400 });
	}

	return json({ success: true });
};


import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'You must be logged in' }, { status: 401 });
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY) {
		return json({ error: 'Missing Supabase configuration' }, { status: 500 });
	}

	const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			persistSession: false
		}
	});

	const { toolId } = await request.json();

	if (!toolId) {
		return json({ error: 'Tool ID is required' }, { status: 400 });
	}

	// Get founder profile
	const { data: founder, error: founderError } = await supabase
		.from('founders')
		.select('id')
		.eq('user_id', locals.user.id)
		.single();

	if (founderError || !founder) {
		return json({ error: 'Founder profile not found' }, { status: 404 });
	}

	// Remove from founder_stacks
	const { error: removeError } = await supabase
		.from('founder_stacks')
		.delete()
		.eq('founder_id', founder.id)
		.eq('tool_id', toolId);

	if (removeError) {
		return json({ error: removeError.message }, { status: 400 });
	}

	return json({ success: true });
};


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

	const {
		name,
		description,
		category,
		website_url,
		pricing_tier,
		pricing_url,
		logo_url,
		tags,
		integration_badges,
		screenshots
	} = await request.json();

	if (!name || !description || !website_url) {
		return json({ error: 'Name, description, and website URL are required' }, { status: 400 });
	}

	// Generate slug
	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	let finalSlug = slug;

	const { data: existing } = await supabase
		.from('saas_tools')
		.select('id')
		.eq('slug', slug)
		.maybeSingle();

	if (existing) {
		finalSlug = `${slug}-${Date.now()}`;
	}

	const { data: insertedTool, error: insertError } = await supabase
		.from('saas_tools')
		.insert({
			name,
			slug: finalSlug,
			description,
			category: category || null,
			website_url,
			pricing_tier: pricing_tier || null,
			pricing_url: pricing_url || null,
			logo_url: logo_url || null,
			tags: tags && tags.length > 0 ? tags : null,
			integration_badges: integration_badges && integration_badges.length > 0 ? integration_badges : null,
			screenshots: screenshots && screenshots.length > 0 ? screenshots : null,
			owner_id: user.id
		})
		.select('id, name, slug, description, category, verified, featured, created_at, logo_url, website_url')
		.single();

	if (insertError) {
		return json({ error: insertError.message }, { status: 400 });
	}

	return json({ success: true, tool: insertedTool });
};


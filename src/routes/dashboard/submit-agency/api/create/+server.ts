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
		service_type,
		website_url,
		portfolio_url,
		location,
		logo_url,
		pricing_tiers
	} = await request.json();

	if (!name || !description) {
		return json({ error: 'Name and description are required' }, { status: 400 });
	}

	// Generate slug
	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	// Check if slug exists
	const { data: existing } = await supabase
		.from('agencies')
		.select('id')
		.eq('slug', slug)
		.maybeSingle();

	let finalSlug = slug;

	if (existing) {
		finalSlug = `${slug}-${Date.now()}`;
	}

	const websiteToSave = website_url && website_url.length > 0 ? website_url : `https://softodesign.com/agencies/${finalSlug}`;

	const { data: insertedAgency, error: insertError } = await supabase
		.from('agencies')
		.insert({
			name,
			slug: finalSlug,
			description,
			service_type: service_type || null,
			website_url: websiteToSave,
			portfolio_url: portfolio_url || null,
			location: location || null,
			logo_url: logo_url || null,
			pricing_tiers: pricing_tiers || null,
			owner_id: user.id
		})
		.select('id, name, slug, description, service_type, verified, featured, created_at, logo_url, website_url')
		.single();

	if (insertError) {
		return json({ error: insertError.message }, { status: 400 });
	}

	return json({ success: true, agency: insertedAgency });
};


import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'You must be logged in' }, { status: 401 });
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY) {
		throw error(500, 'Missing Supabase configuration');
	}

	const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			persistSession: false
		}
	});

	const {
		id,
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

	if (!id) {
		return json({ error: 'Tool ID is required' }, { status: 400 });
	}

	if (!name || !website_url) {
		return json({ error: 'Name and website URL are required' }, { status: 400 });
	}

	// Verify ownership
	const { data: existingTool, error: fetchError } = await supabase
		.from('saas_tools')
		.select('owner_id')
		.eq('id', id)
		.single();

	if (fetchError || !existingTool) {
		return json({ error: 'Tool not found' }, { status: 404 });
	}

	if (existingTool.owner_id !== locals.user.id) {
		return json({ error: 'You do not have permission to edit this tool' }, { status: 403 });
	}

	// Update the tool
	const { data: updatedTool, error: updateError } = await supabase
		.from('saas_tools')
		.update({
			name,
			description: description || null,
			category: category || null,
			website_url,
			pricing_tier: pricing_tier || null,
			pricing_url: pricing_url || null,
			logo_url: logo_url || null,
			tags: tags || null,
			integration_badges: integration_badges || null,
			screenshots: screenshots || null,
			updated_at: new Date().toISOString()
		})
		.eq('id', id)
		.select('id, name, slug, description, category, verified, featured, created_at, logo_url, website_url, pricing_tier, tags, integration_badges, screenshots')
		.single();

	if (updateError) {
		return json({ error: updateError.message }, { status: 400 });
	}

	return json({ success: true, tool: updatedTool });
};

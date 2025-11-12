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
		service_type,
		website_url,
		portfolio_url,
		location,
		logo_url,
		pricing_tiers
	} = await request.json();

	if (!id) {
		return json({ error: 'Agency ID is required' }, { status: 400 });
	}

	if (!name || !description) {
		return json({ error: 'Name and description are required' }, { status: 400 });
	}

	// Verify ownership
	const { data: existingAgency, error: fetchError } = await supabase
		.from('agencies')
		.select('owner_id')
		.eq('id', id)
		.single();

	if (fetchError || !existingAgency) {
		return json({ error: 'Agency not found' }, { status: 404 });
	}

	if (existingAgency.owner_id !== locals.user.id) {
		return json({ error: 'You do not have permission to edit this agency' }, { status: 403 });
	}

	// Update the agency
	const { data: updatedAgency, error: updateError } = await supabase
		.from('agencies')
		.update({
			name,
			description,
			service_type: service_type || null,
			website_url: website_url || null,
			portfolio_url: portfolio_url || null,
			location: location || null,
			logo_url: logo_url || null,
			pricing_tiers: pricing_tiers || null,
			updated_at: new Date().toISOString()
		})
		.eq('id', id)
		.select('id, name, slug, description, service_type, verified, featured, created_at, logo_url, website_url')
		.single();

	if (updateError) {
		return json({ error: updateError.message }, { status: 400 });
	}

	return json({ success: true, agency: updatedAgency });
};

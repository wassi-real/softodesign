import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request, params, cookies }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY || !supabaseAnonKey) {
		return json({ error: 'Missing Supabase configuration' }, { status: 500 });
	}

	const supabaseService = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});

	const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});

	const accessToken = cookies.get('sb-access-token');

	if (!accessToken) {
		return json({ error: 'You must be logged in to submit a review' }, { status: 401 });
	}

	const {
		data: { user },
		error: userError
	} = await supabaseAuth.auth.getUser(accessToken);

	if (userError || !user) {
		return json({ error: 'Invalid session' }, { status: 401 });
	}

	const { rating, comment } = await request.json();

	if (!rating || rating < 1 || rating > 5) {
		return json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
	}

	// Get agency by slug
	const { data: agency, error: agencyError } = await supabaseService
		.from('agencies')
		.select('id')
		.eq('slug', params.slug)
		.single();

	if (agencyError || !agency) {
		return json({ error: 'Agency not found' }, { status: 404 });
	}

	// Check if user has already reviewed
	const { data: existingReview } = await supabaseService
		.from('reviews')
		.select('id')
		.eq('listing_type', 'agency')
		.eq('listing_id', agency.id)
		.eq('reviewer_id', user.id)
		.maybeSingle();

	if (existingReview) {
		// Update existing review
		const { data: updatedReview, error: updateError } = await supabaseService
			.from('reviews')
			.update({
				rating,
				comment: comment || null,
				updated_at: new Date().toISOString()
			})
			.eq('id', existingReview.id)
			.select()
			.single();

		if (updateError) {
			return json({ error: updateError.message }, { status: 400 });
		}

		return json({ success: true, review: updatedReview, updated: true });
	}

	// Create new review
	const { data: newReview, error: insertError } = await supabaseService
		.from('reviews')
		.insert({
			reviewer_id: user.id,
			listing_type: 'agency',
			listing_id: agency.id,
			rating,
			comment: comment || null,
			verified_reviewer: false
		})
		.select()
		.single();

	if (insertError) {
		return json({ error: insertError.message }, { status: 400 });
	}

	return json({ success: true, review: newReview, updated: false });
};


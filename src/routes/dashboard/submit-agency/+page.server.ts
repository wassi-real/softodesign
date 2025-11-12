import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.user) {
		throw redirect(302, `/auth?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const serviceRoleKey = SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serviceRoleKey) {
		console.error('Missing Supabase URL or Service Role Key');
		return {
			agencies: []
		};
	}

	// Use service role key to bypass RLS
	const supabase = createClient(supabaseUrl, serviceRoleKey, {
		auth: {
			persistSession: false
		}
	});

	// Fetch user's submitted agencies using service role (bypasses RLS)
	const { data: agencies, error: agenciesError } = await supabase
		.from('agencies')
		.select('id, name, slug, description, service_type, verified, featured, created_at')
		.eq('owner_id', locals.user.id)
		.order('created_at', { ascending: false });

	if (agenciesError) {
		console.error('Agencies query error:', agenciesError);
		return {
			agencies: []
		};
	}

	return {
		agencies: agencies || []
	};
};

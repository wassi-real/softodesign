import type { LayoutServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.user) {
		throw redirect(302, `/auth?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY) {
		return {
			user: locals.user,
			founder: null
		};
	}

	// Use service role key to bypass RLS
	const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			persistSession: false
		}
	});

	// Fetch founder profile
	const { data: founder } = await supabase
		.from('founders')
		.select('*')
		.eq('user_id', locals.user.id)
		.maybeSingle();

	return {
		user: locals.user,
		founder
	};
};


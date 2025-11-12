import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.user) {
		throw redirect(302, `/auth?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return {
			tools: []
		};
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	const accessToken = cookies.get('sb-access-token');
	if (!accessToken) {
		throw redirect(302, `/auth?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: cookies.get('sb-refresh-token') || ''
	});

	// Fetch user's submitted tools
	const { data: tools } = await supabase
		.from('saas_tools')
		.select('id, name, slug, description, category, verified, featured, created_at')
		.eq('owner_id', locals.user.id)
		.order('created_at', { ascending: false });

	return {
		tools: tools || []
	};
};

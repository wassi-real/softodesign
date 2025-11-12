import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.user) {
		throw redirect(302, `/auth?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return {
			user: locals.user,
			stack: [],
			agencies: [],
			payments: []
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

	// Get founder profile
	const { data: founder } = await supabase
		.from('founders')
		.select('id')
		.eq('user_id', locals.user.id)
		.single();

	if (!founder) {
		return {
			user: locals.user,
			stack: [],
			agencies: [],
			payments: []
		};
	}

	// Fetch founder's stack (tools)
	const { data: stackData } = await supabase
		.from('founder_stacks')
		.select(`
			tool_id,
			saas_tools (
				id,
				name,
				slug,
				description,
				logo_url,
				website_url,
				category
			)
		`)
		.eq('founder_id', founder.id);

	const stack = (stackData || [])
		.filter((item: any) => item.saas_tools !== null)
		.map((item: any) => item.saas_tools);

	// Fetch founder's agencies
	const { data: agenciesData } = await supabase
		.from('founder_agencies')
		.select(`
			agency_id,
			agencies (
				id,
				name,
				slug,
				description,
				logo_url,
				website_url,
				service_type
			)
		`)
		.eq('founder_id', founder.id);

	const agencies = (agenciesData || [])
		.filter((item: any) => item.agencies !== null)
		.map((item: any) => item.agencies);

	return {
		user: locals.user,
		stack: stack || [],
		agencies: agencies || []
	};
};


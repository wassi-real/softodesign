import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.user) {
		throw redirect(302, `/auth?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return {
			user: locals.user,
			founder: null,
			stats: {
				toolsSubmitted: 0,
				agenciesSubmitted: 0,
				toolsInStack: 0,
				agenciesHired: 0
			},
			progress: {
				profileComplete: false,
				hasListings: false,
				completionPercentage: 0
			}
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

	// Fetch founder profile
	const { data: founder } = await supabase
		.from('founders')
		.select('*')
		.eq('user_id', locals.user.id)
		.single();

	// Count submitted tools
	const { count: toolsSubmitted } = await supabase
		.from('saas_tools')
		.select('*', { count: 'exact', head: true })
		.eq('owner_id', locals.user.id);

	// Count submitted agencies
	const { count: agenciesSubmitted } = await supabase
		.from('agencies')
		.select('*', { count: 'exact', head: true })
		.eq('owner_id', locals.user.id);

	// Count tools in stack
	let toolsInStack = 0;
	if (founder) {
		const { count } = await supabase
			.from('founder_stacks')
			.select('*', { count: 'exact', head: true })
			.eq('founder_id', founder.id);
		toolsInStack = count || 0;
	}

	// Count agencies hired
	let agenciesHired = 0;
	if (founder) {
		const { count } = await supabase
			.from('founder_agencies')
			.select('*', { count: 'exact', head: true })
			.eq('founder_id', founder.id);
		agenciesHired = count || 0;
	}

	// Calculate progress
	const profileComplete = founder && founder.founder_name && founder.bio && founder.pfp;
	const hasListings = (toolsSubmitted || 0) > 0 || (agenciesSubmitted || 0) > 0; // Combined task

	let completionPercentage = 0;
	if (profileComplete) completionPercentage += 50;
	if (hasListings) completionPercentage += 50;

	return {
		user: locals.user,
		founder,
		stats: {
			toolsSubmitted: toolsSubmitted || 0,
			agenciesSubmitted: agenciesSubmitted || 0,
			toolsInStack: toolsInStack,
			agenciesHired: agenciesHired
		},
		progress: {
			profileComplete,
			hasListings, // Combined task
			completionPercentage
		}
	};
};

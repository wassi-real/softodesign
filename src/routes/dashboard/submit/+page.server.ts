import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.user) {
		throw redirect(302, `/auth?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	let tools: any[] = [];
	let agencies: any[] = [];

	try {
		const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
		const serviceRoleKey = SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !serviceRoleKey) {
			console.error('Missing Supabase URL or Service Role Key');
			return {
				tools: [],
				agencies: []
			};
		}

		// Use service role key to bypass RLS
		const supabase = createClient(supabaseUrl, serviceRoleKey, {
			auth: {
				persistSession: false
			}
		});

		// Fetch user's submitted tools using service role (bypasses RLS)
		const { data: toolsData, error: toolsError } = await supabase
			.from('saas_tools')
			.select('id, name, slug, description, category, verified, featured, created_at')
			.eq('owner_id', locals.user.id)
			.order('created_at', { ascending: false });

		if (toolsError) {
			console.error('Tools query error:', toolsError);
		} else {
			tools = toolsData || [];
		}

		// Fetch user's submitted agencies using service role (bypasses RLS)
		const { data: agenciesData, error: agenciesError } = await supabase
			.from('agencies')
			.select('id, name, slug, description, service_type, verified, featured, created_at')
			.eq('owner_id', locals.user.id)
			.order('created_at', { ascending: false });

		if (agenciesError) {
			console.error('Agencies query error:', agenciesError);
			console.error('Error details:', JSON.stringify(agenciesError, null, 2));
		} else {
			agencies = agenciesData || [];
		}

		console.log('User ID:', locals.user.id);
		console.log('Found agencies:', agencies.length, agencies);
	} catch (error) {
		console.error('Error in submit page load:', error);
	}

	return {
		tools: tools,
		agencies: agencies
	};
};


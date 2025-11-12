import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
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

	// Fetch founder by ID
	const { data: founder, error: founderError } = await supabase
		.from('founders')
		.select('*')
		.eq('id', params.id)
		.single();

	if (founderError || !founder) {
		throw error(404, 'Founder not found');
	}

	// Fetch founder's stack
	const { data: stackData } = await supabase
		.from('founder_stacks')
		.select(`
			saas_tools (
				id,
				name,
				slug,
				logo_url,
				website_url
			)
		`)
		.eq('founder_id', founder.id)
		.limit(10);

	const stack = (stackData || [])
		.filter((item: any) => item.saas_tools !== null)
		.map((item: any) => item.saas_tools);

	// Fetch founder's agencies
	const { data: agenciesData } = await supabase
		.from('founder_agencies')
		.select(`
			agencies (
				id,
				name,
				slug,
				logo_url,
				website_url
			)
		`)
		.eq('founder_id', founder.id)
		.limit(10);

	const agencies = (agenciesData || [])
		.filter((item: any) => item.agencies !== null)
		.map((item: any) => item.agencies);

	return {
		founder,
		stack: stack || [],
		agencies: agencies || []
	};
};


import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const searchQuery = url.searchParams.get('q') || '';

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return {
			tools: [],
			agencies: [],
			founders: [],
			searchQuery
		};
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	let tools: any[] = [];
	let agencies: any[] = [];
	let founders: any[] = [];

	if (searchQuery.trim()) {
		// Search SaaS Tools
		const { data: toolsData } = await supabase
			.from('saas_tools')
			.select('*')
			.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
			.order('softo_score', { ascending: false })
			.limit(20);

		tools = toolsData || [];

		// Search Agencies
		const { data: agenciesData } = await supabase
			.from('agencies')
			.select('*')
			.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,service_type.ilike.%${searchQuery}%`)
			.order('softo_score', { ascending: false })
			.limit(20);

		agencies = agenciesData || [];

		// Search Founders
		const { data: foundersData } = await supabase
			.from('founders')
			.select('*')
			.or(`founder_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
			.order('softo_score', { ascending: false })
			.limit(20);

		founders = foundersData || [];
	}

	return {
		tools,
		agencies,
		founders,
		searchQuery
	};
};

import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ cookies }) => {
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

	// Fetch all SaaS tools, ordered by featured first, then softo_score
	const { data: tools, error } = await supabase
		.from('saas_tools')
		.select('*')
		.order('featured', { ascending: false })
		.order('softo_score', { ascending: false });

	if (error) {
		console.error('Error fetching tools:', error);
		return {
			tools: []
		};
	}

	return {
		tools: tools || []
	};
};


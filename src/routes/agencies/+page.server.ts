import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return {
			agencies: []
		};
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	// Fetch all agencies, ordered by featured first, then softo_score
	const { data: agencies, error } = await supabase
		.from('agencies')
		.select('*')
		.order('featured', { ascending: false })
		.order('softo_score', { ascending: false });

	if (error) {
		console.error('Error fetching agencies:', error);
		return {
			agencies: []
		};
	}

	return {
		agencies: agencies || []
	};
};


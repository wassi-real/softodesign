import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return {
			founders: []
		};
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	// Fetch all founders, ordered by softo_score
	const { data: founders, error } = await supabase
		.from('founders')
		.select('*')
		.order('softo_score', { ascending: false });

	if (error) {
		console.error('Error fetching founders:', error);
		return {
			founders: []
		};
	}

	return {
		founders: founders || []
	};
};


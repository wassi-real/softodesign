import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return {
			apps: [],
			user: null
		};
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	// Check if user is logged in
	let user = null;
	const accessToken = cookies.get('sb-access-token');
	const refreshToken = cookies.get('sb-refresh-token');

	if (accessToken && refreshToken) {
		const { error: sessionError } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});

		if (!sessionError) {
			const {
				data: { user: currentUser }
			} = await supabase.auth.getUser();
			user = currentUser;
		}
	}

	// Fetch all apps from the marketplace
	const { data: apps, error: appsError } = await supabase
		.from('apps')
		.select('*')
		.order('created_at', { ascending: false });

	if (appsError) {
		console.error('Error fetching apps:', appsError);
		return {
			apps: [],
			user
		};
	}

	// If user is logged in, check which apps they've already installed
	let installedAppIds: string[] = [];
	if (user) {
		const { data: userApps } = await supabase
			.from('user_apps')
			.select('app_id')
			.eq('user_id', user.id);

		installedAppIds = (userApps || []).map((ua) => ua.app_id);
	}

	// Add installed status to each app
	const appsWithStatus = (apps || []).map((app) => ({
		...app,
		installed: installedAppIds.includes(app.id)
	}));

	return {
		apps: appsWithStatus,
		user
	};
};


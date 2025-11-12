import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return {
			user: locals.user,
			myApps: [],
			stats: {
				totalApps: 0,
				totalInstalls: 0,
				totalRevenue: 0,
				totalSales: 0
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
		return {
			user: locals.user,
			myApps: [],
			stats: {
				totalApps: 0,
				totalInstalls: 0,
				totalRevenue: 0,
				totalSales: 0
			}
		};
	}

	// Set the session for this request
	const { error: sessionError } = await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: cookies.get('sb-refresh-token') || ''
	});

	if (sessionError) {
		return {
			user: locals.user,
			myApps: [],
			stats: {
				totalApps: 0,
				totalInstalls: 0,
				totalRevenue: 0,
				totalSales: 0
			}
		};
	}

	// Fetch developer's apps
	const { data: myApps, error: appsError } = await supabase
		.from('apps')
		.select('*')
		.eq('owner_id', locals.user.id)
		.order('created_at', { ascending: false });

	if (appsError) {
		console.error('Error fetching apps:', appsError);
	}

	// Fetch install counts for each app
	const appsWithStats = await Promise.all(
		(myApps || []).map(async (app) => {
			const { count: installCount } = await supabase
				.from('user_apps')
				.select('*', { count: 'exact', head: true })
				.eq('app_id', app.id);

			// Fetch revenue for this app
			const { data: sales } = await supabase
				.from('app_sales')
				.select('amount, platform_fee')
				.eq('app_id', app.id);

			const revenue = (sales || []).reduce((sum, sale) => {
				return sum + (Number(sale.amount) * (1 - Number(sale.platform_fee || 0.1)));
			}, 0);

			return {
				...app,
				installs: installCount || 0,
				revenue: revenue.toFixed(2)
			};
		})
	);

	// Calculate total stats
	const totalApps = appsWithStats.length;
	const totalInstalls = appsWithStats.reduce((sum, app) => sum + (app.installs || 0), 0);
	
	// Fetch all sales for revenue calculation
	const { data: allSales } = await supabase
		.from('app_sales')
		.select('amount, platform_fee, app_id')
		.in('app_id', (myApps || []).map((app) => app.id));

	const totalRevenue = (allSales || []).reduce((sum, sale) => {
		return sum + (Number(sale.amount) * (1 - Number(sale.platform_fee || 0.1)));
	}, 0);

	const stats = {
		totalApps,
		totalInstalls,
		totalRevenue: totalRevenue.toFixed(2),
		totalSales: allSales?.length || 0
	};

	return {
		user: locals.user,
		myApps: appsWithStats,
		stats
	};
};


import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY) {
		throw error(500, 'Server configuration error');
	}

	const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			persistSession: false
		}
	});

	// Fetch user's shortened URLs
	const { data: urls, error: urlsError } = await supabase
		.from('url_shortener')
		.select('*')
		.eq('user_id', locals.user.id)
		.order('created_at', { ascending: false });

	if (urlsError) {
		console.error('Error fetching URLs:', urlsError);
	}

	// Fetch analytics for each URL
	const urlIds = urls?.map((url) => url.id) || [];
	let analytics: Record<string, any> = {};

	if (urlIds.length > 0) {
		const { data: clicks } = await supabase
			.from('url_clicks')
			.select('*')
			.in('url_id', urlIds)
			.order('clicked_at', { ascending: false });

		// Group clicks by URL ID
		urlIds.forEach((id) => {
			const urlClicks = clicks?.filter((click) => click.url_id === id) || [];
			analytics[id] = {
				totalClicks: urlClicks.length,
				recentClicks: urlClicks.slice(0, 10), // Last 10 clicks
				clicksByDate: getClicksByDate(urlClicks),
				clicksByCountry: getClicksByCountry(urlClicks),
				clicksByDevice: getClicksByDevice(urlClicks)
			};
		});
	}

	return {
		urls: urls || [],
		analytics
	};
};

function getClicksByDate(clicks: any[]) {
	const byDate: Record<string, number> = {};
	clicks.forEach((click) => {
		const date = new Date(click.clicked_at).toISOString().split('T')[0];
		byDate[date] = (byDate[date] || 0) + 1;
	});
	return byDate;
}

function getClicksByCountry(clicks: any[]) {
	const byCountry: Record<string, number> = {};
	clicks.forEach((click) => {
		const country = click.country || 'Unknown';
		byCountry[country] = (byCountry[country] || 0) + 1;
	});
	return byCountry;
}

function getClicksByDevice(clicks: any[]) {
	const byDevice: Record<string, number> = {};
	clicks.forEach((click) => {
		const device = click.device_type || 'Unknown';
		byDevice[device] = (byDevice[device] || 0) + 1;
	});
	return byDevice;
}


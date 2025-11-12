import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ params, request, getClientAddress }) => {
	const code = params.code;

	if (!code) {
		throw error(404, 'Not found');
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

	// Find the URL by short code or custom alias
	const { data: url, error: fetchError } = await supabase
		.from('url_shortener')
		.select('*')
		.or(`short_code.eq.${code},custom_alias.eq.${code}`)
		.eq('is_active', true)
		.maybeSingle();

	if (fetchError || !url) {
		throw error(404, 'Short URL not found');
	}

	// Check if expired
	if (url.expires_at && new Date(url.expires_at) < new Date()) {
		throw error(410, 'This short URL has expired');
	}

	// Get client info for analytics
	const userAgent = request.headers.get('user-agent') || '';
	const referer = request.headers.get('referer') || '';
	const ip = getClientAddress();

	// Simple device detection
	let deviceType = 'desktop';
	if (/mobile|android|iphone|ipad/i.test(userAgent)) {
		deviceType = 'mobile';
	} else if (/tablet|ipad/i.test(userAgent)) {
		deviceType = 'tablet';
	}

	// Simple browser detection
	let browser = 'Unknown';
	if (userAgent.includes('Chrome')) browser = 'Chrome';
	else if (userAgent.includes('Firefox')) browser = 'Firefox';
	else if (userAgent.includes('Safari')) browser = 'Safari';
	else if (userAgent.includes('Edge')) browser = 'Edge';

	// Simple OS detection
	let os = 'Unknown';
	if (userAgent.includes('Windows')) os = 'Windows';
	else if (userAgent.includes('Mac')) os = 'macOS';
	else if (userAgent.includes('Linux')) os = 'Linux';
	else if (userAgent.includes('Android')) os = 'Android';
	else if (userAgent.includes('iOS')) os = 'iOS';

	// Record the click
	await supabase.from('url_clicks').insert({
		url_id: url.id,
		ip_address: ip,
		user_agent: userAgent,
		referer: referer,
		device_type: deviceType,
		browser: browser,
		os: os
	});

	// Redirect to original URL
	throw redirect(302, url.original_url);
};


import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const { access_token, refresh_token } = await request.json();

	if (!access_token || !refresh_token) {
		return json({ error: 'Missing tokens' }, { status: 400 });
	}

	const isProduction = url.protocol === 'https:';

	// Set cookies with secure flags
	cookies.set('sb-access-token', access_token, {
		path: '/',
		httpOnly: true,
		secure: isProduction,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});

	cookies.set('sb-refresh-token', refresh_token, {
		path: '/',
		httpOnly: true,
		secure: isProduction,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30 // 30 days
	});

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('sb-access-token', { path: '/' });
	cookies.delete('sb-refresh-token', { path: '/' });
	return json({ success: true });
};

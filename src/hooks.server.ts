import { createClient } from '@supabase/supabase-js';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return resolve(event);
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	// Get session from cookies
	const accessToken = event.cookies.get('sb-access-token');
	const refreshToken = event.cookies.get('sb-refresh-token');

	// Protected routes
	const protectedRoutes = ['/dashboard', '/developer', '/preview'];
	const isProtectedRoute = protectedRoutes.some((route) => event.url.pathname.startsWith(route));

	if (isProtectedRoute) {
		if (!accessToken || !refreshToken) {
			throw redirect(302, `/auth?redirectTo=${encodeURIComponent(event.url.pathname)}`);
		}

		// Set session first
		const { error: sessionError } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});

		// If session setting failed, try to verify the token directly
		if (sessionError) {
			const {
				data: { user },
				error: userError
			} = await supabase.auth.getUser(accessToken);

			if (userError || !user) {
				event.cookies.delete('sb-access-token', { path: '/' });
				event.cookies.delete('sb-refresh-token', { path: '/' });
				throw redirect(302, `/auth?redirectTo=${encodeURIComponent(event.url.pathname)}`);
			}

			// Attach user to event.locals
			event.locals.user = {
				id: user.id,
				email: user.email
			};
		} else {
			// Session was set successfully, get the user
			const {
				data: { user },
				error: userError
			} = await supabase.auth.getUser();

			if (userError || !user) {
				event.cookies.delete('sb-access-token', { path: '/' });
				event.cookies.delete('sb-refresh-token', { path: '/' });
				throw redirect(302, `/auth?redirectTo=${encodeURIComponent(event.url.pathname)}`);
			}

			// Attach user to event.locals
			event.locals.user = {
				id: user.id,
				email: user.email
			};
		}
	}

	return resolve(event);
};

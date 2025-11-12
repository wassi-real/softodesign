import { redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return {};
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	// Get session from cookies
	const accessToken = cookies.get('sb-access-token');
	const refreshToken = cookies.get('sb-refresh-token');

	// If user has cookies, check if they're valid
	if (accessToken && refreshToken) {
		// Try to set session
		const { error: sessionError } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});

		if (!sessionError) {
			const {
				data: { user },
				error: userError
			} = await supabase.auth.getUser();

			if (user && !userError) {
				// User is already logged in, redirect to dashboard or intended page
				const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
				throw redirect(302, redirectTo);
			}
		} else {
			// If setSession failed, try direct token verification
			const {
				data: { user },
				error: userError
			} = await supabase.auth.getUser(accessToken);

			if (user && !userError) {
				// Token is valid, redirect
				const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
				throw redirect(302, redirectTo);
			}
		}
	}

	return {};
};


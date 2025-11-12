import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, `/auth?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	return {
		user: locals.user
	};
};

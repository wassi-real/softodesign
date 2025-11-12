import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	// Redirect to stack page with agencies tab
	throw redirect(302, '/dashboard/stack');
};


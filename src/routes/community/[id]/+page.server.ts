import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY) {
		throw error(500, 'Missing Supabase configuration');
	}

	const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			persistSession: false
		}
	});

	// Fetch post with founder info
	const { data: post, error: postError } = await supabase
		.from('community_posts')
		.select(`
			id,
			title,
			content,
			created_at,
			updated_at,
			founder:founders!community_posts_founder_id_fkey (
				id,
				founder_name,
				pfp,
				user_id
			)
		`)
		.eq('id', params.id)
		.single();

	if (postError || !post) {
		throw error(404, 'Post not found');
	}

	// Fetch comments for this post
	const { data: comments, error: commentsError } = await supabase
		.from('community_comments')
		.select(`
			id,
			post_id,
			content,
			created_at,
			updated_at,
			founder:founders!community_comments_founder_id_fkey (
				id,
				founder_name,
				pfp,
				user_id
			)
		`)
		.eq('post_id', params.id)
		.order('created_at', { ascending: true });

	if (commentsError) {
		console.error('Error fetching comments:', commentsError);
	}

	// Get current user's founder profile if logged in
	let founder = null;
	const accessToken = cookies.get('sb-access-token');
	const refreshToken = cookies.get('sb-refresh-token');

	if (accessToken && refreshToken) {
		const supabaseAuth = createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY, {
			auth: {
				persistSession: false
			}
		});

		const { error: sessionError } = await supabaseAuth.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});

		if (!sessionError) {
			const {
				data: { user }
			} = await supabaseAuth.auth.getUser();

			if (user) {
				const { data: founderData } = await supabase
					.from('founders')
					.select('id, founder_name, pfp, user_id')
					.eq('user_id', user.id)
					.maybeSingle();

				founder = founderData;
			}
		}
	} else if (locals.user) {
		// Fallback to locals.user if available
		const { data: founderData } = await supabase
			.from('founders')
			.select('id, founder_name, pfp, user_id')
			.eq('user_id', locals.user.id)
			.maybeSingle();

		founder = founderData;
	}

	return {
		post,
		comments: comments || [],
		founder
	};
};


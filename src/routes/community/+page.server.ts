import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	if (!supabaseUrl || !SUPABASE_SERVICE_ROLE_KEY) {
		return {
			posts: [],
			founder: null
		};
	}

	const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			persistSession: false
		}
	});

	// Fetch all posts with founder info
	const { data: posts, error: postsError } = await supabase
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
		.order('created_at', { ascending: false });

	if (postsError) {
		console.error('Error fetching posts:', postsError);
		return {
			posts: [],
			founder: null
		};
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

	// Get comment counts for each post
	const postIds = posts?.map((p) => p.id) || [];
	let commentCounts: Record<string, number> = {};

	if (postIds.length > 0) {
		const { data: commentsData, error: commentsError } = await supabase
			.from('community_comments')
			.select('post_id')
			.in('post_id', postIds);

		if (!commentsError && commentsData) {
			commentsData.forEach((comment) => {
				commentCounts[comment.post_id] = (commentCounts[comment.post_id] || 0) + 1;
			});
		}
	}

	// Attach comment counts to posts
	const postsWithCounts = (posts || []).map((post) => ({
		...post,
		commentCount: commentCounts[post.id] || 0
	}));

	return {
		posts: postsWithCounts,
		founder
	};
};


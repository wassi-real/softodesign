import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

type ReviewRow = Record<string, any>;

const extractName = (source: unknown): string | null => {
	if (!source || typeof source !== 'object') {
		return null;
	}

	const candidateKeys = ['full_name', 'name', 'display_name'];

	for (const key of candidateKeys) {
		const value = (source as Record<string, unknown>)[key];
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim();
		}
	}

	return null;
};

export const load: PageServerLoad = async ({ params, cookies }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey || !SUPABASE_SERVICE_ROLE_KEY) {
		throw error(500, 'Missing Supabase configuration');
	}

	const supabaseService = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});

	const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});

	// Fetch agency by slug
	const { data: agency, error: agencyError } = await supabaseService
		.from('agencies')
		.select('*')
		.eq('slug', params.slug)
		.single();

	if (agencyError || !agency) {
		throw error(404, 'Agency not found');
	}

	// Check if user is logged in and if agency is in their list
	let hired = false;
	let user = null;
	const accessToken = cookies.get('sb-access-token');

	if (accessToken) {
		const {
			data: { user: currentUser },
			error: userError
		} = await supabaseAuth.auth.getUser(accessToken);

		if (!userError && currentUser) {
			user = currentUser;

			const { data: founder } = await supabaseService
				.from('founders')
				.select('id')
				.eq('user_id', user.id)
				.maybeSingle();

			if (founder) {
				const { data: agencyItem } = await supabaseService
					.from('founder_agencies')
					.select('id')
					.eq('founder_id', founder.id)
					.eq('agency_id', agency.id)
					.maybeSingle();

				hired = Boolean(agencyItem);
			}
		}
	}

	// Fetch reviews
	const {
		data: reviews,
		error: reviewsError
	} = await supabaseService
		.from('reviews')
		.select(`
			id,
			rating,
			comment,
			created_at,
			reviewer_id,
			listing_id,
			listing_type,
			updated_at,
			reviewer:auth.users!reviews_reviewer_id_fkey (
				email
			)
		`)
		.eq('listing_type', 'agency')
		.eq('listing_id', agency.id)
		.order('created_at', { ascending: false })
		.limit(20);

	let resolvedReviews: ReviewRow[] = Array.isArray(reviews) ? (reviews as ReviewRow[]) : [];

	if (reviewsError) {
		console.error('Error fetching agency reviews with join:', reviewsError);

		const { data: fallbackReviews, error: fallbackError } = await supabaseService
			.from('reviews')
			.select('id, rating, comment, created_at, reviewer_id, listing_id, listing_type, updated_at')
			.eq('listing_type', 'agency')
			.eq('listing_id', agency.id)
			.order('created_at', { ascending: false })
			.limit(20);

		if (fallbackError) {
			console.error('Fallback agency reviews query failed:', fallbackError);
		} else {
			resolvedReviews = Array.isArray(fallbackReviews) ? (fallbackReviews as ReviewRow[]) : [];
		}
	}

	const reviewerIds = Array.from(
		new Set(
			resolvedReviews
				.map((review) => review.reviewer_id)
				.filter((id): id is string => typeof id === 'string' && id.length > 0)
		)
	);

	let founderNames = new Map<string, string>();

	if (reviewerIds.length > 0) {
		const { data: foundersData, error: foundersError } = await supabaseService
			.from('founders')
			.select('user_id, founder_name')
			.in('user_id', reviewerIds);

		if (foundersError) {
			console.error('Failed to fetch founder names for agency reviews', foundersError);
		} else if (foundersData) {
			foundersData.forEach((founder) => {
				const userId = typeof founder.user_id === 'string' ? founder.user_id : null;
				if (userId && typeof founder.founder_name === 'string' && founder.founder_name.trim().length > 0) {
					founderNames.set(userId, founder.founder_name.trim());
				}
			});
		}
	}

	const reviewsWithReviewer: ReviewRow[] = await Promise.all(
		resolvedReviews.map(async (reviewRecord) => {
			const review = reviewRecord as ReviewRow;
			const reviewerInfo = (review.reviewer ?? {}) as ReviewRow;
			const reviewerId = typeof review.reviewer_id === 'string' ? review.reviewer_id : null;
			let email = typeof reviewerInfo.email === 'string' ? reviewerInfo.email : null;

			let name =
				(reviewerId ? founderNames.get(reviewerId) : null) ??
				extractName(reviewerInfo.raw_user_meta_data) ??
				extractName(reviewerInfo.user_metadata) ??
				(typeof reviewerInfo.name === 'string' ? (reviewerInfo.name as string) : null);

			if (!name && email) {
				const prefix = email.split('@')[0];
				if (prefix) {
					name = prefix;
				}
			}

			if (name && email) {
				return {
					...review,
					reviewer: { name, email }
				};
			}

			if (!reviewerId) {
				return {
					...review,
					reviewer: {
						name: name ?? 'Anonymous',
						email
					}
				};
			}

			try {
				const { data: reviewerData, error: reviewerFetchError } = await supabaseService.auth.admin.getUserById(reviewerId);

				if (reviewerFetchError || !reviewerData || !reviewerData.user) {
					if (reviewerFetchError) {
						console.error('Failed to fetch agency reviewer user', reviewerFetchError);
					}
					return {
						...review,
						reviewer: {
							name: name ?? 'Anonymous',
							email
						}
					};
				}

				const userRecord = reviewerData.user as unknown as ReviewRow;
				const metaName =
					extractName(userRecord.user_metadata) ??
					extractName(userRecord.app_metadata) ??
					extractName(userRecord.raw_user_meta_data);

				const resolvedEmail = (typeof reviewerData.user.email === 'string' ? reviewerData.user.email : null) ?? email;
				const resolvedName =
					metaName ??
					name ??
					(resolvedEmail ? resolvedEmail.split('@')[0] : null) ??
					'Anonymous';

				return {
					...review,
					reviewer: {
						name: resolvedName,
						email: resolvedEmail ?? null
					}
				};
			} catch (err) {
				console.error('Unexpected error fetching agency reviewer user', err);
				return {
					...review,
					reviewer: {
						name: name ?? 'Anonymous',
						email
					}
				};
			}
		})
	);

	// Check if user has already reviewed
	let userReview = null;
	if (user) {
		const { data: existingReview } = await supabaseService
			.from('reviews')
			.select('*')
			.eq('listing_type', 'agency')
			.eq('listing_id', agency.id)
			.eq('reviewer_id', user.id)
			.maybeSingle();

		userReview = existingReview;
	}

	const avgRating =
		resolvedReviews && resolvedReviews.length > 0
			? resolvedReviews.reduce((sum, r) => sum + ((r as ReviewRow).rating || 0), 0) / resolvedReviews.length
			: 0;

	// Count how many founders have this agency in their stack
	const { count: stackCount } = await supabaseService
		.from('founder_agencies')
		.select('*', { count: 'exact', head: true })
		.eq('agency_id', agency.id);

	return {
		agency,
		hired,
		user,
		reviews: reviewsWithReviewer,
		avgRating: avgRating.toFixed(1),
		userReview,
		stackCount: stackCount || 0
	};
};


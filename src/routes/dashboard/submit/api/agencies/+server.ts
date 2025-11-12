import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

type AgencyRow = {
	id: string;
	name: string;
	slug: string | null;
	description: string | null;
	service_type: string | null;
	verified: boolean | null;
	featured: boolean | null;
	created_at: string | null;
	website_url: string | null;
	logo_url: string | null;
};

export const GET: RequestHandler = async ({ locals }) => {
	console.log('=== AGENCIES API CALLED ===');
	console.log('User:', locals.user);
	
	if (!locals.user) {
		console.log('No user found in locals');
		return json({ agencies: [] }, { status: 401 });
	}

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const serviceRoleKey = SUPABASE_SERVICE_ROLE_KEY;

	console.log('Supabase URL:', supabaseUrl);
	console.log('Service role key exists:', !!serviceRoleKey);

	if (!supabaseUrl || !serviceRoleKey) {
		console.error('Missing Supabase configuration for agencies API');
		return json({ agencies: [] }, { status: 500 });
	}

	const supabase = createClient(supabaseUrl, serviceRoleKey, {
		auth: {
			persistSession: false
		}
	});

	console.log('Fetching agencies for user:', locals.user.id);

	const agenciesOwnedPromise = supabase
		.from('agencies')
		.select('id, name, slug, description, service_type, verified, featured, created_at, website_url, logo_url')
		.eq('owner_id', locals.user.id)
		.order('created_at', { ascending: false });

	const founderPromise = supabase
		.from('founders')
		.select('id')
		.eq('user_id', locals.user.id)
		.maybeSingle();

	const [{ data: owned, error: ownedError }, { data: founder, error: founderError }] = await Promise.all([
		agenciesOwnedPromise,
		founderPromise
	]);

	console.log('Owned agencies:', owned?.length || 0, owned);
	console.log('Owned agencies error:', ownedError);
	console.log('Founder:', founder);
	console.log('Founder error:', founderError);

	if (ownedError) {
		console.error('Failed to fetch owned agencies for submit page:', ownedError);
	}

	if (founderError) {
		console.error('Failed to fetch founder record for submit page:', founderError);
	}

	let founderAgencies: AgencyRow[] = [];

	if (founder?.id) {
		const { data: founderAgenciesData, error: founderAgenciesError } = await supabase
			.from('founder_agencies')
			.select(`
				agencies (
					id,
					name,
					slug,
					description,
					service_type,
					verified,
					featured,
					created_at,
					website_url,
					logo_url
				)
			`)
			.eq('founder_id', founder.id);

		console.log('Founder agencies data:', founderAgenciesData);
		console.log('Founder agencies error:', founderAgenciesError);

		if (founderAgenciesError) {
			console.error('Failed to fetch founder agencies for submit page:', founderAgenciesError);
		} else {
			founderAgencies = (founderAgenciesData || [])
				.flatMap((row: { agencies: AgencyRow[] | null }) => row.agencies ?? []);
		}
	}

	console.log('Founder agencies count:', founderAgencies.length);

	const combinedMap = new Map<string, AgencyRow>();
	for (const agency of founderAgencies) {
		combinedMap.set(agency.id, agency);
	}
	for (const agency of owned || []) {
		combinedMap.set(agency.id, agency as AgencyRow);
	}

	const combined = Array.from(combinedMap.values());

	console.log('Combined agencies count:', combined.length, combined);
	console.log('=== END AGENCIES API ===');

	return json({ agencies: combined });
};
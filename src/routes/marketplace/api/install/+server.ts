import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return json({ error: 'Missing Supabase configuration' }, { status: 500 });
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false
		}
	});

	const accessToken = cookies.get('sb-access-token');
	const refreshToken = cookies.get('sb-refresh-token');

	if (!accessToken || !refreshToken) {
		return json({ error: 'You must be logged in to install apps' }, { status: 401 });
	}

	// Set session and verify user
	const { error: sessionError } = await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: refreshToken
	});

	let currentUser;
	
	if (sessionError) {
		// Try direct token verification
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser(accessToken);

		if (userError || !user) {
			return json({ error: 'You must be logged in to install apps' }, { status: 401 });
		}

		// Use the verified user
		currentUser = user;
	} else {
		// Session was set successfully, get the user
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return json({ error: 'You must be logged in to install apps' }, { status: 401 });
		}

		currentUser = user;
	}

	const { appId } = await request.json();

	if (!appId) {
		return json({ error: 'App ID is required' }, { status: 400 });
	}

	// Check if app exists
	const { data: app, error: appError } = await supabase
		.from('apps')
		.select('id, price')
		.eq('id', appId)
		.single();

	if (appError || !app) {
		return json({ error: 'App not found' }, { status: 404 });
	}

	// Check if already installed
	const { data: existingInstall } = await supabase
		.from('user_apps')
		.select('id')
		.eq('user_id', currentUser.id)
		.eq('app_id', appId)
		.single();

	if (existingInstall) {
		return json({ error: 'App is already installed', alreadyInstalled: true }, { status: 400 });
	}

	// If app is paid, create a sale record (for now, we'll just install free apps)
	// In production, you'd integrate with Stripe or another payment processor here
	if (app.price > 0) {
		// For paid apps, we need payment processing
		// For now, we'll just install it and create a sale record
		// In production, you'd call handle_payment function after payment confirmation
		const { error: saleError } = await supabase.from('app_sales').insert({
			app_id: appId,
			buyer_id: currentUser.id,
			amount: app.price,
			platform_fee: 0.1
		});

		if (saleError) {
			console.error('Sale error:', saleError);
			// Continue with installation even if sale record fails
		}
	}

	// Install the app
	const { error: installError } = await supabase.from('user_apps').insert({
		user_id: currentUser.id,
		app_id: appId
	});

	if (installError) {
		return json({ error: installError.message }, { status: 400 });
	}

	return json({ success: true, message: 'App installed successfully' });
};


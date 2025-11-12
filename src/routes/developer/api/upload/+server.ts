import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import AdmZip from 'adm-zip';

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
		return json({ error: 'You must be logged in to upload apps' }, { status: 401 });
	}

	// Set session and verify user
	const { error: sessionError } = await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: refreshToken
	});

	let currentUser;
	if (sessionError) {
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser(accessToken);

		if (userError || !user) {
			return json({ error: 'You must be logged in to upload apps' }, { status: 401 });
		}
		currentUser = user;
	} else {
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return json({ error: 'You must be logged in to upload apps' }, { status: 401 });
		}
		currentUser = user;
	}

	try {
		const formData = await request.formData();
		const zipFile = formData.get('file') as File;
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const category = formData.get('category') as string;
		const price = formData.get('price') as string;
		const logoUrl = formData.get('logo_url') as string;

		if (!zipFile || !name) {
			return json({ error: 'App name and ZIP file are required' }, { status: 400 });
		}

		// Validate file size (max 20MB)
		const maxSize = 20 * 1024 * 1024; // 20MB
		if (zipFile.size > maxSize) {
			return json({ error: 'File size must be less than 20MB' }, { status: 400 });
		}

		// Read ZIP file
		const arrayBuffer = await zipFile.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const zip = new AdmZip(buffer);
		const zipEntries = zip.getEntries();

		// Check if index.html exists
		const hasIndexHtml = zipEntries.some((entry) => entry.entryName === 'index.html');
		if (!hasIndexHtml) {
			return json({ error: 'ZIP file must contain an index.html file' }, { status: 400 });
		}

		// Generate slug from name
		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');

		// Check if slug already exists
		const { data: existingApp } = await supabase
			.from('apps')
			.select('id')
			.eq('slug', slug)
			.single();

		const finalSlug = existingApp ? `${slug}-${Date.now()}` : slug;
		const storagePath = `${currentUser.id}/${finalSlug}/`;

		// Upload files to Supabase Storage
		// First, ensure the bucket exists (you'll need to create it in Supabase dashboard)
		const bucketName = 'softo-apps';

		// Upload each file from the ZIP
		for (const entry of zipEntries) {
			if (entry.isDirectory) continue;

			const fileData = entry.getData();
			const filePath = `${storagePath}${entry.entryName}`;

			// Determine content type
			let contentType = 'text/plain';
			if (entry.entryName.endsWith('.html')) contentType = 'text/html';
			else if (entry.entryName.endsWith('.css')) contentType = 'text/css';
			else if (entry.entryName.endsWith('.js')) contentType = 'application/javascript';
			else if (entry.entryName.endsWith('.json')) contentType = 'application/json';
			else if (entry.entryName.endsWith('.png')) contentType = 'image/png';
			else if (entry.entryName.endsWith('.jpg') || entry.entryName.endsWith('.jpeg'))
				contentType = 'image/jpeg';
			else if (entry.entryName.endsWith('.svg')) contentType = 'image/svg+xml';

			const { error: uploadError } = await supabase.storage
				.from(bucketName)
				.upload(filePath, fileData, {
					contentType,
					upsert: true
				});

			if (uploadError) {
				console.error(`Error uploading ${entry.entryName}:`, uploadError);
				// Continue with other files
			}
		}

		// Get public URL for index.html
		const {
			data: { publicUrl }
		} = supabase.storage.from(bucketName).getPublicUrl(`${storagePath}index.html`);

		// Insert app metadata into database
		const { data: app, error: appError } = await supabase
			.from('apps')
			.insert({
				name,
				slug: finalSlug,
				description: description || null,
				category: category || null,
				price: price ? Number(price) : 0,
				storage_path: storagePath,
				entry_url: publicUrl, // Keep entry_url for backward compatibility
				logo_url: logoUrl || null,
				owner_id: currentUser.id
			})
			.select()
			.single();

		if (appError) {
			return json({ error: appError.message }, { status: 400 });
		}

		return json({ success: true, app });
	} catch (error: any) {
		console.error('Upload error:', error);
		return json({ error: error.message || 'Failed to upload app' }, { status: 500 });
	}
};


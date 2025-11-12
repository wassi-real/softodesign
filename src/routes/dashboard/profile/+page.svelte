<script lang="ts">
	import type { PageData } from './$types';
	import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { createClient } from '@supabase/supabase-js';

	let { data }: { data: PageData } = $props();
	const currentPath = $derived(page.url.pathname);

	let formData = $state({
		founder_name: data.founder?.founder_name || '',
		bio: data.founder?.bio || '',
		pfp: data.founder?.pfp || '',
		twitter: '',
		linkedin: '',
		github: '',
		website: ''
	});

	let saving = $state(false);
	let error = $state('');
	let success = $state('');
	let uploading = $state(false);
	let fileInput: HTMLInputElement;

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	// Initialize social links from JSONB
	$effect(() => {
		if (data.founder?.social_links) {
			formData.twitter = data.founder.social_links.twitter || '';
			formData.linkedin = data.founder.social_links.linkedin || '';
			formData.github = data.founder.social_links.github || '';
			formData.website = data.founder.social_links.website || '';
		}
	});

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			error = 'Please upload an image file';
			setTimeout(() => (error = ''), 3000);
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			error = 'File size must be less than 5MB';
			setTimeout(() => (error = ''), 3000);
			return;
		}

		uploading = true;
		error = '';

		try {
			if (!supabaseUrl || !supabaseAnonKey) {
				throw new Error('Supabase configuration missing');
			}

			const supabase = createClient(supabaseUrl, supabaseAnonKey);

			// Get user session
			const { data: { session } } = await supabase.auth.getSession();
			if (!session) {
				throw new Error('Not authenticated');
			}

			// Generate unique filename
			const fileExt = file.name.split('.').pop();
			const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
			const filePath = `pfp/${fileName}`;

			// Upload to Supabase storage
			const { error: uploadError } = await supabase.storage
				.from('pfp')
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: false
				});

			if (uploadError) {
				// If bucket doesn't exist, try to create it (this will fail in browser, but shows the error)
				if (uploadError.message.includes('Bucket not found')) {
					throw new Error('Storage bucket "pfp" not found. Please create it in Supabase Storage.');
				}
				throw uploadError;
			}

			// Get public URL
			const { data: urlData } = supabase.storage.from('pfp').getPublicUrl(filePath);
			formData.pfp = urlData.publicUrl;

			success = 'Profile picture uploaded successfully!';
			setTimeout(() => (success = ''), 3000);
		} catch (err: any) {
			error = err.message || 'Failed to upload profile picture';
			setTimeout(() => (error = ''), 5000);
		} finally {
			uploading = false;
		}
	}

	async function handleSubmit() {
		saving = true;
		error = '';
		success = '';

		try {
			// Build social_links object
			const socialLinks: any = {};
			if (formData.twitter) socialLinks.twitter = formData.twitter;
			if (formData.linkedin) socialLinks.linkedin = formData.linkedin;
			if (formData.github) socialLinks.github = formData.github;
			if (formData.website) socialLinks.website = formData.website;

			const response = await fetch('/dashboard/profile/api/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					founder_name: formData.founder_name,
					bio: formData.bio,
					pfp: formData.pfp,
					social_links: Object.keys(socialLinks).length > 0 ? socialLinks : null
				})
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || 'Failed to update profile';
			} else {
				success = 'Profile updated successfully!';
				await invalidateAll();
			}
		} catch (err) {
			error = 'An unexpected error occurred';
		} finally {
			saving = false;
			setTimeout(() => {
				error = '';
				success = '';
			}, 3000);
		}
	}

	function removeProfilePicture() {
		formData.pfp = '';
	}
</script>

<div class="min-h-screen bg-gray-50">
	<DashboardSidebar currentPath={currentPath} />

	<div class="lg:ml-64 pt-16 lg:pt-0">
		<div class="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
			<h2 class="text-2xl font-bold text-black mb-6">My Profile</h2>

			<div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">

			{#if error}
				<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-red-600 text-sm">{error}</p>
				</div>
			{/if}

			{#if success}
				<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
					<p class="text-green-600 text-sm">{success}</p>
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
				<!-- Profile Picture Upload -->
				<div>
					<label for="pfp" class="block text-sm font-medium text-black mb-2">
						Profile Picture
					</label>
					<div class="flex items-center gap-4">
						{#if formData.pfp}
							<div class="relative">
								<img src={formData.pfp} alt="Profile preview" class="w-24 h-24 rounded-full object-cover border-2 border-gray-200" onerror={(e) => e.target.style.display = 'none'} />
								<button
									type="button"
									onclick={removeProfilePicture}
									class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
									aria-label="Remove profile picture"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						{:else}
							<div class="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center border-2 border-gray-200">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							</div>
						{/if}
						<div class="flex-1">
							<input
								type="file"
								bind:this={fileInput}
								accept="image/*"
								onchange={handleFileUpload}
								class="hidden"
								id="pfp-upload"
							/>
							<label
								for="pfp-upload"
								class="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer {uploading ? 'opacity-50 cursor-not-allowed' : ''}"
							>
								{uploading ? 'Uploading...' : formData.pfp ? 'Change Picture' : 'Upload Picture'}
							</label>
							<p class="mt-2 text-xs text-black/60">JPG, PNG or GIF. Max size 5MB</p>
						</div>
					</div>
				</div>

				<!-- Founder Name -->
				<div>
					<label for="founder_name" class="block text-sm font-medium text-black mb-2">
						Founder Name *
					</label>
					<input
						type="text"
						id="founder_name"
						bind:value={formData.founder_name}
						required
						class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
						placeholder="Your name"
					/>
				</div>

				<!-- Bio -->
				<div>
					<label for="bio" class="block text-sm font-medium text-black mb-2">
						Bio
					</label>
					<textarea
						id="bio"
						bind:value={formData.bio}
						rows="6"
						class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
						placeholder="Tell us about yourself..."
					></textarea>
				</div>

				<!-- Social Links -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium text-black">Social Links</h3>
					
					<div>
						<label for="twitter" class="block text-sm font-medium text-black mb-2">
							Twitter/X URL
						</label>
						<input
							type="url"
							id="twitter"
							bind:value={formData.twitter}
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
							placeholder="https://twitter.com/yourhandle"
						/>
					</div>

					<div>
						<label for="linkedin" class="block text-sm font-medium text-black mb-2">
							LinkedIn URL
						</label>
						<input
							type="url"
							id="linkedin"
							bind:value={formData.linkedin}
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
							placeholder="https://linkedin.com/in/yourprofile"
						/>
					</div>

					<div>
						<label for="github" class="block text-sm font-medium text-black mb-2">
							GitHub URL
						</label>
						<input
							type="url"
							id="github"
							bind:value={formData.github}
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
							placeholder="https://github.com/yourhandle"
						/>
					</div>

					<div>
						<label for="website" class="block text-sm font-medium text-black mb-2">
							Personal Website
						</label>
						<input
							type="url"
							id="website"
							bind:value={formData.website}
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
							placeholder="https://yourwebsite.com"
						/>
					</div>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={saving || uploading}
					class="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{saving ? 'Saving...' : 'Save Profile'}
				</button>
			</form>

			{#if data.founder}
				<div class="mt-8 pt-8 border-t border-gray-200">
					<h3 class="text-lg font-bold text-black mb-4">Profile Status</h3>
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							{#if data.founder.verified}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
								<span class="text-black">Verified Founder</span>
							{:else}
								<span class="text-black/60">Not verified</span>
							{/if}
						</div>
						<p class="text-sm text-black/60">
							Your profile is {data.founder.founder_name ? 'published' : 'incomplete'}. Complete your profile to appear in the founder directory.
						</p>
					</div>
				</div>
			{/if}
			</div>
		</div>
	</div>
</div>

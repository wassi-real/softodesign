<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { createClient } from '@supabase/supabase-js';

	let { onClose }: { onClose: () => void } = $props();

	let formData = $state({
		founder_name: '',
		bio: '',
		pfp: '',
		twitter: '',
		linkedin: '',
		github: '',
		website: ''
	});

	let saving = $state(false);
	let error = $state('');
	let uploading = $state(false);
	let fileInput: HTMLInputElement;

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			error = 'Please upload an image file';
			setTimeout(() => (error = ''), 3000);
			return;
		}

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
			const { data: { session } } = await supabase.auth.getSession();
			if (!session) {
				throw new Error('Not authenticated');
			}

			const fileExt = file.name.split('.').pop();
			const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
			const filePath = `pfp/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from('pfp')
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: false
				});

			if (uploadError) {
				if (uploadError.message.includes('Bucket not found')) {
					throw new Error('Storage bucket "pfp" not found. Please create it in Supabase Storage.');
				}
				throw uploadError;
			}

			const { data: urlData } = supabase.storage.from('pfp').getPublicUrl(filePath);
			formData.pfp = urlData.publicUrl;

			setTimeout(() => {}, 3000);
		} catch (err: any) {
			error = err.message || 'Failed to upload profile picture';
			setTimeout(() => (error = ''), 5000);
		} finally {
			uploading = false;
		}
	}

	async function handleSubmit() {
		if (!formData.founder_name.trim()) {
			error = 'Founder name is required';
			setTimeout(() => (error = ''), 3000);
			return;
		}

		saving = true;
		error = '';

		try {
			const socialLinks: any = {};
			if (formData.twitter) socialLinks.twitter = formData.twitter;
			if (formData.linkedin) socialLinks.linkedin = formData.linkedin;
			if (formData.github) socialLinks.github = formData.github;
			if (formData.website) socialLinks.website = formData.website;

			const response = await fetch('/dashboard/profile/api/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					founder_name: formData.founder_name.trim(),
					bio: formData.bio.trim() || null,
					pfp: formData.pfp || null,
					social_links: Object.keys(socialLinks).length > 0 ? socialLinks : null
				})
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || 'Failed to save profile';
			} else {
				await invalidateAll();
				onClose();
			}
		} catch (err) {
			error = 'An unexpected error occurred';
		} finally {
			saving = false;
			setTimeout(() => {
				error = '';
			}, 3000);
		}
	}

	function removeProfilePicture() {
		formData.pfp = '';
	}
</script>

<!-- Modal Overlay -->
<div
	class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
>
	<!-- Modal Content -->
	<div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
		<!-- Header -->
		<div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
			<div>
				<h2 class="text-2xl font-bold text-black">Complete Your Founder Profile</h2>
				<p class="text-sm text-black/60 mt-1">Set up your profile to access the dashboard</p>
			</div>
		</div>

		<!-- Content -->
		<div class="p-6">
			{#if error}
				<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-red-600 text-sm">{error}</p>
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
				<!-- Profile Picture Upload -->
				<div>
					<label for="pfp-modal" class="block text-sm font-medium text-black mb-2">
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
								id="pfp-modal"
							/>
							<label
								for="pfp-modal"
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
					<label for="founder_name-modal" class="block text-sm font-medium text-black mb-2">
						Founder Name *
					</label>
					<input
						type="text"
						id="founder_name-modal"
						bind:value={formData.founder_name}
						required
						class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
						placeholder="Your name"
					/>
				</div>

				<!-- Bio -->
				<div>
					<label for="bio-modal" class="block text-sm font-medium text-black mb-2">
						Bio
					</label>
					<textarea
						id="bio-modal"
						bind:value={formData.bio}
						rows="4"
						class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
						placeholder="Tell us about yourself..."
					></textarea>
				</div>

				<!-- Social Links -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium text-black">Social Links (Optional)</h3>
					
					<div>
						<label for="twitter-modal" class="block text-sm font-medium text-black mb-2">
							Twitter/X URL
						</label>
						<input
							type="url"
							id="twitter-modal"
							bind:value={formData.twitter}
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
							placeholder="https://twitter.com/yourhandle"
						/>
					</div>

					<div>
						<label for="linkedin-modal" class="block text-sm font-medium text-black mb-2">
							LinkedIn URL
						</label>
						<input
							type="url"
							id="linkedin-modal"
							bind:value={formData.linkedin}
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
							placeholder="https://linkedin.com/in/yourprofile"
						/>
					</div>

					<div>
						<label for="github-modal" class="block text-sm font-medium text-black mb-2">
							GitHub URL
						</label>
						<input
							type="url"
							id="github-modal"
							bind:value={formData.github}
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
							placeholder="https://github.com/yourhandle"
						/>
					</div>

					<div>
						<label for="website-modal" class="block text-sm font-medium text-black mb-2">
							Personal Website
						</label>
						<input
							type="url"
							id="website-modal"
							bind:value={formData.website}
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
							placeholder="https://yourwebsite.com"
						/>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="flex gap-3 pt-4">
					<button
						type="submit"
						disabled={saving || uploading || !formData.founder_name.trim()}
						class="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{saving ? 'Saving...' : 'Complete Profile'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>


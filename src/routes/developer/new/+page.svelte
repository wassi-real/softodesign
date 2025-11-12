<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let zipFile = $state<File | null>(null);
	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	const myApps = $derived(data.myApps || []);
	const stats = $derived(data.stats || {
		totalApps: 0,
		totalInstalls: 0,
		totalRevenue: '0.00',
		totalSales: 0
	});

	const categories = [
		{ id: 'productivity', label: 'Productivity' },
		{ id: 'creative', label: 'Creative' },
		{ id: 'developer', label: 'Developer Tools' },
		{ id: 'social', label: 'Social' },
		{ id: 'education', label: 'Education' },
		{ id: 'entertainment', label: 'Entertainment' },
		{ id: 'business', label: 'Business' },
		{ id: 'utility', label: 'Utility' }
	];

	let formData = $state({
		name: '',
		description: '',
		category: 'productivity',
		price: 0,
		logo_url: ''
	});

	async function handleSubmit() {
		error = '';
		success = '';
		loading = true;

		if (!formData.name) {
			error = 'App name is required';
			loading = false;
			return;
		}

		if (!zipFile) {
			error = 'Please select a ZIP file';
			loading = false;
			return;
		}

		try {
			const uploadFormData = new FormData();
			uploadFormData.append('file', zipFile);
			uploadFormData.append('name', formData.name);
			uploadFormData.append('description', formData.description || '');
			uploadFormData.append('category', formData.category);
			uploadFormData.append('price', formData.price.toString());
			uploadFormData.append('logo_url', formData.logo_url || '');

			const response = await fetch('/developer/api/upload', {
				method: 'POST',
				body: uploadFormData
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || 'Failed to create app';
			} else {
				success = 'App created successfully!';
				// Reset form
				formData = {
					name: '',
					description: '',
					category: 'productivity',
					price: 0,
					logo_url: ''
				};
				zipFile = null;
				// Refresh data and redirect
				await invalidateAll();
				setTimeout(() => {
					goto('/developer');
				}, 1500);
			}
		} catch (err) {
			error = 'An unexpected error occurred';
		} finally {
			loading = false;
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			zipFile = target.files[0];
		}
	}
</script>

<div class="min-h-screen bg-white">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h1 class="text-4xl font-bold text-black mb-2">Create New App</h1>
					<p class="text-lg text-black/70">Upload your app as a ZIP file</p>
				</div>
				<a
					href="/developer"
					class="px-4 py-2 rounded-lg bg-gray-100 text-black hover:bg-gray-200 transition-colors font-medium"
				>
					← Back
				</a>
			</div>
		</div>

		<div class="bg-white border border-gray-200 rounded-lg p-6">
			{#if error}
				<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-red-600 text-sm">{error}</p>
				</div>
			{/if}

			{#if success}
				<div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
					<p class="text-green-600 text-sm">{success}</p>
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
				<!-- App Name -->
				<div>
					<label for="name" class="block text-sm font-medium text-black mb-2">
						App Name *
					</label>
					<input
						type="text"
						id="name"
						bind:value={formData.name}
						required
						class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
						placeholder="Enter app name"
					/>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="block text-sm font-medium text-black mb-2">
						Description
					</label>
					<textarea
						id="description"
						bind:value={formData.description}
						rows="4"
						class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
						placeholder="Describe your app..."
					></textarea>
				</div>

				<!-- Category and Price -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="category" class="block text-sm font-medium text-black mb-2">
							Category
						</label>
						<select
							id="category"
							bind:value={formData.category}
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
						>
							{#each categories as cat}
								<option value={cat.id}>{cat.label}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="price" class="block text-sm font-medium text-black mb-2">
							Price ($)
						</label>
						<input
							type="number"
							id="price"
							bind:value={formData.price}
							min="0"
							step="0.01"
							class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
							placeholder="0.00"
						/>
					</div>
				</div>

				<!-- ZIP File Upload -->
				<div>
					<label for="zip_file" class="block text-sm font-medium text-black mb-2">
						App ZIP File *
					</label>
					<input
						type="file"
						id="zip_file"
						accept=".zip"
						onchange={handleFileSelect}
						required
						class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
					/>
					<p class="mt-2 text-sm text-black/60">
						Upload a ZIP file containing your app (index.html, CSS, JS, assets). Max 20MB.
						<br />
						<span class="font-medium">Required files:</span> index.html
					</p>
					{#if zipFile}
						<p class="mt-2 text-sm text-green-600">
							✓ Selected: {zipFile.name} ({(zipFile.size / 1024 / 1024).toFixed(2)} MB)
						</p>
					{/if}
				</div>

				<!-- Logo URL (Optional) -->
				<div>
					<label for="logo_url" class="block text-sm font-medium text-black mb-2">
						Logo URL (Optional)
					</label>
					<input
						type="url"
						id="logo_url"
						bind:value={formData.logo_url}
						class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
						placeholder="https://your-logo-url.com/logo.png"
					/>
					<p class="mt-2 text-sm text-black/60">
						URL to your app's logo image
					</p>
				</div>

				<!-- Submit Button -->
				<div class="flex gap-4">
					<button
						type="submit"
						disabled={loading}
						class="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Publishing...' : 'Publish App'}
					</button>
					<a
						href="/developer"
						class="px-6 py-3 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-colors font-medium"
					>
						Cancel
					</a>
				</div>
			</form>
		</div>
	</div>
</div>


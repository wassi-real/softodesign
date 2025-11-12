<script lang="ts">
	import type { PageData } from './$types';
	import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	const currentPath = $derived(page.url.pathname);

	let showForm = $state(false);
	let formData = $state({
		name: '',
		description: '',
		service_type: 'Design',
		website_url: '',
		portfolio_url: '',
		location: '',
		logo_url: '',
		pricing_tiers: ''
	});

	let submitting = $state(false);
	let error = $state('');
	let success = $state('');

	const agencies = $derived(data.agencies || []);

	const serviceTypes = [
		'Design',
		'Marketing',
		'Development',
		'SEO',
		'Branding',
		'Content',
		'Consulting'
	];

	async function handleSubmit() {
		if (!formData.name || !formData.description || !formData.website_url) {
			error = 'Name, description, and website URL are required';
			return;
		}

		submitting = true;
		error = '';
		success = '';

		try {
			// Parse pricing tiers JSON
			let pricingTiersObj = null;
			if (formData.pricing_tiers.trim()) {
				try {
					pricingTiersObj = JSON.parse(formData.pricing_tiers);
				} catch (e) {
					// If not JSON, try to parse as key-value pairs
					const pairs = formData.pricing_tiers.split(',').map((p) => p.trim());
					pricingTiersObj = {};
					pairs.forEach((pair) => {
						const [key, value] = pair.split(':').map((s) => s.trim());
						if (key && value) {
							pricingTiersObj[key] = value;
						}
					});
				}
			}

			const response = await fetch('/dashboard/submit-agency/api/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					pricing_tiers: pricingTiersObj
				})
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || 'Failed to submit agency';
			} else {
				success = 'Agency submitted successfully!';
				formData = {
					name: '',
					description: '',
					service_type: 'Design',
					website_url: '',
					portfolio_url: '',
					location: '',
					logo_url: '',
					pricing_tiers: ''
				};
				showForm = false;
				await invalidateAll();
			}
		} catch (err) {
			error = 'An unexpected error occurred';
		} finally {
			submitting = false;
			setTimeout(() => {
				error = '';
				success = '';
			}, 5000);
		}
	}

	function toggleForm() {
		showForm = !showForm;
		error = '';
		success = '';
	}
</script>

<div class="min-h-screen bg-gray-50 flex gap-4 p-4">
	<DashboardSidebar currentPath={currentPath} />

	<div class="flex-1 overflow-auto bg-white rounded-2xl shadow-lg p-8">
		<div class="max-w-5xl mx-auto">
			<div class="flex items-center justify-between mb-8">
				<h2 class="text-2xl font-bold text-black">My Submitted Agencies</h2>
				<button
					onclick={toggleForm}
					class="bg-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
				>
					{showForm ? 'Cancel' : '+ Submit New Agency'}
				</button>
			</div>

			{#if success}
				<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
					<p class="text-green-600 text-sm">{success}</p>
				</div>
			{/if}

			<!-- Form -->
			{#if showForm}
				<div class="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
					<h3 class="text-xl font-bold text-black mb-6">Submit an Agency</h3>

					{#if error}
						<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p class="text-red-600 text-sm">{error}</p>
						</div>
					{/if}

					<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
						<!-- Name -->
						<div>
							<label for="name" class="block text-sm font-medium text-black mb-2">
								Agency Name *
							</label>
							<input
								type="text"
								id="name"
								bind:value={formData.name}
								required
								class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
								placeholder="Your agency name"
							/>
						</div>

						<!-- Description -->
						<div>
							<label for="description" class="block text-sm font-medium text-black mb-2">
								Description *
							</label>
							<textarea
								id="description"
								bind:value={formData.description}
								required
								rows="4"
								class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
								placeholder="Describe your agency and services..."
							></textarea>
						</div>

						<!-- Service Type and Location -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label for="service_type" class="block text-sm font-medium text-black mb-2">
									Service Type *
								</label>
								<select
									id="service_type"
									bind:value={formData.service_type}
									required
									class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
								>
									{#each serviceTypes as type}
										<option value={type}>{type}</option>
									{/each}
								</select>
							</div>

							<div>
								<label for="location" class="block text-sm font-medium text-black mb-2">
									Location
								</label>
								<input
									type="text"
									id="location"
									bind:value={formData.location}
									class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
									placeholder="City, Country"
								/>
							</div>
						</div>

						<!-- Website URL -->
						<div>
							<label for="website_url" class="block text-sm font-medium text-black mb-2">
								Website URL *
							</label>
							<input
								type="url"
								id="website_url"
								bind:value={formData.website_url}
								required
								class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
								placeholder="https://your-agency.com"
							/>
						</div>

						<!-- Portfolio URL -->
						<div>
							<label for="portfolio_url" class="block text-sm font-medium text-black mb-2">
								Portfolio URL
							</label>
							<input
								type="url"
								id="portfolio_url"
								bind:value={formData.portfolio_url}
								class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
								placeholder="https://your-agency.com/portfolio"
							/>
						</div>

						<!-- Logo URL -->
						<div>
							<label for="logo_url" class="block text-sm font-medium text-black mb-2">
								Logo URL
							</label>
							<input
								type="url"
								id="logo_url"
								bind:value={formData.logo_url}
								class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
								placeholder="https://your-agency.com/logo.png"
							/>
						</div>

						<!-- Pricing Tiers -->
						<div>
							<label for="pricing_tiers" class="block text-sm font-medium text-black mb-2">
								Pricing Tiers (JSON or comma-separated key:value pairs)
							</label>
							<input
								type="text"
								id="pricing_tiers"
								bind:value={formData.pricing_tiers}
								class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
								placeholder="Starter: $500, Pro: $2000"
							/>
							<p class="mt-2 text-sm text-black/60">
								Example: Starter: $500, Pro: $2000 or use JSON format
							</p>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={submitting}
							class="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? 'Submitting...' : 'Submit Agency'}
						</button>
					</form>
				</div>
			{/if}

			<!-- Agencies List -->
			{#if agencies.length === 0}
				<div class="text-center py-16">
					<p class="text-black/70 text-lg mb-4">You haven't submitted any agencies yet</p>
					<button
						onclick={toggleForm}
						class="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
					>
						Submit Your First Agency
					</button>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each agencies as agency}
						<a
							href="/agencies/{agency.slug}"
							class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
						>
							<div class="flex items-center gap-3 mb-4">
								<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
									<span class="text-xl font-bold text-purple-600">{agency.name?.charAt(0) || 'A'}</span>
								</div>
								<div class="flex-1 min-w-0">
									<h3 class="text-lg font-bold text-black truncate">{agency.name}</h3>
									<div class="flex items-center gap-2 mt-1">
										{#if agency.verified}
											<span class="text-xs text-purple-600 font-medium">✓ Verified</span>
										{/if}
										{#if agency.featured}
											<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>
										{/if}
									</div>
								</div>
							</div>
							<p class="text-black/70 text-sm mb-3 line-clamp-2">{agency.description || 'No description'}</p>
							{#if agency.service_type}
								<span class="text-xs text-black/60 bg-gray-100 px-2 py-1 rounded">{agency.service_type}</span>
							{/if}
							<p class="text-xs text-black/50 mt-3">
								Submitted {new Date(agency.created_at).toLocaleDateString()}
							</p>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

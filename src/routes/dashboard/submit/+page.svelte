<script lang="ts">
	import type { PageData } from './$types';
	import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	const currentPath = $derived(page.url.pathname);

	let activeTab = $state<'tool' | 'agency'>('tool');
	let showForm = $state(false);
	let editMode = $state(false);
	let editingId = $state<string | null>(null);

	// Use derived for reactive data from props - ensure we always have arrays
	const toolList = $derived(Array.isArray(data?.tools) ? data.tools : []);
	let agencyList = $state(Array.isArray(data?.agencies) ? data.agencies : []);
	let agenciesLoading = $state(false);

	// Debug: log agencies data
	$effect(() => {
		console.log('Full data object:', data);
		console.log('Agency list:', agencyList);
		console.log('Agency list length:', agencyList.length);
	});

	$effect(() => {
		agencyList = Array.isArray(data?.agencies) ? data.agencies : [];
	});

	async function refreshAgencies() {
		try {
			console.log('Refreshing agencies...');
			agenciesLoading = true;
			const response = await fetch('/dashboard/submit/api/agencies');
			console.log('Response status:', response.status);
			
			if (response.ok) {
				const result = await response.json();
				console.log('Response JSON:', result);
				
				if (Array.isArray(result.agencies)) {
					agencyList = result.agencies;
					console.log('Updated agency list:', agencyList);
				} else {
					console.error('Result agencies is not an array:', result.agencies);
				}
			} else {
				const errorText = await response.text();
				console.error('Failed to refresh agencies list. Status:', response.status, 'Body:', errorText);
			}
		} catch (err) {
			console.error('Error refreshing agencies list:', err);
		} finally {
			agenciesLoading = false;
		}
	}

	$effect(() => {
		if (!agenciesLoading && agencyList.length === 0) {
			refreshAgencies();
		}
	});

	// Tool form data
	let toolFormData = $state({
		name: '',
		description: '',
		category: 'Marketing',
		website_url: '',
		pricing_tier: 'Free',
		pricing_url: '',
		logo_url: '',
		tags: '',
		integration_badges: '',
		screenshots: ''
	});

	// Agency form data
	let agencyFormData = $state({
		name: '',
		description: '',
		service_type: 'Design',
		website_url: '',
		portfolio_url: '',
		location: '',
		logo_url: '',
		pricing_tiers: ''
	});

	let agencyHasWebsite = $state(true);

	let submitting = $state(false);
	let error = $state('');
	let success = $state('');

	const categories = [
		'Marketing',
		'Finance',
		'Design',
		'Development',
		'Productivity',
		'Sales',
		'Analytics',
		'HR',
		'Customer Support'
	];

	const pricingTiers = ['Free', 'Freemium', 'Paid', 'Enterprise'];
	const serviceTypes = ['Design', 'Marketing', 'Development', 'SEO', 'Branding', 'Content', 'Consulting'];

	async function handleToolSubmit() {
		if (!toolFormData.name || !toolFormData.website_url) {
			error = 'Name and website URL are required';
			return;
		}

		submitting = true;
		error = '';
		success = '';

		try {
			const tagsArray = toolFormData.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
			const badgesArray = toolFormData.integration_badges.split(',').map((b) => b.trim()).filter((b) => b.length > 0);
			const screenshotsArray = toolFormData.screenshots.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

			const url = editMode && editingId 
				? '/dashboard/submit-tool/api/update' 
				: '/dashboard/submit-tool/api/create';

			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...(editMode && editingId ? { id: editingId } : {}),
					...toolFormData,
					tags: tagsArray,
					integration_badges: badgesArray,
					screenshots: screenshotsArray
				})
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || `Failed to ${editMode ? 'update' : 'submit'} tool`;
			} else {
				success = `Tool ${editMode ? 'updated' : 'submitted'} successfully!`;
				toolFormData = {
					name: '',
					description: '',
					category: 'Marketing',
					website_url: '',
					pricing_tier: 'Free',
					pricing_url: '',
					logo_url: '',
					tags: '',
					integration_badges: '',
					screenshots: ''
				};
				showForm = false;
				editMode = false;
				editingId = null;
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

	async function handleAgencySubmit() {
		if (!agencyFormData.name || !agencyFormData.description) {
			error = 'Name and description are required';
			return;
		}

		if (agencyHasWebsite && !agencyFormData.website_url) {
			error = 'Website URL is required unless you choose to create one automatically';
			return;
		}

		submitting = true;
		error = '';
		success = '';

		try {
			const slugifiedName = agencyFormData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || crypto.randomUUID();

			if (!agencyHasWebsite) {
				agencyFormData.website_url = `https://softodesign.com/agencies/${slugifiedName}`;
			}

			let pricingTiersObj: Record<string, string> | null = null;
			if (agencyFormData.pricing_tiers.trim()) {
				try {
					pricingTiersObj = JSON.parse(agencyFormData.pricing_tiers) as Record<string, string>;
				} catch (e) {
					const pairs = agencyFormData.pricing_tiers.split(',').map((p) => p.trim());
					pricingTiersObj = {};
					pairs.forEach((pair) => {
						const [key, value] = pair.split(':').map((s) => s.trim());
						if (key && value) {
							pricingTiersObj![key] = value;
						}
					});
				}
			}

			const url = editMode && editingId 
				? '/dashboard/submit-agency/api/update' 
				: '/dashboard/submit-agency/api/create';
			
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...(editMode && editingId ? { id: editingId } : {}),
					...agencyFormData,
					pricing_tiers: pricingTiersObj
				})
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || `Failed to ${editMode ? 'update' : 'submit'} agency`;
			} else {
				success = `Agency ${editMode ? 'updated' : 'submitted'} successfully!`;
				agencyFormData = {
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
				editMode = false;
				editingId = null;
				agencyHasWebsite = true;
				await invalidateAll();
				await refreshAgencies();
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
		editMode = false;
		editingId = null;
		error = '';
		success = '';
	}

	function editAgency(agency: any) {
		editMode = true;
		editingId = agency.id;
		agencyFormData = {
			name: agency.name || '',
			description: agency.description || '',
			service_type: agency.service_type || 'Design',
			website_url: agency.website_url || '',
			portfolio_url: agency.portfolio_url || '',
			location: agency.location || '',
			logo_url: agency.logo_url || '',
			pricing_tiers: agency.pricing_tiers ? JSON.stringify(agency.pricing_tiers) : ''
		};
		showForm = true;
		error = '';
		success = '';
	}

	function editTool(tool: any) {
		editMode = true;
		editingId = tool.id;
		toolFormData = {
			name: tool.name || '',
			description: tool.description || '',
			category: tool.category || 'Marketing',
			website_url: tool.website_url || '',
			pricing_tier: tool.pricing_tier || 'Free',
			pricing_url: tool.pricing_url || '',
			logo_url: tool.logo_url || '',
			tags: Array.isArray(tool.tags) ? tool.tags.join(', ') : '',
			integration_badges: Array.isArray(tool.integration_badges) ? tool.integration_badges.join(', ') : '',
			screenshots: Array.isArray(tool.screenshots) ? tool.screenshots.join(', ') : ''
		};
		showForm = true;
		error = '';
		success = '';
	}
</script>

<div class="min-h-screen bg-gray-50">
	<DashboardSidebar currentPath={currentPath} />

	<div class="lg:ml-64 pt-16 lg:pt-0">
		<div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
			<!-- Header -->
			<div class="mb-6 sm:mb-8">
				<h2 class="text-2xl sm:text-3xl font-bold text-black mb-2">Submit Listing</h2>
				<p class="text-black/70">Add your SaaS tool or agency to the directory</p>
			</div>

			<!-- Tabs -->
			<div class="mb-6 sm:mb-8">
				<div class="border-b border-gray-200">
					<nav class="flex gap-4 sm:gap-8 -mb-px">
						<button
							onclick={() => { activeTab = 'tool'; showForm = false; error = ''; success = ''; }}
							class="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-colors {activeTab === 'tool'
								? 'border-purple-600 text-purple-600'
								: 'border-transparent text-black/60 hover:text-black hover:border-gray-300'}"
						>
							<span class="flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								SaaS Tools ({toolList.length})
							</span>
						</button>
						<button
							onclick={() => { activeTab = 'agency'; showForm = false; error = ''; success = ''; }}
							class="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-colors {activeTab === 'agency'
								? 'border-purple-600 text-purple-600'
								: 'border-transparent text-black/60 hover:text-black hover:border-gray-300'}"
						>
							<span class="flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
								</svg>
								Agencies ({agencyList.length})
							</span>
						</button>
					</nav>
				</div>
			</div>

			{#if success}
				<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
					<p class="text-green-600 text-sm">{success}</p>
				</div>
			{/if}

			<!-- Tool Tab Content -->
			{#if activeTab === 'tool'}
				<div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-xl sm:text-2xl font-bold text-black">My Submitted Tools</h3>
						<button
							onclick={toggleForm}
							class="bg-purple-600 text-white py-2 px-4 sm:px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm sm:text-base"
						>
							{showForm ? 'Cancel' : '+ Submit New Tool'}
						</button>
					</div>

					{#if showForm}
						<div class="mb-8 p-4 sm:p-6 border border-gray-200 rounded-lg bg-gray-50">
							<h4 class="text-lg sm:text-xl font-bold text-black mb-6">{editMode ? 'Edit SaaS Tool' : 'Submit a SaaS Tool'}</h4>

							{#if error}
								<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
									<p class="text-red-600 text-sm">{error}</p>
								</div>
							{/if}

							<form onsubmit={(e) => { e.preventDefault(); handleToolSubmit(); }} class="space-y-4 sm:space-y-6">
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
									<div>
										<label for="tool-name" class="block text-sm font-medium text-black mb-2">Tool Name *</label>
										<input
											type="text"
											id="tool-name"
											bind:value={toolFormData.name}
											required
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
											placeholder="Your tool name"
										/>
									</div>
									<div>
										<label for="tool-category" class="block text-sm font-medium text-black mb-2">Category *</label>
										<select
											id="tool-category"
											bind:value={toolFormData.category}
											required
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
										>
											{#each categories as cat}
												<option value={cat}>{cat}</option>
											{/each}
										</select>
									</div>
								</div>

								<div>
									<label for="tool-description" class="block text-sm font-medium text-black mb-2">Description *</label>
									<textarea
										id="tool-description"
										bind:value={toolFormData.description}
										required
										rows="4"
										class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
										placeholder="Describe your tool..."
									></textarea>
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
									<div>
										<label for="tool-website" class="block text-sm font-medium text-black mb-2">Website URL *</label>
										<input
											type="url"
											id="tool-website"
											bind:value={toolFormData.website_url}
											required
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
											placeholder="https://your-tool.com"
										/>
									</div>
									<div>
										<label for="tool-pricing-tier" class="block text-sm font-medium text-black mb-2">Pricing Tier</label>
										<select
											id="tool-pricing-tier"
											bind:value={toolFormData.pricing_tier}
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
										>
											{#each pricingTiers as tier}
												<option value={tier}>{tier}</option>
											{/each}
										</select>
									</div>
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
									<div>
										<label for="tool-logo" class="block text-sm font-medium text-black mb-2">Logo URL</label>
										<input
											type="url"
											id="tool-logo"
											bind:value={toolFormData.logo_url}
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
											placeholder="https://your-tool.com/logo.png"
										/>
									</div>
									<div>
										<label for="tool-pricing-url" class="block text-sm font-medium text-black mb-2">Pricing URL</label>
										<input
											type="url"
											id="tool-pricing-url"
											bind:value={toolFormData.pricing_url}
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
											placeholder="https://your-tool.com/pricing"
										/>
									</div>
								</div>

								<div>
									<label for="tool-tags" class="block text-sm font-medium text-black mb-2">Tags (comma-separated)</label>
									<input
										type="text"
										id="tool-tags"
										bind:value={toolFormData.tags}
										class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
										placeholder="tag1, tag2, tag3"
									/>
								</div>

								<button
									type="submit"
									disabled={submitting}
									class="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{submitting ? (editMode ? 'Updating...' : 'Submitting...') : (editMode ? 'Update Tool' : 'Submit Tool')}
								</button>
							</form>
						</div>
					{/if}

					{#if toolList.length === 0}
						<div class="text-center py-12 sm:py-16">
							<p class="text-black/70 text-lg mb-4">You haven't submitted any tools yet</p>
							<button
								onclick={toggleForm}
								class="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
							>
								Submit Your First Tool
							</button>
						</div>
					{:else}
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							{#each toolList as tool}
								<div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow relative">
									<button
										onclick={(e) => { e.stopPropagation(); editTool(tool); }}
										class="absolute top-4 right-4 p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
										title="Edit tool"
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
										</svg>
									</button>
									<a href="/tools/{tool.slug}" class="block">
										<div class="flex items-center gap-3 mb-4">
											<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
												<span class="text-xl font-bold text-purple-600">{tool.name?.charAt(0) || 'T'}</span>
											</div>
											<div class="flex-1 min-w-0 pr-8">
												<h4 class="text-lg font-bold text-black truncate">{tool.name}</h4>
												<div class="flex items-center gap-2 mt-1">
													{#if tool.verified}
														<span class="text-xs text-purple-600 font-medium">✓ Verified</span>
													{/if}
													{#if tool.featured}
														<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>
													{/if}
												</div>
											</div>
										</div>
										<p class="text-black/70 text-sm mb-3 line-clamp-2">{tool.description || 'No description'}</p>
										{#if tool.category}
											<span class="text-xs text-black/60 bg-gray-100 px-2 py-1 rounded">{tool.category}</span>
										{/if}
									</a>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Agency Tab Content -->
			{#if activeTab === 'agency'}
				<div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-xl sm:text-2xl font-bold text-black">My Submitted Agencies</h3>
						<button
							onclick={toggleForm}
							class="bg-purple-600 text-white py-2 px-4 sm:px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm sm:text-base"
						>
							{showForm ? 'Cancel' : '+ Submit New Agency'}
						</button>
					</div>

					{#if showForm}
						<div class="mb-8 p-4 sm:p-6 border border-gray-200 rounded-lg bg-gray-50">
							<h4 class="text-lg sm:text-xl font-bold text-black mb-6">{editMode ? 'Edit Agency' : 'Submit an Agency'}</h4>

							{#if error}
								<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
									<p class="text-red-600 text-sm">{error}</p>
								</div>
							{/if}

							<form onsubmit={(e) => { e.preventDefault(); handleAgencySubmit(); }} class="space-y-4 sm:space-y-6">
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
									<div>
										<label for="agency-name" class="block text-sm font-medium text-black mb-2">Agency Name *</label>
										<input
											type="text"
											id="agency-name"
											bind:value={agencyFormData.name}
											required
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
											placeholder="Your agency name"
										/>
									</div>
									<div>
										<label for="agency-service-type" class="block text-sm font-medium text-black mb-2">Service Type *</label>
										<select
											id="agency-service-type"
											bind:value={agencyFormData.service_type}
											required
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
										>
											{#each serviceTypes as type}
												<option value={type}>{type}</option>
											{/each}
										</select>
									</div>
								</div>

								<div>
									<label for="agency-description" class="block text-sm font-medium text-black mb-2">Description *</label>
									<textarea
										id="agency-description"
										bind:value={agencyFormData.description}
										required
										rows="4"
										class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
										placeholder="Describe your agency and services..."
									></textarea>
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
									<div>
										<label for="agency-website" class="block text-sm font-medium text-black mb-2">Website URL *</label>
										<div class="flex items-center gap-3">
											<input
												type="url"
												id="agency-website"
												bind:value={agencyFormData.website_url}
												required={agencyHasWebsite}
												class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
												placeholder="https://your-agency.com"
												disabled={!agencyHasWebsite}
											/>
											<button
												type="button"
												onclick={() => {
													agencyHasWebsite = !agencyHasWebsite;
													if (!agencyHasWebsite) {
														agencyFormData.website_url = '';
													}
												}}
												class="px-3 py-2 text-sm font-medium rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors"
											>
												{agencyHasWebsite ? 'No website?' : 'Use my own URL'}
											</button>
										</div>
										{#if !agencyHasWebsite}
											<p class="mt-2 text-sm text-black/60">
												No worries — we’ll create an agency page automatically without a website.
											</p>
										{/if}
									</div>
									<div>
										<label for="agency-location" class="block text-sm font-medium text-black mb-2">Location</label>
										<input
											type="text"
											id="agency-location"
											bind:value={agencyFormData.location}
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
											placeholder="City, Country"
										/>
									</div>
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
									<div>
										<label for="agency-portfolio" class="block text-sm font-medium text-black mb-2">Portfolio URL</label>
										<input
											type="url"
											id="agency-portfolio"
											bind:value={agencyFormData.portfolio_url}
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
											placeholder="https://your-agency.com/portfolio"
										/>
									</div>
									<div>
										<label for="agency-logo" class="block text-sm font-medium text-black mb-2">Logo URL</label>
										<input
											type="url"
											id="agency-logo"
											bind:value={agencyFormData.logo_url}
											class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
											placeholder="https://your-agency.com/logo.png"
										/>
									</div>
								</div>

								<div>
									<label for="agency-pricing" class="block text-sm font-medium text-black mb-2">Pricing Tiers</label>
									<input
										type="text"
										id="agency-pricing"
										bind:value={agencyFormData.pricing_tiers}
										class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
										placeholder="Starter: $500, Pro: $2000"
									/>
									<p class="mt-2 text-sm text-black/60">Example: Starter: $500, Pro: $2000 or use JSON format</p>
								</div>

								<button
									type="submit"
									disabled={submitting}
									class="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{submitting ? (editMode ? 'Updating...' : 'Submitting...') : (editMode ? 'Update Agency' : 'Submit Agency')}
								</button>
							</form>
						</div>
					{/if}

					{#if agencyList.length === 0}
						<div class="text-center py-12 sm:py-16">
							<p class="text-black/70 text-lg mb-4">You haven't submitted any agencies yet</p>
							<button
								onclick={toggleForm}
								class="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
							>
								Submit Your First Agency
							</button>
						</div>
					{:else}
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							{#each agencyList as agency}
								<div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow relative">
									<button
										onclick={(e) => { e.stopPropagation(); editAgency(agency); }}
										class="absolute top-4 right-4 p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
										title="Edit agency"
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
										</svg>
									</button>
									<a href="/agencies/{agency.slug}" class="block">
										<div class="flex items-center gap-3 mb-4">
											<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
												<span class="text-xl font-bold text-purple-600">{agency.name?.charAt(0) || 'A'}</span>
											</div>
											<div class="flex-1 min-w-0 pr-8">
												<h4 class="text-lg font-bold text-black truncate">{agency.name}</h4>
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
									</a>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>


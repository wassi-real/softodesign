<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let selectedType = $state('all'); // 'all', 'tools', 'agencies', 'founders'

	const tools = $derived(data.tools || []);
	const agencies = $derived(data.agencies || []);
	const founders = $derived(data.founders || []);

	const categories = [
		{ id: 'all', label: 'All Categories' },
		{ id: 'Marketing', label: 'Marketing' },
		{ id: 'Finance', label: 'Finance' },
		{ id: 'Design', label: 'Design' },
		{ id: 'Development', label: 'Development' },
		{ id: 'Productivity', label: 'Productivity' },
		{ id: 'Sales', label: 'Sales' },
		{ id: 'Analytics', label: 'Analytics' }
	];

	onMount(() => {
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const q = urlParams.get('q');
			if (q) {
				searchQuery = q;
			}
		}
	});

	function handleSearch() {
		if (searchQuery.trim()) {
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSearch();
		}
	}

	function filteredTools() {
		return tools.filter((tool) => {
			const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
			const matchesSearch =
				!searchQuery ||
				tool.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	}

	function filteredAgencies() {
		return agencies.filter((agency) => {
			const matchesCategory = selectedCategory === 'all' || agency.service_type === selectedCategory;
			const matchesSearch =
				!searchQuery ||
				agency.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				agency.description?.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	}

	function filteredFounders() {
		return founders.filter((founder) => {
			const matchesSearch =
				!searchQuery ||
				founder.founder_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				founder.bio?.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesSearch;
		});
	}
</script>

<div class="min-h-screen bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-black mb-2">Search Results</h1>
			{#if searchQuery}
				<p class="text-lg text-black/70">
					Results for "<span class="font-medium">{searchQuery}</span>"
				</p>
			{:else}
				<p class="text-lg text-black/70">Enter a search query to find tools, agencies, and founders</p>
			{/if}
		</div>

		<!-- Search Bar -->
		<div class="mb-8">
			<div class="relative max-w-2xl">
				<input
					type="text"
					placeholder="Search tools, agencies, founders..."
					bind:value={searchQuery}
					onkeydown={handleKeydown}
					class="w-full px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-black placeholder-gray-400 shadow-sm transition-all duration-300 hover:shadow-md"
				/>
				<button
					onclick={handleSearch}
					class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-black hover:text-purple-600 transition-colors p-2 hover:bg-purple-50 rounded-lg"
					aria-label="Search"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 sm:h-6 sm:w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Type Filter -->
		<div class="mb-6 flex flex-wrap gap-2">
			<button
				onclick={() => (selectedType = 'all')}
				class="px-4 py-2 rounded-lg font-medium transition-colors {selectedType === 'all'
					? 'bg-purple-600 text-white'
					: 'bg-gray-100 text-black hover:bg-gray-200'}"
			>
				All
			</button>
			<button
				onclick={() => (selectedType = 'tools')}
				class="px-4 py-2 rounded-lg font-medium transition-colors {selectedType === 'tools'
					? 'bg-purple-600 text-white'
					: 'bg-gray-100 text-black hover:bg-gray-200'}"
			>
				SaaS Tools ({tools.length})
			</button>
			<button
				onclick={() => (selectedType = 'agencies')}
				class="px-4 py-2 rounded-lg font-medium transition-colors {selectedType === 'agencies'
					? 'bg-purple-600 text-white'
					: 'bg-gray-100 text-black hover:bg-gray-200'}"
			>
				Agencies ({agencies.length})
			</button>
			<button
				onclick={() => (selectedType = 'founders')}
				class="px-4 py-2 rounded-lg font-medium transition-colors {selectedType === 'founders'
					? 'bg-purple-600 text-white'
					: 'bg-gray-100 text-black hover:bg-gray-200'}"
			>
				Founders ({founders.length})
			</button>
		</div>

		<!-- Category Filter -->
		{#if selectedType === 'all' || selectedType === 'tools'}
			<div class="mb-6 flex flex-wrap gap-2">
				{#each categories as category}
					<button
						onclick={() => (selectedCategory = category.id)}
						class="px-4 py-2 rounded-lg font-medium transition-colors {selectedCategory === category.id
							? 'bg-purple-600 text-white'
							: 'bg-gray-100 text-black hover:bg-gray-200'}"
					>
						{category.label}
					</button>
				{/each}
			</div>
		{/if}

		<!-- Results -->
		{#if !searchQuery}
			<div class="text-center py-16">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-24 w-24 mx-auto text-gray-300 mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<h2 class="text-2xl font-bold text-black mb-2">Start Searching</h2>
				<p class="text-black/70">Enter a search term above to find tools, agencies, and founders</p>
			</div>
		{:else}
			<!-- SaaS Tools Results -->
			{#if (selectedType === 'all' || selectedType === 'tools') && filteredTools().length > 0}
				<div class="mb-12">
					<h2 class="text-2xl font-bold text-black mb-6">SaaS Tools ({filteredTools().length})</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each filteredTools() as tool}
							<a
								href="/tools/{tool.slug}"
								class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
							>
								<div class="w-16 h-16 bg-purple-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
									{#if tool.logo_url}
										<img src={tool.logo_url} alt={tool.name} class="w-full h-full object-cover rounded-lg" />
									{:else}
										<span class="text-2xl font-bold text-purple-600">{tool.name?.charAt(0) || 'T'}</span>
									{/if}
								</div>
								<div class="flex items-center gap-2 mb-2">
									<h3 class="text-xl font-bold text-black">{tool.name}</h3>
									{#if tool.verified}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-purple-600"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
									{/if}
								</div>
								<p class="text-black/70 text-sm mb-3 line-clamp-2">{tool.description || 'No description available'}</p>
								{#if tool.category}
									<span class="text-xs text-black/60 bg-gray-100 px-2 py-1 rounded">{tool.category}</span>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Agencies Results -->
			{#if (selectedType === 'all' || selectedType === 'agencies') && filteredAgencies().length > 0}
				<div class="mb-12">
					<h2 class="text-2xl font-bold text-black mb-6">Agencies ({filteredAgencies().length})</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each filteredAgencies() as agency}
							<a
								href="/agencies/{agency.slug}"
								class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
							>
								<div class="w-16 h-16 bg-purple-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
									{#if agency.logo_url}
										<img src={agency.logo_url} alt={agency.name} class="w-full h-full object-cover rounded-lg" />
									{:else}
										<span class="text-2xl font-bold text-purple-600">{agency.name?.charAt(0) || 'A'}</span>
									{/if}
								</div>
								<div class="flex items-center gap-2 mb-2">
									<h3 class="text-xl font-bold text-black">{agency.name}</h3>
									{#if agency.verified}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-purple-600"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
									{/if}
								</div>
								<p class="text-black/70 text-sm mb-3 line-clamp-2">{agency.description || 'No description available'}</p>
								{#if agency.service_type}
									<span class="text-xs text-black/60 bg-gray-100 px-2 py-1 rounded">{agency.service_type}</span>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Founders Results -->
			{#if (selectedType === 'all' || selectedType === 'founders') && filteredFounders().length > 0}
				<div class="mb-12">
					<h2 class="text-2xl font-bold text-black mb-6">Founders ({filteredFounders().length})</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each filteredFounders() as founder}
							<a
								href="/founders/{founder.id}"
								class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
							>
								<div class="flex items-center gap-3 mb-4">
									<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
										{#if founder.pfp}
											<img src={founder.pfp} alt={founder.founder_name} class="w-full h-full object-cover" />
										{:else}
											<span class="text-2xl font-bold text-purple-600">{founder.founder_name?.charAt(0) || 'F'}</span>
										{/if}
									</div>
									<div>
										<h3 class="text-xl font-bold text-black">{founder.founder_name || 'Founder'}</h3>
										{#if founder.verified}
											<span class="text-xs text-purple-600 font-medium">✓ Verified</span>
										{/if}
									</div>
								</div>
								<p class="text-black/70 text-sm mb-3 line-clamp-2">{founder.bio || 'No bio available'}</p>
								{#if founder.social_links?.twitter || founder.social_links?.linkedin}
									<div class="flex items-center gap-2 mt-2">
										{#if founder.social_links?.twitter}
											<span class="text-xs text-black/60">🐦</span>
										{/if}
										{#if founder.social_links?.linkedin}
											<span class="text-xs text-black/60">💼</span>
										{/if}
									</div>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{/if}

			<!-- No Results -->
			{#if filteredTools().length === 0 && filteredAgencies().length === 0 && filteredFounders().length === 0}
				<div class="text-center py-16">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-24 w-24 mx-auto text-gray-300 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h2 class="text-2xl font-bold text-black mb-2">No results found</h2>
					<p class="text-black/70 mb-6">Try adjusting your search terms or browse the directories</p>
					<div class="flex gap-4 justify-center">
						<a
							href="/tools"
							class="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
						>
							Browse Tools
						</a>
						<a
							href="/agencies"
							class="inline-block bg-gray-100 text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
						>
							Browse Agencies
						</a>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

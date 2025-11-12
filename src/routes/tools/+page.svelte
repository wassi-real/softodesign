<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedCategory = $state('all');

	const tools = $derived(data.tools || []);

	const categories = [
		{ id: 'all', label: 'All Categories' },
		{ id: 'Marketing', label: 'Marketing' },
		{ id: 'Finance', label: 'Finance' },
		{ id: 'Design', label: 'Design' },
		{ id: 'Development', label: 'Development' },
		{ id: 'Productivity', label: 'Productivity' },
		{ id: 'Sales', label: 'Sales' },
		{ id: 'Analytics', label: 'Analytics' },
		{ id: 'HR', label: 'HR' },
		{ id: 'Customer Support', label: 'Customer Support' }
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
</script>

<div class="min-h-screen bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-black mb-2">SaaS Tools Directory</h1>
			<p class="text-lg text-black/70">Discover tools to power your business</p>
		</div>

		<!-- Search and Filters -->
		<div class="mb-8 space-y-4">
			<!-- Search Bar -->
			<div class="relative max-w-md">
				<input
					type="text"
					placeholder="Search tools..."
					bind:value={searchQuery}
					onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black placeholder-gray-400"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
			</div>

			<!-- Category Filters -->
			<div class="flex flex-wrap gap-2">
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
		</div>

		<!-- Tools Grid -->
		{#if filteredTools().length === 0}
			<div class="text-center py-16">
				<p class="text-black/70 text-lg">No tools found. Try adjusting your search or filters.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredTools() as tool}
					<a
						href="/tools/{tool.slug}"
						class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
					>
						<!-- Tool Logo -->
						<div class="w-16 h-16 bg-purple-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
							{#if tool.logo_url}
								<img src={tool.logo_url} alt={tool.name} class="w-full h-full object-cover rounded-lg" />
							{:else}
								<span class="text-2xl font-bold text-purple-600">{tool.name?.charAt(0) || 'T'}</span>
							{/if}
						</div>

						<!-- Tool Info -->
						<div class="mb-4">
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
								{#if tool.featured}
									<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>
								{/if}
							</div>
							<p class="text-black/70 text-sm mb-2 line-clamp-2">{tool.description || 'No description available'}</p>
							<div class="flex items-center justify-between">
								{#if tool.category}
									<span class="text-xs text-black/60 bg-gray-100 px-2 py-1 rounded">{tool.category}</span>
								{/if}
								{#if tool.pricing_tier}
									<span class="text-xs text-black/60">{tool.pricing_tier}</span>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>


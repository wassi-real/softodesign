<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');

	const founders = $derived(data.founders || []);

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
			<h1 class="text-4xl font-bold text-black mb-2">Founder Directory</h1>
			<p class="text-lg text-black/70">Connect with founders and discover their journey</p>
		</div>

		<!-- Search -->
		<div class="mb-8">
			<div class="relative max-w-md">
				<input
					type="text"
					placeholder="Search founders..."
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
		</div>

		<!-- Founders Grid -->
		{#if filteredFounders().length === 0}
			<div class="text-center py-16">
				<p class="text-black/70 text-lg">No founders found. Try adjusting your search.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredFounders() as founder}
					<a
						href="/founders/{founder.id}"
						class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
					>
						<!-- Founder Info -->
						<div class="flex items-center gap-4 mb-4">
							<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
								{#if founder.pfp}
									<img src={founder.pfp} alt={founder.founder_name} class="w-full h-full object-cover" />
								{:else}
									<span class="text-2xl font-bold text-purple-600">{founder.founder_name?.charAt(0) || 'F'}</span>
								{/if}
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									<h3 class="text-xl font-bold text-black truncate">{founder.founder_name || 'Founder'}</h3>
									{#if founder.verified}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-purple-600 flex-shrink-0"
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
								{#if founder.social_links?.twitter || founder.social_links?.linkedin}
									<div class="flex items-center gap-2">
										{#if founder.social_links?.twitter}
											<span class="text-xs text-black/60">🐦 Twitter</span>
										{/if}
										{#if founder.social_links?.linkedin}
											<span class="text-xs text-black/60">💼 LinkedIn</span>
										{/if}
									</div>
								{/if}
							</div>
						</div>
						<p class="text-black/70 text-sm line-clamp-3">{founder.bio || 'No bio available'}</p>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

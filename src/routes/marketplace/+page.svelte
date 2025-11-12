<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let installing = $state<string | null>(null);
	let error = $state('');
	let success = $state('');

	const apps = $derived(data.apps || []);
	const user = $derived(data.user);

	const categories = [
		{ id: 'all', label: 'All Apps' },
		{ id: 'productivity', label: 'Productivity' },
		{ id: 'creative', label: 'Creative' },
		{ id: 'developer', label: 'Developer Tools' },
		{ id: 'social', label: 'Social' },
		{ id: 'education', label: 'Education' },
		{ id: 'entertainment', label: 'Entertainment' },
		{ id: 'business', label: 'Business' },
		{ id: 'utility', label: 'Utility' }
	];

	// Initialize search query from URL params
	onMount(() => {
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const q = urlParams.get('q');
			if (q) {
				searchQuery = q;
			}
		}
	});

	function filteredApps() {
		return apps.filter((app) => {
			const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
			const matchesSearch =
				!searchQuery ||
				app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				app.description?.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	}

	async function handleInstall(appId: string) {
		if (!user) {
			// Redirect to auth page if not logged in
			goto(`/auth?redirectTo=${encodeURIComponent('/marketplace')}`);
			return;
		}

		error = '';
		success = '';
		installing = appId;

		try {
			const response = await fetch('/marketplace/api/install', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ appId })
			});

			const result = await response.json();

			if (!response.ok) {
				if (result.alreadyInstalled) {
					success = 'App is already installed!';
				} else {
					error = result.error || 'Failed to install app';
				}
			} else {
				success = 'App installed successfully!';
				// Refresh data to update installed status
				await invalidateAll();
			}
		} catch (err) {
			error = 'An unexpected error occurred';
		} finally {
			installing = null;
			// Clear messages after 3 seconds
			setTimeout(() => {
				error = '';
				success = '';
			}, 3000);
		}
	}
</script>

<div class="min-h-screen bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-black mb-2">Marketplace</h1>
			<p class="text-lg text-black/70">Discover and install apps for your web OS</p>
		</div>

		<!-- Messages -->
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

		<!-- Search and Filters -->
		<div class="mb-8 space-y-4">
			<!-- Search Bar -->
			<div class="relative max-w-md">
				<input
					type="text"
					placeholder="Search apps..."
					bind:value={searchQuery}
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

		<!-- Apps Grid -->
		{#if filteredApps().length === 0}
			<div class="text-center py-12">
				<p class="text-black/70 text-lg">No apps found. Try adjusting your search or filters.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredApps() as app}
					<div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
						<!-- App Logo -->
						<div class="w-16 h-16 bg-purple-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
							{#if app.logo_url}
								<img src={app.logo_url} alt={app.name} class="w-full h-full object-cover rounded-lg" />
							{:else}
								<span class="text-2xl font-bold text-purple-600">{app.name?.charAt(0) || 'A'}</span>
							{/if}
						</div>

						<!-- App Info -->
						<div class="mb-4">
							<div class="flex items-center gap-2 mb-2">
								<h3 class="text-xl font-bold text-black">{app.name}</h3>
								{#if app.verified}
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
							<p class="text-black/70 text-sm mb-2">{app.description || 'No description available'}</p>
							<div class="flex items-center justify-between">
								<p class="text-lg font-bold text-purple-600">
									{app.price === 0 || !app.price ? 'Free' : `$${Number(app.price).toFixed(2)}`}
								</p>
								{#if app.category}
									<span class="text-xs text-black/60 bg-gray-100 px-2 py-1 rounded">
										{app.category}
									</span>
								{/if}
							</div>
						</div>

						<!-- Install Button -->
						<button
							onclick={() => handleInstall(app.id)}
							disabled={installing === app.id || app.installed}
							class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {app.installed
								? 'bg-green-600 hover:bg-green-700'
								: ''}"
						>
							{#if installing === app.id}
								Installing...
							{:else if app.installed}
								Installed ✓
							{:else if app.price === 0 || !app.price}
								Install
							{:else}
								Buy & Install
							{/if}
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>


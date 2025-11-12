<script lang="ts">
	import type { PageData } from './$types';
	import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { data }: { data: PageData } = $props();
	const currentPath = $derived(page.url.pathname);

	let removing = $state<string | null>(null);

	async function removeAgency(agencyId: string) {
		removing = agencyId;

		try {
			const response = await fetch('/dashboard/agencies/api/remove', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ agencyId })
			});

			const result = await response.json();

			if (!response.ok) {
				toast.error(result.error || 'Failed to remove agency from stack');
			} else {
				toast.success('Agency removed from your stack');
				await invalidateAll();
			}
		} catch (err) {
			toast.error('An unexpected error occurred');
		} finally {
			removing = null;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<DashboardSidebar currentPath={currentPath} />

	<div class="lg:ml-64 pt-16 lg:pt-0">
		<div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
			<h2 class="text-2xl sm:text-3xl font-bold text-black mb-6">My Agencies</h2>

			{#if data.agencies && data.agencies.length > 0}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{#each data.agencies as agency}
						<div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover-lift transition-all duration-300 relative animate-slide-up">
							<button
								onclick={(e) => { e.stopPropagation(); removeAgency(agency.id); }}
								disabled={removing === agency.id}
								class="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
								title="Remove from stack"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
								</svg>
							</button>
							<a href="/agencies/{agency.slug || agency.id}" class="block pr-8">
								<div class="w-16 h-16 bg-purple-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
									{#if agency.logo_url}
										<img src={agency.logo_url} alt={agency.name} class="w-full h-full object-cover rounded-lg" />
									{:else}
										<span class="text-2xl font-bold text-purple-600">{agency.name?.charAt(0) || 'A'}</span>
									{/if}
								</div>
								<h3 class="text-lg font-bold text-black mb-2">{agency.name}</h3>
								<p class="text-sm text-black/70 line-clamp-2 mb-3">{agency.description || 'No description'}</p>
								{#if agency.service_type}
									<span class="text-xs text-black/60 bg-gray-100 px-2 py-1 rounded">{agency.service_type}</span>
								{/if}
							</a>
						</div>
					{/each}
				</div>
			{:else}
				<div class="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center">
					<p class="text-black/70 text-lg mb-4">You haven't added any agencies to your stack yet</p>
					<a href="/agencies" class="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors">
						Browse Agencies
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import type { PageData } from './$types';
	import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { data }: { data: PageData } = $props();
	const currentPath = $derived(page.url.pathname);

	let activeTab = $state<'tools' | 'agencies'>('tools');
	let removing = $state<string | null>(null);

	async function removeFromStack(toolId: string) {
		removing = toolId;

		try {
			const response = await fetch('/dashboard/stack/api/remove-tool', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ toolId })
			});

			const result = await response.json();

			if (!response.ok) {
				toast.error(result.error || 'Failed to remove tool from stack');
			} else {
				toast.success('Tool removed from your stack');
				await invalidateAll();
			}
		} catch (err) {
			toast.error('An unexpected error occurred');
		} finally {
			removing = null;
		}
	}

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
			<h2 class="text-2xl sm:text-3xl font-bold text-black mb-6">My Stack</h2>

			<!-- Tabs -->
			<div class="mb-6">
				<div class="border-b border-gray-200">
					<nav class="flex gap-4 sm:gap-8 -mb-px">
						<button
							onclick={() => { activeTab = 'tools'; }}
							class="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-all duration-200 {activeTab === 'tools'
								? 'border-purple-600 text-purple-600'
								: 'border-transparent text-black/60 hover:text-black hover:border-gray-300'}"
						>
							<span class="flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								Tools ({data.stack?.length || 0})
							</span>
						</button>
						<button
							onclick={() => { activeTab = 'agencies'; }}
							class="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-all duration-200 {activeTab === 'agencies'
								? 'border-purple-600 text-purple-600'
								: 'border-transparent text-black/60 hover:text-black hover:border-gray-300'}"
						>
							<span class="flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
								</svg>
								Agencies ({data.agencies?.length || 0})
							</span>
						</button>
					</nav>
				</div>
			</div>

			<!-- Tools Tab -->
			{#if activeTab === 'tools'}
				{#if data.stack && data.stack.length > 0}
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						{#each data.stack as tool}
							<div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover-lift transition-all duration-300 relative animate-slide-up">
								<button
									onclick={(e) => { e.stopPropagation(); removeFromStack(tool.id); }}
									disabled={removing === tool.id}
									class="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
									title="Remove from stack"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
									</svg>
								</button>
								<a href="/tools/{tool.slug || tool.id}" class="block pr-8">
									<div class="w-16 h-16 bg-purple-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
										{#if tool.logo_url}
											<img src={tool.logo_url} alt={tool.name} class="w-full h-full object-cover rounded-lg" />
										{:else}
											<span class="text-2xl font-bold text-purple-600">{tool.name?.charAt(0) || 'T'}</span>
										{/if}
									</div>
									<h3 class="text-lg font-bold text-black mb-2">{tool.name}</h3>
									<p class="text-sm text-black/70 line-clamp-2 mb-3">{tool.description || 'No description'}</p>
									{#if tool.category}
										<span class="text-xs text-black/60 bg-gray-100 px-2 py-1 rounded">{tool.category}</span>
									{/if}
								</a>
							</div>
						{/each}
					</div>
				{:else}
					<div class="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center">
						<p class="text-black/70 text-lg mb-4">Your tools stack is empty</p>
						<a href="/tools" class="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors">
							Browse Tools
						</a>
					</div>
				{/if}
			{/if}

			<!-- Agencies Tab -->
			{#if activeTab === 'agencies'}
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
						<p class="text-black/70 text-lg mb-4">Your agencies stack is empty</p>
						<a href="/agencies" class="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors">
							Browse Agencies
						</a>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

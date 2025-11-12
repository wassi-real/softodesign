<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { data }: { data: PageData } = $props();

	const myApps = $derived(data.myApps || []);
	const stats = $derived(data.stats || {
		totalApps: 0,
		totalInstalls: 0,
		totalRevenue: '0.00',
		totalSales: 0
	});

	async function deleteApp(appId: string) {
		try {
			const response = await fetch(`/developer/api/delete`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ appId })
			});

			if (response.ok) {
				toast.success('App deleted successfully!');
				await invalidateAll();
			} else {
				const result = await response.json();
				toast.error(result.error || 'Failed to delete app');
			}
		} catch (err) {
			toast.error('An unexpected error occurred');
		}
	}
</script>

<div class="min-h-screen bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-4xl font-bold text-black mb-2">Developer Console</h1>
				<p class="text-lg text-black/70">Manage your apps and track analytics</p>
			</div>
			<a
				href="/developer/new"
				class="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
			>
				+ Create New App
			</a>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-8">
				<!-- My Apps -->
				<div class="bg-white border border-gray-200 rounded-lg p-6">
					<h2 class="text-2xl font-bold text-black mb-6">My Apps</h2>

					{#if myApps.length === 0}
						<div class="text-center py-12">
							<div class="mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-24 w-24 mx-auto text-gray-300"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="1"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
									/>
								</svg>
							</div>
							<p class="text-black/70 mb-4 text-lg">You haven't published any apps yet.</p>
							<a
								href="/developer/new"
								class="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
							>
								Create Your First App
							</a>
						</div>
					{:else}
						<div class="space-y-4">
							{#each myApps as app}
								<div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
									<div class="flex items-start justify-between">
										<div class="flex-1">
											<div class="flex items-center gap-3 mb-3">
												{#if app.logo_url}
													<img src={app.logo_url} alt={app.name} class="w-12 h-12 rounded-lg object-cover" />
												{:else}
													<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
														<span class="text-xl font-bold text-purple-600">{app.name.charAt(0)}</span>
													</div>
												{/if}
												<div class="flex-1">
													<div class="flex items-center gap-2 mb-1">
														<h3 class="text-lg font-bold text-black">{app.name}</h3>
														{#if app.verified}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-4 w-4 text-purple-600"
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
													<p class="text-black/70 text-sm mb-3">{app.description || 'No description'}</p>
													<div class="flex items-center gap-6 text-sm">
														<div class="flex items-center gap-2">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-4 w-4 text-black/60"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																stroke-width="2"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
																/>
															</svg>
															<span class="text-black/60">
																<strong class="text-black">{app.installs || 0}</strong> installs
															</span>
														</div>
														<div class="flex items-center gap-2">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-4 w-4 text-purple-600"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																stroke-width="2"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
															<span class="text-purple-600 font-bold">
																${app.revenue || '0.00'} revenue
															</span>
														</div>
														{#if app.price > 0}
															<span class="text-black/60">${app.price}</span>
														{:else}
															<span class="text-green-600 font-medium">Free</span>
														{/if}
													</div>
												</div>
											</div>
										</div>
										<button
											onclick={() => deleteApp(app.id)}
											class="text-red-600 hover:text-red-700 font-medium text-sm ml-4 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
										>
											Delete
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Sidebar - Earnings Summary -->
			<div class="lg:col-span-1">
				<div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
					<h2 class="text-2xl font-bold text-black mb-6">Earnings Summary</h2>

					<div class="space-y-6">
						<!-- Total Revenue -->
						<div>
							<p class="text-sm text-black/60 mb-1">Total Revenue</p>
							<p class="text-3xl font-bold text-purple-600">${stats.totalRevenue}</p>
						</div>

						<!-- Total Apps -->
						<div>
							<p class="text-sm text-black/60 mb-1">Total Apps</p>
							<p class="text-3xl font-bold text-black">{stats.totalApps}</p>
						</div>

						<!-- Total Installs -->
						<div>
							<p class="text-sm text-black/60 mb-1">Total Installs</p>
							<p class="text-3xl font-bold text-black">{stats.totalInstalls}</p>
						</div>

						<!-- Total Sales -->
						<div>
							<p class="text-sm text-black/60 mb-1">Total Sales</p>
							<p class="text-2xl font-bold text-black">{stats.totalSales}</p>
						</div>

						<div class="pt-4 border-t border-gray-200">
							<p class="text-xs text-black/60">
								Platform fee: 10%<br />
								You receive: 90% of sales
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

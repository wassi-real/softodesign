<script lang="ts">
	import type { PageData } from './$types';
	import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { data }: { data: PageData } = $props();
	const currentPath = $derived(page.url.pathname);

	let originalUrl = $state('');
	let customAlias = $state('');
	let title = $state('');
	let description = $state('');
	let creating = $state(false);
	let showCreateModal = $state(false);
	let selectedUrl = $state<any>(null);
	let showAnalytics = $state(false);

	const urls = $derived(data.urls || []);
	const analytics = $derived(data.analytics || {});

	const baseUrl = $derived(typeof window !== 'undefined' ? window.location.origin : '');

	function openCreateModal() {
		showCreateModal = true;
		originalUrl = '';
		customAlias = '';
		title = '';
		description = '';
	}

	function closeCreateModal() {
		showCreateModal = false;
		originalUrl = '';
		customAlias = '';
		title = '';
		description = '';
	}

	async function createShortUrl() {
		if (!originalUrl.trim()) {
			toast.error('Please enter a URL');
			return;
		}

		// Validate URL
		try {
			new URL(originalUrl);
		} catch {
			toast.error('Please enter a valid URL');
			return;
		}

		creating = true;

		try {
			const response = await fetch('/dashboard/url-shortener/api/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					originalUrl: originalUrl.trim(),
					customAlias: customAlias.trim() || null,
					title: title.trim() || null,
					description: description.trim() || null
				})
			});

			const result = await response.json();

			if (!response.ok) {
				toast.error(result.error || 'Failed to create short URL');
			} else {
				toast.success('Short URL created successfully!');
				closeCreateModal();
				await invalidateAll();
			}
		} catch (err) {
			toast.error('An unexpected error occurred');
		} finally {
			creating = false;
		}
	}

	async function deleteUrl(urlId: string) {
		if (!confirm('Are you sure you want to delete this short URL?')) {
			return;
		}

		try {
			const response = await fetch('/dashboard/url-shortener/api/delete', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: urlId })
			});

			const result = await response.json();

			if (!response.ok) {
				toast.error(result.error || 'Failed to delete URL');
			} else {
				toast.success('URL deleted successfully');
				await invalidateAll();
				if (selectedUrl?.id === urlId) {
					selectedUrl = null;
					showAnalytics = false;
				}
			}
		} catch (err) {
			toast.error('An unexpected error occurred');
		}
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard!');
	}

	function viewAnalytics(url: any) {
		selectedUrl = url;
		showAnalytics = true;
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getShortUrl(code: string) {
		return `${baseUrl}/s/${code}`;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<DashboardSidebar currentPath={currentPath} />

	<div class="lg:ml-64 pt-16 lg:pt-0">
		<div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-2xl sm:text-3xl font-bold text-black">URL Shortener</h2>
				<button
					onclick={openCreateModal}
					class="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					Create Short URL
				</button>
			</div>

			<!-- URLs List -->
			<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
				<h3 class="text-lg font-bold text-black mb-4">My Short URLs</h3>

				{#if urls.length === 0}
					<div class="text-center py-12">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 mx-auto text-gray-300 mb-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-5.656-3.555a4 4 0 003.839 2.758M15 10l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
						<p class="text-black/60 mb-4">No short URLs created yet</p>
						<button
							onclick={openCreateModal}
							class="bg-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
						>
							Create Your First Short URL
						</button>
					</div>
				{:else}
					<div class="space-y-4">
						{#each urls as url}
							<div class="border border-gray-200 rounded-xl p-4 hover:shadow-md hover-lift transition-all duration-200">
								<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div class="flex-1 min-w-0">
										{#if url.title}
											<h4 class="font-semibold text-black mb-1">{url.title}</h4>
										{/if}
										<div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
											<a
												href={getShortUrl(url.custom_alias || url.short_code)}
												target="_blank"
												class="text-purple-600 hover:text-purple-700 font-medium text-sm break-all"
											>
												{getShortUrl(url.custom_alias || url.short_code)}
											</a>
											<button
												onclick={() => copyToClipboard(getShortUrl(url.custom_alias || url.short_code))}
												class="text-gray-500 hover:text-purple-600 transition-colors inline-flex items-center"
												title="Copy"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
													/>
												</svg>
											</button>
										</div>
										<p class="text-sm text-black/60 break-all mb-2">{url.original_url}</p>
										<div class="flex flex-wrap items-center gap-4 text-xs text-black/50">
											<span>👆 {url.click_count || 0} clicks</span>
											<span>📅 Created {formatDate(url.created_at)}</span>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<button
											onclick={() => viewAnalytics(url)}
											class="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
										>
											Analytics
										</button>
										<button
											onclick={() => deleteUrl(url.id)}
											class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
										>
											Delete
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Create URL Modal -->
			{#if showCreateModal}
				<div
					class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
					onclick={closeCreateModal}
				>
					<div
						class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
						onclick={(e) => e.stopPropagation()}
					>
						<div class="flex items-center justify-between mb-6">
							<h3 class="text-xl font-bold text-black">Create Short URL</h3>
							<button
								onclick={closeCreateModal}
								class="text-gray-500 hover:text-black transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div class="space-y-4">
							<div>
								<label for="originalUrl" class="block text-sm font-medium text-black mb-2">
									Original URL <span class="text-red-500">*</span>
								</label>
								<input
									type="url"
									id="originalUrl"
									bind:value={originalUrl}
									placeholder="https://example.com/very/long/url"
									class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500 text-black placeholder-gray-400 transition-all duration-200"
								/>
							</div>

							<div>
								<label for="customAlias" class="block text-sm font-medium text-black mb-2">
									Custom Alias (Optional)
								</label>
								<input
									type="text"
									id="customAlias"
									bind:value={customAlias}
									placeholder="my-custom-link"
									class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500 text-black placeholder-gray-400 transition-all duration-200"
								/>
							</div>

							<div>
								<label for="title" class="block text-sm font-medium text-black mb-2">
									Title (Optional)
								</label>
								<input
									type="text"
									id="title"
									bind:value={title}
									placeholder="My Awesome Link"
									class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500 text-black placeholder-gray-400 transition-all duration-200"
								/>
							</div>

							<div>
								<label for="description" class="block text-sm font-medium text-black mb-2">
									Description (Optional)
								</label>
								<textarea
									id="description"
									bind:value={description}
									placeholder="Brief description of this link"
									rows="3"
									class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500 text-black placeholder-gray-400 transition-all duration-200"
								></textarea>
							</div>

							<div class="flex items-center gap-3 pt-4">
								<button
									onclick={createShortUrl}
									disabled={creating}
									class="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
								>
									{creating ? 'Creating...' : 'Create Short URL'}
								</button>
								<button
									onclick={closeCreateModal}
									class="px-6 py-3 border border-gray-200 rounded-xl font-medium text-black hover:bg-gray-50 transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Analytics Modal -->
			{#if showAnalytics && selectedUrl}
				<div
					class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
					onclick={() => {
						showAnalytics = false;
						selectedUrl = null;
					}}
				>
					<div
						class="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
						onclick={(e) => e.stopPropagation()}
					>
						<div class="flex items-center justify-between mb-6">
							<h3 class="text-xl font-bold text-black">Analytics: {selectedUrl.title || 'Untitled'}</h3>
							<button
								onclick={() => {
									showAnalytics = false;
									selectedUrl = null;
								}}
								class="text-gray-500 hover:text-black transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{#if selectedUrl}
							{@const urlAnalytics = analytics[selectedUrl.id] || {}}

							<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div class="bg-purple-50 border border-purple-200 rounded-xl p-4">
									<div class="text-2xl font-bold text-purple-600">{urlAnalytics.totalClicks || 0}</div>
									<div class="text-sm text-purple-700">Total Clicks</div>
								</div>
								<div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
									<div class="text-2xl font-bold text-blue-600">
										{Object.keys(urlAnalytics.clicksByDate || {}).length}
									</div>
									<div class="text-sm text-blue-700">Days Active</div>
								</div>
								<div class="bg-green-50 border border-green-200 rounded-xl p-4">
									<div class="text-2xl font-bold text-green-600">
										{Object.keys(urlAnalytics.clicksByDevice || {}).length}
									</div>
									<div class="text-sm text-green-700">Device Types</div>
								</div>
							</div>

							<!-- Recent Clicks -->
							<div class="mb-6">
								<h4 class="font-semibold text-black mb-3">Recent Clicks</h4>
								<div class="space-y-2">
									{#if urlAnalytics.recentClicks && urlAnalytics.recentClicks.length > 0}
										{#each urlAnalytics.recentClicks as click}
											<div class="border border-gray-200 rounded-lg p-3 text-sm">
												<div class="flex items-center justify-between">
													<div>
														<span class="font-medium">{click.device_type || 'Unknown'}</span>
														<span class="text-black/60 ml-2">{click.browser || 'Unknown'} on {click.os || 'Unknown'}</span>
													</div>
													<span class="text-black/50">{formatDate(click.clicked_at)}</span>
												</div>
											</div>
										{/each}
									{:else}
										<p class="text-black/60 text-sm">No clicks yet</p>
									{/if}
								</div>
							</div>

							<!-- Clicks by Device -->
							{#if urlAnalytics.clicksByDevice && Object.keys(urlAnalytics.clicksByDevice).length > 0}
								<div class="mb-6">
									<h4 class="font-semibold text-black mb-3">Clicks by Device</h4>
									<div class="space-y-2">
										{#each Object.entries(urlAnalytics.clicksByDevice) as [device, count]}
											<div class="flex items-center justify-between border border-gray-200 rounded-lg p-3">
												<span class="font-medium">{device}</span>
												<span class="text-purple-600 font-semibold">{count}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

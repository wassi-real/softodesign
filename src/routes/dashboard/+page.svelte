<script lang="ts">
	import type { PageData } from './$types';
	import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	const currentPath = $derived(page.url.pathname);

	const stats = $derived(data.stats || { toolsSubmitted: 0, agenciesSubmitted: 0, toolsInStack: 0, agenciesHired: 0 });
	const progress = $derived(data.progress || { profileComplete: false, hasListings: false, completionPercentage: 0 });
	const founder = $derived(data.founder);

	const showProgress = $derived(progress.completionPercentage < 100);
</script>

<div class="min-h-screen bg-gray-50">
	<DashboardSidebar currentPath={currentPath} />

	<div class="lg:ml-64 pt-16 lg:pt-0">
		<div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
			<h2 class="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8">Dashboard Overview</h2>

			<!-- Progress Box -->
			{#if showProgress}
				<div class="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl shadow-sm">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
						<h3 class="text-lg sm:text-xl font-bold text-black">Profile Completion</h3>
						<span class="text-2xl sm:text-3xl font-bold text-purple-600">{progress.completionPercentage}%</span>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-3 mb-4">
						<div
							class="bg-purple-600 h-3 rounded-full transition-all duration-500"
							style="width: {progress.completionPercentage}%"
						></div>
					</div>
					<div class="space-y-2">
						{#if !progress.profileComplete}
							<div class="flex items-center gap-2 text-black/70 text-sm sm:text-base">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
								<span class="flex-1">Founder profile not set up yet</span>
								<a href="/dashboard/profile" class="text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap">Complete →</a>
							</div>
						{/if}
						{#if !progress.hasListings}
							<div class="flex items-center gap-2 text-black/70 text-sm sm:text-base">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
								<span class="flex-1">No listings submitted yet (SaaS tool or Agency)</span>
								<a href="/dashboard/submit" class="text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap">Submit →</a>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Stats Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
				<!-- Profile Card -->
				<a href="/dashboard/profile" class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-purple-300 hover:shadow-lg hover-lift transition-all duration-300 animate-slide-up">
					<div class="flex items-center gap-4 mb-4">
						<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="text-base sm:text-lg font-bold text-black truncate">Profile</h3>
							<p class="text-xs sm:text-sm text-black/60">{founder?.founder_name ? 'Complete' : 'Incomplete'}</p>
						</div>
						{#if founder?.founder_name}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{/if}
					</div>
				</a>

				<!-- Tools Submitted Card -->
				<a href="/dashboard/submit" class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-purple-300 hover:shadow-lg hover-lift transition-all duration-300 animate-slide-up">
					<div class="flex items-center gap-4 mb-4">
						<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="text-base sm:text-lg font-bold text-black truncate">Tools Submitted</h3>
							<p class="text-2xl sm:text-3xl font-bold text-purple-600">{stats.toolsSubmitted}</p>
						</div>
					</div>
				</a>

				<!-- Agencies Submitted Card -->
				<a href="/dashboard/submit" class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-purple-300 hover:shadow-lg hover-lift transition-all duration-300 animate-slide-up">
					<div class="flex items-center gap-4 mb-4">
						<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="text-base sm:text-lg font-bold text-black truncate">Agencies Submitted</h3>
							<p class="text-2xl sm:text-3xl font-bold text-purple-600">{stats.agenciesSubmitted}</p>
						</div>
					</div>
				</a>

				<!-- Stack Card -->
				<a href="/dashboard/stack" class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-purple-300 hover:shadow-lg hover-lift transition-all duration-300 animate-slide-up">
					<div class="flex items-center gap-4 mb-4">
						<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="text-base sm:text-lg font-bold text-black truncate">Tools in Stack</h3>
							<p class="text-2xl sm:text-3xl font-bold text-purple-600">{stats.toolsInStack}</p>
						</div>
					</div>
				</a>
			</div>

			<!-- Quick Actions -->
			<div class="mb-6 sm:mb-8">
				<h3 class="text-lg sm:text-xl font-bold text-black mb-4">Quick Actions</h3>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<a href="/dashboard/profile" class="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md hover-lift transition-all duration-300">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						<span class="font-medium text-black">Edit Profile</span>
					</a>
					<a href="/dashboard/submit" class="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md hover-lift transition-all duration-300">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						<span class="font-medium text-black">Submit New Listing</span>
					</a>
					<a href="/dashboard/stack" class="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md hover-lift transition-all duration-300">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						<span class="font-medium text-black">Manage Stack</span>
					</a>
				</div>
			</div>

			<!-- Recent Activity -->
			<div>
				<h3 class="text-lg sm:text-xl font-bold text-black mb-4">Recent Activity</h3>
				<div class="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
					<p class="text-black/60">No recent activity to display</p>
				</div>
			</div>
		</div>
	</div>
</div>

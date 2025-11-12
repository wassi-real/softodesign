<script lang="ts">
	import { signOut } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { currentPath = '/dashboard' } = $props();
	let mobileMenuOpen = $state(false);

	const menuItems = [
		{ href: '/dashboard', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/dashboard/stack', label: 'My Stack', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
		{ href: '/dashboard/payments', label: 'My Payments', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
		{ href: '/dashboard/profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
		{ href: '/dashboard/submit', label: 'Submit Listing', icon: 'M12 4v16m8-8H4' },
	];

	const businessToolsItems = [
		{ href: '/dashboard/url-shortener', label: 'URL Shortener', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' },
	];

	const settingsItems = [
		{ href: '/dashboard/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
	];

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<!-- Mobile Menu Button -->
<button
	onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
	class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg"
	aria-label="Toggle menu"
>
	<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		{#if mobileMenuOpen}
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		{:else}
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
		{/if}
	</svg>
</button>

<!-- Mobile Overlay -->
{#if mobileMenuOpen}
	<div
		class="lg:hidden fixed inset-0 bg-black/50 z-40"
		onclick={closeMobileMenu}
		role="button"
		tabindex="-1"
	></div>
{/if}

<!-- Sidebar -->
<aside
	class="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 {mobileMenuOpen
		? 'translate-x-0'
		: '-translate-x-full lg:translate-x-0'}"
>
	<!-- Sidebar Header -->
	<br>
	<br>
	<div class="p-4 sm:p-6 border-b border-gray-200">
		<h2 class="text-lg sm:text-xl font-bold text-black"></h2>
	</div>

	<!-- Menu Items -->
	<nav class="flex-1 p-4 overflow-y-auto">
		<div class="space-y-1">
			{#each menuItems as item}
				<a
					href={item.href}
					onclick={closeMobileMenu}
					class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href))
						? 'bg-purple-100 text-purple-600 font-medium'
						: 'text-black hover:bg-gray-100'}"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 flex-shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
					</svg>
					<span class="text-sm sm:text-base">{item.label}</span>
				</a>
			{/each}

			<!-- Business Tools Section -->
			<div class="mt-6 pt-6 border-t border-gray-200">
				<h3 class="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Tools</h3>
				{#each businessToolsItems as item}
					<a
						href={item.href}
						onclick={closeMobileMenu}
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentPath === item.href || currentPath.startsWith(item.href)
							? 'bg-purple-100 text-purple-600 font-medium'
							: 'text-black hover:bg-gray-100'}"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
						</svg>
						<span class="text-sm sm:text-base">{item.label}</span>
					</a>
				{/each}
			</div>

			<!-- Settings Section -->
			<div class="mt-6 pt-6 border-t border-gray-200">
				{#each settingsItems as item}
					<a
						href={item.href}
						onclick={closeMobileMenu}
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentPath === item.href || currentPath.startsWith(item.href)
							? 'bg-purple-100 text-purple-600 font-medium'
							: 'text-black hover:bg-gray-100'}"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
						</svg>
						<span class="text-sm sm:text-base">{item.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</nav>
</aside>

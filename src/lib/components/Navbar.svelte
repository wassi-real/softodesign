<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { browser } from '$app/environment';

let user = $state<any>(null);
let userResolved = $state(!browser);
let showDiscoverDropdown = $state(false);
let showMobileMenu = $state(false);

	const discoverItems = [
		{ href: '/founders', label: 'Founders', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
		{ href: '/tools', label: 'SaaS Tools', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
		{ href: '/agencies', label: 'Agencies', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
	];

	const navItems = [
		{ href: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/community', label: 'Community', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
	];

	$effect(() => {
		if (browser) {
			// Check for existing session
			supabase.auth.getSession().then(({ data: { session } }) => {
				user = session?.user ?? null;
				userResolved = true;
			});

			// Listen for auth changes
			const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
				user = session?.user ?? null;
				userResolved = true;
			});

			return () => {
				listener.subscription.unsubscribe();
			};
		}
	});

	$effect(() => {
		if (!browser) return;

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				showDiscoverDropdown = false;
				showMobileMenu = false;
			}
		};

		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<nav class="relative sticky top-0 z-50 border-b border-gray-200/50 bg-white/90 backdrop-blur-lg shadow-sm">
	<div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16 sm:h-20">
			<!-- Logo -->
			<a href="/" class="flex items-center space-x-2 sm:space-x-3 group">
				<div class="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
					<img src="/logo.png" alt="SoftoDesign logo" class="h-8 w-auto sm:h-10 transition-all duration-300 group-hover:drop-shadow-lg" />
				</div>
				<span class="text-lg sm:text-xl font-bold text-black transition-colors duration-300 hidden sm:inline">
					SoftoDesign
				</span>
			</a>

			<!-- Navigation Links -->
			<div class="hidden md:flex items-center gap-2 lg:gap-3">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 text-black hover:bg-white hover:border-purple-300/50 hover:text-purple-600 transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:scale-105 text-sm lg:text-base"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 lg:h-5 lg:w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
						</svg>
						<span class="hidden lg:inline">{item.label}</span>
					</a>
				{/each}

				<!-- Discover Dropdown -->
				<div class="relative">
					<button
						on:click={() => (showDiscoverDropdown = !showDiscoverDropdown)}
						aria-haspopup="true"
						aria-expanded={showDiscoverDropdown}
						class="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 text-black hover:bg-white hover:border-purple-300/50 hover:text-purple-600 transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:scale-105 text-sm lg:text-base"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 lg:h-5 lg:w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						<span class="hidden lg:inline">Discover</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-3 w-3 lg:h-4 lg:w-4 ml-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if showDiscoverDropdown}
						<div class="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 overflow-hidden z-50 animate-slide-down">
							{#each discoverItems as item}
								<a
									href={item.href}
									on:click={() => (showDiscoverDropdown = false)}
									class="flex items-center gap-2 px-4 py-3 text-black hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
									</svg>
									<span class="font-medium">{item.label}</span>
								</a>
							{/each}
						</div>
					{/if}
				</div>

				{#if userResolved}
					{#if user}
						<a
							href="/dashboard"
							class="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 text-black hover:bg-white hover:border-purple-300/50 hover:text-purple-600 transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:scale-105 text-sm lg:text-base"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 lg:h-5 lg:w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
							<span class="hidden lg:inline">Dashboard</span>
						</a>
					{:else}
						<a
							href="/auth"
							class="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 backdrop-blur-sm text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 text-sm lg:text-base"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 lg:h-5 lg:w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							<span class="hidden lg:inline">Log in</span>
						</a>
					{/if}
				{/if}
			</div>

			<!-- Mobile Menu Button -->
			<button
				on:click={() => (showMobileMenu = !showMobileMenu)}
				class="md:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-200/50 text-black hover:bg-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
				aria-label="Toggle navigation"
				aria-expanded={showMobileMenu}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 {showMobileMenu ? 'rotate-90' : ''}"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if showMobileMenu}
		<div class="md:hidden absolute inset-x-0 top-full z-40 px-3 sm:px-4 pb-4">
			<div class="mt-2 rounded-2xl border border-gray-200/70 bg-white/95 backdrop-blur-md shadow-xl animate-slide-down overflow-hidden">
				<div class="px-4 py-3 flex flex-col gap-3">
					{#each navItems as item}
						<a
							href={item.href}
							on:click={() => (showMobileMenu = false)}
							class="flex items-center gap-3 text-sm font-medium text-black/80 hover:text-purple-600 transition-colors"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
								<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
							</svg>
							{item.label}
						</a>
					{/each}
				</div>
				<div class="border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
					<p class="text-xs uppercase tracking-[0.3em] text-gray-400">Discover</p>
					{#each discoverItems as item}
						<a
							href={item.href}
							on:click={() => (showMobileMenu = false)}
							class="flex items-center gap-3 text-sm font-medium text-black/80 hover:text-purple-600 transition-colors"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
								<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
							</svg>
							{item.label}
						</a>
					{/each}
				</div>
				{#if userResolved}
					<div class="border-t border-gray-100 px-4 py-4">
						{#if user}
							<a
								href="/dashboard"
								on:click={() => (showMobileMenu = false)}
								class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 py-3 text-sm font-semibold text-white shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
								Dashboard
							</a>
						{:else}
							<a
								href="/auth"
								on:click={() => (showMobileMenu = false)}
								class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 py-3 text-sm font-semibold text-white shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
									<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								Log in
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>

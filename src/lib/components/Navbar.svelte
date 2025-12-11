<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import mainLogo from '$lib/assets/main-logo.png';
	import whiteLogo from '$lib/assets/white-logo.png';
	import { slide } from 'svelte/transition';

	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'Products', href: '#products' },
		{ name: 'About', href: '#about' },
		{ name: 'Contact', href: 'mailto:support@softodesign.com' }
	];
</script>

<nav
	class="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-slate-200 dark:border-zinc-900 transition-colors duration-300"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-20">
			<!-- Logo -->
			<div class="flex-shrink-0 flex items-center">
				<a href="/" class="flex items-center gap-2 group">
					<img
						src={mainLogo}
						alt="SoftoDesign"
						class="h-10 w-auto dark:hidden transition-transform group-hover:scale-105"
					/>
					<img
						src={whiteLogo}
						alt="SoftoDesign"
						class="h-10 w-auto hidden dark:block transition-transform group-hover:scale-105"
					/>
					<span
						class="font-bold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block"
						>SoftoDesign</span
					>
				</a>
			</div>

			<!-- Desktop Menu -->
			<div class="hidden md:flex items-center space-x-8">
				{#each links as link}
					<a
						href={link.href}
						class="text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-accent dark:hover:text-accent transition-colors"
					>
						{link.name}
					</a>
				{/each}
				<div class="pl-4 border-l border-slate-200 dark:border-zinc-800">
					<ThemeToggle />
				</div>
			</div>

			<!-- Mobile Menu Button -->
			<div class="md:hidden flex items-center gap-4">
				<ThemeToggle />
				<button
					onclick={toggleMobileMenu}
					class="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-accent"
					aria-expanded={isMobileMenuOpen}
					aria-label="Main menu"
				>
					{#if !isMobileMenuOpen}
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
					{:else}
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Dropdown Menu -->
	{#if isMobileMenuOpen}
		<div
			transition:slide={{ duration: 200 }}
			class="md:hidden bg-white dark:bg-black border-t border-slate-200 dark:border-zinc-900"
		>
			<div class="px-4 pt-2 pb-4 space-y-1">
				{#each links as link}
					<a
						href={link.href}
						onclick={toggleMobileMenu}
						class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-zinc-300 hover:text-accent dark:hover:text-accent hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
					>
						{link.name}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>

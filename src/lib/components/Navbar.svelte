<script>
	import { onMount } from 'svelte';

	let isScrolled = false;
	let isMobileMenuOpen = false;

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen;
	};

	const closeMobileMenu = () => {
		isMobileMenuOpen = false;
	};
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}">
	<div class="max-w-6xl mx-auto px-4">
		<div class="flex justify-between items-center py-4">
			<!-- Logo -->
			<a href="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
				<img src="/logo.png" alt="SoftoDesign Labs" class="h-8 w-8 md:h-10 md:w-10 object-contain" />
				<div>
					<div class="text-base md:text-lg font-bold text-purple-700">SoftoDesign Labs</div>
					<div class="text-xs text-gray-600 hidden sm:block">Official Website 2025</div>
				</div>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-4">
				<a href="/about" class="block px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
					<div class="flex items-center space-x-2">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
							<circle cx="12" cy="7" r="4"/>
						</svg>
						<span class="font-medium">About</span>
					</div>
				</a>
				<a href="/education" class="block px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
					<div class="flex items-center space-x-2">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
							<path d="M6 12v5c3 3 9 3 12 0v-5"/>
						</svg>
						<span class="font-medium">Education</span>
					</div>
				</a>
				<a href="https://app.softodesign.com/products" target="_blank" rel="noopener noreferrer" class="block px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
					<div class="flex items-center space-x-2">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/>
							<path d="M3 6h18"/>
							<path d="M16 10a4 4 0 0 1-8 0"/>
						</svg>
						<span class="font-medium">Products</span>
					</div>
				</a>
				<a href="https://app.softodesign.com" target="_blank" rel="noopener noreferrer" class="block px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
					<div class="flex items-center space-x-2">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
							<line x1="8" y1="21" x2="16" y2="21"/>
							<line x1="12" y1="17" x2="12" y2="21"/>
						</svg>
						<span class="font-medium">Platform</span>
					</div>
				</a>
			</div>

			<!-- Mobile Menu Button -->
			<button 
				on:click={toggleMobileMenu}
				class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
				aria-label="Toggle navigation menu"
			>
				{#if isMobileMenuOpen}
					<!-- Close Icon -->
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"/>
						<line x1="6" y1="6" x2="18" y2="18"/>
					</svg>
				{:else}
					<!-- Hamburger Icon -->
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="3" y1="6" x2="21" y2="6"/>
						<line x1="3" y1="12" x2="21" y2="12"/>
						<line x1="3" y1="18" x2="21" y2="18"/>
					</svg>
				{/if}
			</button>
		</div>

		<!-- Mobile Menu Dropdown -->
		{#if isMobileMenuOpen}
			<div class="md:hidden border-t border-gray-200 bg-white">
				<div class="px-4 py-4 space-y-2">
					<a 
						href="/about" 
						on:click={closeMobileMenu}
						class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
							<circle cx="12" cy="7" r="4"/>
						</svg>
						<span class="font-medium">About</span>
					</a>
					<a 
						href="/education" 
						on:click={closeMobileMenu}
						class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
							<path d="M6 12v5c3 3 9 3 12 0v-5"/>
						</svg>
						<span class="font-medium">Education</span>
					</a>
					<a 
						href="https://app.softodesign.com/products" 
						target="_blank" 
						rel="noopener noreferrer"
						on:click={closeMobileMenu}
						class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/>
							<path d="M3 6h18"/>
							<path d="M16 10a4 4 0 0 1-8 0"/>
						</svg>
						<span class="font-medium">Products</span>
					</a>
					<a 
						href="https://app.softodesign.com" 
						target="_blank" 
						rel="noopener noreferrer"
						on:click={closeMobileMenu}
						class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
							<line x1="8" y1="21" x2="16" y2="21"/>
							<line x1="12" y1="17" x2="12" y2="21"/>
						</svg>
						<span class="font-medium">Platform</span>
					</a>
				</div>
			</div>
		{/if}
	</div>
</nav>

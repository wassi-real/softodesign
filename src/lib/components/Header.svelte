<script>
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	
	let isMenuOpen = false;
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	// Close menu when route changes
	$: if ($page.url.pathname) {
		isMenuOpen = false;
	}
	
	const navItems = [
		{ 
			href: '/', 
			label: 'Home',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
		},
		{ 
			href: '/products', 
			label: 'Products & Services',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>'
		},
		// { 
		// 	href: '/blog', 
		// 	label: 'Blog',
		// 	icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
		// },
		{ 
			href: '/about', 
			label: 'About Us',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
		},
		{ 
			href: '/contact', 
			label: 'Contact',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>'
		}
	];
</script>

<style>
	.animated-gradient {
		background-size: 200% 200%;
		background-image: linear-gradient(45deg, #9333ea, #4f46e5, #8b5cf6, #6366f1);
		animation: gradient-animation 4s ease infinite;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	
	@keyframes gradient-animation {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
</style>

<header class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 py-4">
	<div class="container-custom flex items-center justify-between">
		<a href="/" class="flex items-center gap-2">
			<img src="/favicon.png" alt="SoftoDesign Logo" class="w-10 h-10 hover-lift" />
			<span class="text-xl font-semibold animated-gradient">SoftoDesign</span>
		</a>
		
		<!-- Desktop Navigation -->
		<nav class="hidden md:flex items-center space-x-4">
			{#each navItems as item}
				<a 
					href={item.href} 
					class="menu-item flex items-center gap-2 px-4 py-2 rounded-md border border-transparent {($page.url.pathname === item.href || (item.href === '/blog' && $page.url.pathname.startsWith('/blog'))) ? 'text-purple-700 border-purple-200 bg-purple-50' : 'hover:border-gray-200 hover:bg-gray-50'} transition-all duration-200"
				>
					<span class="icon">{@html item.icon}</span>
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
		
		<!-- Mobile Menu Button -->
		<button 
			class="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
			on:click={toggleMenu}
			aria-expanded={isMenuOpen}
			aria-label="Toggle menu"
		>
			<svg 
				xmlns="http://www.w3.org/2000/svg" 
				width="24" 
				height="24" 
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				stroke-width="2" 
				stroke-linecap="round" 
				stroke-linejoin="round"
				class="transition-transform duration-300 {isMenuOpen ? 'rotate-90' : ''}"
			>
				{#if isMenuOpen}
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				{:else}
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				{/if}
			</svg>
		</button>
	</div>
	
	<!-- Mobile Menu (Animated) -->
	{#if isMenuOpen}
		<div 
			transition:slide={{ duration: 300, easing: quintOut }}
			class="md:hidden bg-white border-t border-gray-100 shadow-md"
		>
			<nav class="container-custom py-4 flex flex-col space-y-3">
				{#each navItems as item}
					<a 
						href={item.href} 
						class="menu-item flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-md border {($page.url.pathname === item.href || (item.href === '/blog' && $page.url.pathname.startsWith('/blog'))) ? 'text-purple-700 bg-purple-50 border-purple-200' : 'border-gray-200 hover:bg-gray-50'} transition-all"
					>
						<span class="icon">{@html item.icon}</span>
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
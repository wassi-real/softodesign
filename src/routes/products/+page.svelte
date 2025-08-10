<script>
	import { fade, fly } from 'svelte/transition';
	import productsData from '$lib/data/products.json';
	
	// Default placeholder image if logo is missing
	const defaultLogo = '/images/products/default.svg';
</script>

<svelte:head>
	<title>Products & Services | SoftoDesign Labs</title>
	<meta name="description" content="Explore our range of innovative products and services designed to help you succeed." />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
	<div class="mb-16 text-center" in:fade={{ duration: 300, delay: 150 }}>
		<h1 class="text-4xl md:text-5xl font-bold mb-6">Our Products & Services</h1>
		<p class="text-xl text-gray-700 max-w-3xl mx-auto">
			Explore our range of innovative solutions designed to help businesses and individuals succeed in the digital world.
		</p>
	</div>
	
	<!-- Decorative element -->
	<div class="relative mb-16">
		<div class="absolute inset-0 flex items-center" aria-hidden="true">
			<div class="w-full border-t border-purple-200"></div>
		</div>
		<div class="relative flex justify-center">
			<span class="bg-white px-4">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500"><path d="M12 5v14M5 12h14"></path></svg>
			</span>
		</div>
	</div>
	
	{#each productsData.categories as category, i}
		<section class="mb-24" id={category.id} in:fade={{ duration: 300, delay: 150 + (i * 100) }}>
			<div class="mb-10 relative">
				<div class="flex items-center">
					<div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
						{#if category.id === 'agency'}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-700"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
						{:else if category.id === 'saas'}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-700"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-700"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>
						{/if}
					</div>
					<h2 class="text-3xl md:text-4xl font-bold text-gradient">{category.name}</h2>
				</div>
				<p class="text-lg text-gray-600 mt-4 pl-16 border-l-4 border-purple-100 py-2">{category.description}</p>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each category.products as product, j}
					<!-- Inside the product card, add this right after the opening <a> tag -->
					<a 
					  href={product.url} 
					  target="_blank" 
					  rel="noopener noreferrer"
					  class="card group hover:border-purple-200 hover:shadow-lg transform transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
					  in:fly={{ y: 20, duration: 300, delay: 200 + (j * 100) }}
					>
					  <!-- Decorative corner accent -->
					  <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-100 to-transparent -mr-8 -mt-8 rounded-full opacity-70"></div>
					  
					  <!-- Status badges -->
					  <div class="absolute top-4 right-4 z-20 flex flex-col gap-2">
					    {#if product.sell}
					      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
					        Sold
					      </span>
					    {/if}
					    {#if product.inactive}
					      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
					        Inactive
					      </span>
					    {/if}
					    {#if product.active}
					      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
					        Active
					      </span>
					    {/if}
					    {#if product.inDev}
					      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
					        In Development
					      </span>
					    {/if}
					  </div>
					
					  <div class="flex flex-col items-center text-center p-6 md:flex-row md:items-start md:text-left relative z-10">
					    <!-- Rest of the product card content -->
							<div class="w-20 h-20 rounded-lg bg-purple-50 flex items-center justify-center overflow-hidden shrink-0 mb-6 md:mb-0 md:mr-6 border border-purple-100 shadow-sm group-hover:shadow-md transition-all">
								<img 
									src={product.logo || defaultLogo} 
									alt={product.name} 
									class="w-12 h-12 object-contain"
								/>
							</div>
							
							<div>
								<h3 class="text-xl font-semibold mb-4 group-hover:text-purple-700 transition-colors">
									{product.name}
								</h3>
								<p class="text-gray-600 mb-6">{product.description}</p>
								
								<div class="mt-auto flex items-center text-sm text-purple-700 font-medium group-hover:translate-x-1 transition-transform">
									<span>Learn more</span>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1 group-hover:ml-2 transition-all"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
								</div>
							</div>
						</div>
						
						<!-- Bottom accent bar -->
						<div class="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-500 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
					</a>
				{/each}
			</div>
			
			<!-- Decorative element after each category except the last one -->
			{#if i < productsData.categories.length - 1}
				<div class="flex justify-center my-16">
					<div class="w-24 h-1 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full"></div>
				</div>
			{/if}
		</section>
	{/each}
	
	<!-- Category quick navigation -->
	<div class="sticky bottom-4 flex justify-center z-10" in:fade={{ duration: 300, delay: 700 }}>
		<div class="bg-white px-6 py-4 rounded-full shadow-lg border border-gray-200 flex gap-3 overflow-x-auto max-w-full">
			{#each productsData.categories as category}
				<a 
					href={`#${category.id}`} 
					class="px-5 py-2 text-sm font-medium rounded-full bg-gray-50 hover:bg-purple-50 hover:text-purple-700 transition-colors whitespace-nowrap flex items-center gap-2"
				>
					{#if category.id === 'agency'}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
					{:else if category.id === 'saas'}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>
					{/if}
					{category.name}
				</a>
			{/each}
		</div>
	</div>
	
	<!-- Call to action -->
	<section class="text-center py-16 px-8 bg-gradient-to-r from-purple-100 via-purple-50 to-indigo-100 rounded-xl border border-purple-200 mt-20 shadow-md relative overflow-hidden" in:fade={{ duration: 300, delay: 600 }}>
	    <!-- Decorative elements -->
	    <div class="absolute top-0 left-0 w-full h-full opacity-10">
	        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="absolute top-4 left-4 text-purple-700"><path d="M12 5v14M5 12h14"></path></svg>
	        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="absolute bottom-4 right-4 text-indigo-700"><circle cx="12" cy="12" r="10"></circle></svg>
	    </div>
	    
	    <div class="relative z-10">
	        <div class="inline-block p-3 bg-white rounded-full shadow-md mb-6">
	            <div class="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3">
	                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
	            </div>
	        </div>
	        <h2 class="text-3xl font-bold mb-5 text-gradient">Need a custom solution?</h2>
	        <p class="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
	            We can build tailored products and services to meet your specific business requirements.
	            Let's discuss how we can help you achieve your goals.
	        </p>
	        
	        <div class="flex flex-col sm:flex-row gap-4 justify-center">
	            <a href="mailto:contact@softodesign.com?subject=Custom Solution Inquiry" class="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
	                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
	                Email Us Directly
	            </a>
	            
	            <a href="/contact" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 font-medium rounded-md border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
	                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
	                Contact Us
	            </a>
	        </div>
	    </div>
	</section>
	
	<div class="mt-12">
		<a href="/" class="text-purple-700 hover:underline flex items-center gap-2 group">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
			Back to Home
		</a>
	</div>
</div>

<style>
	/* Smooth scrolling for anchor links */
	html {
		scroll-behavior: smooth;
	}
	
	/* Custom scrollbar for the category navigation */
	::-webkit-scrollbar {
		height: 4px;
	}
	
	::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 10px;
	}
	
	::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 10px;
	}
	
	::-webkit-scrollbar-thumb:hover {
		background: #a855f7;
	}
</style>
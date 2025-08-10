<script>
	import { fade, fly } from 'svelte/transition';
	import productsData from '$lib/data/products.json';

    // Get a few featured products from each category
	const featuredProducts = [];
	productsData.categories.forEach(category => {
		// Get up to 2 active products from each category
		const activeProducts = category.products
			.filter(product => product.active && !product.inactive && !product.sell)
			.slice(0, 2);
		
		if (activeProducts.length > 0) {
			featuredProducts.push(...activeProducts.map(product => ({
				...product,
				category: category.name
			})));
		}
	});
</script>

<!-- Featured Products Gallery -->
<section class="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
	<div class="container-custom">
		<div class="text-center mb-12 md:mb-16" in:fade={{ duration: 500, delay: 200 }}>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Our Solutions</h2>
			<div class="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Explore our innovative products and services designed to elevate your business in the digital world.
			</p>
		</div>
		
		<div class="flex flex-wrap -mx-4">
			{#each featuredProducts as product, i}
				<div 
					class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
					in:fly={{ y: 20, duration: 400, delay: 200 + (i * 100) }}
				>
					<div class="group h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 border border-gray-100">
						<!-- Product image banner -->
						<div class="relative h-48 bg-gradient-to-r from-purple-100 to-indigo-100 overflow-hidden">
							<div class="absolute inset-0 bg-pattern opacity-10"></div>
							<img 
								src={product.logo} 
								alt={product.name} 
								class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
							/>
							<div class="absolute top-4 right-4">
								<span class="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm text-purple-700 text-xs font-medium rounded-full">
									{product.category}
								</span>
							</div>
						</div>
						
						<!-- Product content -->
						<div class="p-6 flex-grow flex flex-col">
							<h3 class="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition-colors">{product.name}</h3>
							<p class="text-gray-600 mb-6 flex-grow">{product.description}</p>
							
							<!-- Action button -->
							<div class="mt-auto pt-4 border-t border-gray-100">
								<a 
									href={product.url} 
									target="_blank" 
									rel="noopener noreferrer" 
									class="inline-flex items-center justify-center w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg transition-colors"
								>
									Explore {product.name}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			{/each}
			
			<!-- View All Products Card -->
			<div 
				class="w-full px-4 mb-8"
				in:fly={{ y: 20, duration: 400, delay: 200 + (featuredProducts.length * 100) }}
			>
				<div class="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
					<div class="p-8 md:p-10 flex flex-col md:flex-row items-center">
						<div class="md:w-2/3 mb-8 md:mb-0 md:pr-8">
							<h3 class="text-2xl md:text-3xl font-bold mb-4 text-white">Discover our complete collection</h3>
							<p class="text-purple-100 mb-8">
								Browse our full range of products and services designed to help your business thrive in today's competitive landscape.
							</p>
							<div class="flex flex-wrap gap-4">
								<a 
									href="/products" 
									class="inline-flex items-center bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
								>
									View All Products
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
									</svg>
								</a>
								<a 
									href="/contact" 
									class="inline-flex items-center border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-all duration-300"
								>
									Contact Us
								</a>
							</div>
						</div>
						<div class="md:w-1/3 flex justify-center">
							<div class="relative">
								<div class="absolute -inset-4 bg-white/10 rounded-full animate-pulse"></div>
								<div class="relative bg-white/20 backdrop-blur-sm rounded-full p-8">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
									</svg>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
.bg-pattern {
	background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
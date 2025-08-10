<script>
    import { fade, fly } from 'svelte/transition';
</script>

<!-- Call to Action -->
<section class="py-20 bg-gradient-to-r from-purple-50 to-indigo-50 border-y border-purple-100">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto text-center" in:fade={{ duration: 500, delay: 200 }}>
			<h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Ideas into Reality?</h2>
			<p class="text-xl text-gray-700 mb-10">
				Whether you need a custom solution, a SaaS product, or agency services, we're here to help you succeed in the digital world.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a 
					href="/contact" 
					class="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
				>
					Get in Touch
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
					</svg>
				</a>
				<a 
					href="/products" 
					class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 font-medium rounded-md border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transform transition-all duration-300 hover:scale-105 hover:shadow-md"
				>
					Explore Products
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>
<script>
    import { fade, fly } from 'svelte/transition';
    	let activeIndex = -1;
				
				function toggleFaq(index) {
					activeIndex = activeIndex === index ? -1 : index;
				}
				
				const faqs = [
					{
						question: "What types of businesses do you work with?",
						answer: "We work with businesses of all sizes, from startups to established enterprises. Our solutions are tailored to meet the specific needs of each client, regardless of their industry or size."
					},
					{
						question: "How long does it typically take to develop a custom solution?",
						answer: "The timeline for developing a custom solution varies depending on the complexity and scope of the project. Simple projects might take a few weeks, while more complex ones could take several months. We'll provide you with a detailed timeline during our initial consultation."
					},
					{
						question: "Do you offer ongoing support after project completion?",
						answer: "Yes, we offer various support and maintenance packages to ensure your solution continues to run smoothly after launch. Our team is always available to address any issues, implement updates, or make improvements as needed."
					},
					{
						question: "How do you handle data security and privacy?",
						answer: "We take data security and privacy very seriously. We implement industry-standard security measures and follow best practices to protect your data. All our solutions are built with privacy by design principles and comply with relevant regulations."
					},
					{
						question: "Can you help with integrating existing systems?",
						answer: "Absolutely! We specialize in integrating new solutions with existing systems. Our team has experience working with a wide range of technologies and can ensure smooth integration with your current infrastructure."
					},
					{
						question: "What is your pricing model?",
						answer: "Our pricing depends on the specific requirements of your project. We offer flexible pricing models, including fixed-price contracts, time and materials, and retainer arrangements. We'll work with you to find the most suitable option for your budget and needs."
					}
				];
</script>

<!-- FAQ Section -->
<section class="py-20">
	<div class="container-custom">
		<div class="text-center mb-16" in:fade={{ duration: 500, delay: 200 }}>
			<h2 class="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
			<p class="text-xl text-gray-700 max-w-3xl mx-auto">
				Find answers to common questions about our products, services, and how we can help your business.
			</p>
		</div>
		
		<div class="max-w-4xl mx-auto">
			<div class="space-y-6">
				{#each faqs as faq, index}
					<div 
						class="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
						in:fly={{ y: 20, duration: 300, delay: 300 + (index * 100) }}
					>
						<button 
							class="w-full flex justify-between items-center p-6 text-left focus:outline-none"
							on:click={() => toggleFaq(index)}
							aria-expanded={activeIndex === index}
						>
							<h3 class="text-lg font-semibold text-gray-900">{faq.question}</h3>
							<span class="ml-6 flex-shrink-0">
								<svg 
									class={`w-6 h-6 transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-purple-700' : 'text-gray-500'}`} 
									fill="none" 
									viewBox="0 0 24 24" 
									stroke="currentColor"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</span>
						</button>
						
						{#if activeIndex === index}
							<div 
								class="px-6 pb-6 text-gray-700"
								transition:fly={{ y: -20, duration: 300 }}
							>
								<p>{faq.answer}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
			
			<div class="text-center mt-12">
				<p class="text-lg text-gray-700 mb-6">
					Still have questions? We're here to help!
				</p>
				<a 
					href="/contact" 
					class="inline-flex items-center text-purple-700 hover:text-purple-800 font-medium"
				>
					Contact our team
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>
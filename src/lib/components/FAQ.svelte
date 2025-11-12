<script>
	let openItems = {};

	const faqItems = [
		{
			id: 1,
			question: "What types of businesses do you work with?",
			answer: "We work with businesses of all sizes, from startups to established enterprises. Our solutions are tailored to meet the specific needs of each client, regardless of their industry or size."
		},
		{
			id: 2,
			question: "How long does it typically take to develop a custom solution?",
			answer: "The timeline varies depending on the complexity and scope of the project. Typically, custom solutions take anywhere from 4-12 weeks. We provide detailed project timelines during our initial consultation and keep you updated throughout the development process."
		},
		{
			id: 3,
			question: "Do you offer ongoing support after project completion?",
			answer: "Yes, we provide comprehensive ongoing support and maintenance services. This includes regular updates, security patches, performance monitoring, and technical support to ensure your solution continues to perform optimally."
		},
		{
			id: 4,
			question: "How do you handle data security and privacy?",
			answer: "Data security and privacy are our top priorities. We implement industry-standard security measures, including encryption, secure hosting, regular security audits, and compliance with relevant data protection regulations like GDPR and CCPA."
		},
		{
			id: 5,
			question: "Can you help with integrating existing systems?",
			answer: "Absolutely! We specialize in system integration and can help connect your new solution with existing tools, databases, and third-party services. We ensure seamless data flow and maintain system compatibility."
		},
		{
			id: 6,
			question: "What services do you offer?",
			answer: "We offer a wide range of services, including web development, mobile app development, custom software development, and AI solutions. We also offer digital marketing services, including SEO, SEM, and social media marketing."
		}
	];

	function toggleItem(id) {
		openItems[id] = !openItems[id];
		openItems = { ...openItems };
	}
</script>

<div class="bg-gray-50 py-16 md:py-20 lg:py-24">
	<div class="max-w-4xl mx-auto px-4">
		<!-- Header Section -->
		<div class="text-center mb-12 lg:mb-16">
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
				Frequently Asked Questions
			</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Find answers to common questions about our products, services, and how we can help your business.
			</p>
		</div>

		<!-- FAQ Items -->
		<div class="space-y-4">
			{#each faqItems as item (item.id)}
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<button
						class="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
						on:click={() => toggleItem(item.id)}
					>
						<span class="text-lg font-medium text-gray-900 pr-4">
							{item.question}
						</span>
						<div class="flex-shrink-0">
							<svg
								class="w-5 h-5 text-gray-500 transform transition-transform duration-200 {openItems[item.id] ? 'rotate-180' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</button>
					
					{#if openItems[item.id]}
						<div class="px-6 pb-5 border-t border-gray-100">
							<p class="text-gray-600 leading-relaxed pt-4">
								{item.answer}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Contact CTA -->
		<div class="text-center mt-12">
			<p class="text-gray-600 mb-4">
				Still have questions? We're here to help.
			</p>
			<a
				href="/about"
				class="inline-flex items-center px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-lg transition-colors duration-200 space-x-2"
			>
				<span>Contact Us</span>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 12h14"/>
					<path d="m12 5 7 7-7 7"/>
				</svg>
			</a>
		</div>
	</div>
</div>
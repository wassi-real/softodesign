<script lang="ts">
	let openIndex = $state<number | null>(0);

	const faqs = [
		{
			question: 'What is SoftoDesign?',
			answer:
				'SoftoDesign is a Hub For multiple tools and resources for developers, designers, and entrepreneurs, etc.'
		},
		{
			question: 'Are the products free to use?',
			answer:
				'We offer both free and premium products. Each product page details the specific licensing and usage rights.'
		},
		{
			question: 'Can I use these resources for commercial projects?',
			answer:
				'Yes! Most of our resources are designed for both personal and commercial use. Please check the individual license for each product to be sure.'
		},
		{
			question: 'Do you offer support?',
			answer:
				'Absolutely. If you have any questions or run into issues, feel free to contact us via email at support@softodesign.com.'
		}
	];

	function toggle(index: number) {
		if (openIndex === index) {
			openIndex = null;
		} else {
			openIndex = index;
		}
	}
</script>

<section id="faq" class="py-24 bg-slate-50 dark:bg-zinc-900/30">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
				Frequently Asked Questions
			</h2>
			<p class="text-lg text-slate-600 dark:text-zinc-400">
				Everything you need to know about our products and services.
			</p>
		</div>

		<div class="space-y-4">
			{#each faqs as faq, index}
				<div
					class="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden"
				>
					<button
						onclick={() => toggle(index)}
						class="w-full flex justify-between items-center p-6 text-left focus:outline-none"
						aria-expanded={openIndex === index}
					>
						<span class="text-lg font-medium text-slate-900 dark:text-white">{faq.question}</span>
						<span class="ml-6 flex-shrink-0">
							{#if openIndex === index}
								<svg
									class="h-6 w-6 text-accent"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M18 12H6"
									/>
								</svg>
							{:else}
								<svg
									class="h-6 w-6 text-slate-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
							{/if}
						</span>
					</button>

					{#if openIndex === index}
						<div class="px-6 pb-6 pt-0">
							<p class="text-slate-600 dark:text-zinc-400 leading-relaxed">
								{faq.answer}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

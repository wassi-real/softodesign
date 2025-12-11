<script lang="ts">
	import jsonEdit from '$lib/assets/products/json-edit.png';
	import lidBlow from '$lib/assets/products/lidblow.png';
	import lidForms from '$lib/assets/products/lidforms.png';
	import mintMvp from '$lib/assets/products/mintmvp.png';
	import pages from '$lib/assets/products/pages.png';
	import smartLogs from '$lib/assets/products/smartlogs.png';
	import softoBucket from '$lib/assets/products/softobucket.png';
	import writerr from '$lib/assets/products/writerr.png';

	const products = [
		{
			name: 'Json Edit',
			image: jsonEdit,
			category: 'Tool',
			description: 'A powerful and intuitive JSON editor for developers.',
			link: '#'
		},
		{
			name: 'LidBlow',
			image: lidBlow,
			category: 'Coming Soon',
			description: 'The Simple, Clean Cloud Gaming Platform for gamers',
			link: 'https://lidblow.com'
		},
		{
			name: 'LidForms',
			image: lidForms,
			category: 'Forms',
			description: 'Simple and clean form builder for your next project.',
			link: 'https://lidforms.com'
		},
		{
			name: 'MintMVP',
			image: mintMvp,
			category: 'Agency',
			description: 'MVP Development Agency for your next project.',
			link: 'https://mintmvp.com'
		},
		{
			name: 'SoftoDesign Pages',
			image: pages,
			category: 'SaaS',
			description: 'A simple Note taking and Productivity App',
			link: 'https://pages.softodesign.com'
		},
		{
			name: 'SmartLogs',
			image: smartLogs,
			category: 'SaaS',
			description: 'Beautiful changelog and product update pages for your users',
			link: 'https://smartlogs.xyz'
		},
		{
			name: 'SoftoBucket',
			image: softoBucket,
			category: 'Directory',
			description: 'Modern Startup Directory for your next project.',
			link: 'https://softobucket.com'
		},
		{
			name: 'Writerr',
			image: writerr,
			category: 'SaaS',
			description: 'Distraction-free writing environment for creative professionals.',
			link: 'https://writerr.softodesign.com'
		}
	];
</script>

<section id="products" class="py-24 bg-slate-50 dark:bg-black/80">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
				Our Products
			</h2>
			<p class="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
				Tools and resources crafted to elevate your workflow and business.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
			{#each products as product}
				<div
					class="group bg-white dark:bg-zinc-950 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-zinc-800 flex flex-col h-full hover:-translate-y-1"
				>
					<!-- Logo/Icon Area -->
					<div class="flex items-start justify-between mb-4">
						<div
							class="flex-shrink-0 p-3 bg-slate-50 dark:bg-black rounded-xl border border-slate-100 dark:border-zinc-800"
						>
							<img
								src={product.image}
								alt={product.name}
								class="w-12 h-12 object-contain"
								loading="lazy"
							/>
						</div>
						<span
							class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
						>
							{product.category}
						</span>
					</div>

					<!-- Content -->
					<div class="flex-grow">
						<h3
							class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-accent transition-colors"
						>
							{product.name}
						</h3>
						<p class="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
							{product.description}
						</p>
					</div>

					<!-- Action -->
					<div class="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800">
						<a
							href={product.link}
							class="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
						>
							Visit Website
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

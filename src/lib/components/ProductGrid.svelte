<script lang="ts">
	import jsonEdit from '$lib/assets/products/json-edit.png';
	// import lidBlow from '$lib/assets/products/lidblow.png';
	import raxtOS from '$lib/assets/products/raxt.png';
	import localmod from '$lib/assets/products/LocalMOD.png';
	import mintMvp from '$lib/assets/products/mintmvp.png';
	import writerr from '$lib/assets/products/writerr.png';

	const products = [
		{
			name: 'Raxt OS',
			image: raxtOS,
			category: 'Operating System',
			description: 'Worlds first Ai based operating system kernel made in rust',
			link: 'https://www.raxt.org/'
		},
		{
			name: 'MintMVP',
			image: mintMvp,
			category: 'Agency',
			description: 'MVP Development Agency for your next project.',
			link: 'https://mintmvp.com'
		},
		{
			name: 'LocalMod',
			image: localmod,
			category: 'Ai',
			description: 'Run AI Agents & AI Models locally on your machine.',
			link: 'https://localmod.softodesign.com/'
		},
		{
			name: 'Json Edit',
			image: jsonEdit,
			category: 'Tool',
			description: 'A powerful and intuitive JSON editor for developers.',
			link: 'https://json-edit.com/'
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

<section id="products" class="py-24 bg-slate-50 dark:bg-black/80 overflow-hidden">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
				Our Products
			</h2>
			<p class="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
				Tools and resources crafted to elevate your workflow and business.
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
			{#each products as product (product.name)}
				<div
					class="product-card group relative isolate overflow-hidden rounded-3xl border border-white/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-[1px] shadow-sm shadow-slate-200/70 dark:shadow-none transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/15"
				>
					<div
						class="relative z-10 flex h-full flex-col rounded-[1.45rem] bg-white/95 p-5 sm:p-6 backdrop-blur-xl dark:bg-black/80"
					>
						<div class="glitch-scan" aria-hidden="true"></div>

						<!-- Logo/Icon Area -->
						<div class="flex items-start justify-between gap-4 mb-6">
							<div
								class="logo-shell flex-shrink-0 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 shadow-inner shadow-white dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none"
							>
								<img
									src={product.image}
									alt={product.name}
									class="h-12 w-12 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
									loading="lazy"
								/>
							</div>
							<span
								class="inline-flex items-center rounded-full border border-purple-200/80 bg-purple-50 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-200"
							>
								{product.category}
							</span>
						</div>

						<!-- Content -->
						<div class="flex-grow">
							<h3
								class="glitch-title mb-3 text-xl font-extrabold tracking-tight text-slate-950 transition-colors group-hover:text-accent dark:text-white"
								data-text={product.name}
							>
								{product.name}
							</h3>
							<p class="text-sm sm:text-[0.95rem] text-slate-600 dark:text-zinc-400 leading-relaxed mb-6">
								{product.description}
							</p>
						</div>

						<!-- Action -->
						<div
							class="mt-auto border-t border-slate-100 pt-4 dark:border-zinc-800/80"
						>
							<a
								href={product.link}
								class="inline-flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-accent transition-all duration-300 hover:bg-purple-50 hover:text-accent-hover dark:bg-zinc-900 dark:text-purple-300 dark:hover:bg-purple-500/10 dark:hover:text-purple-200"
							>
								<span>Visit Website</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
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
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.product-card::before {
		position: absolute;
		inset: -1px;
		z-index: -2;
		content: '';
		background:
			linear-gradient(120deg, transparent 20%, rgb(168 85 247 / 0.28), transparent 44%),
			linear-gradient(135deg, rgb(99 102 241 / 0.24), transparent 35%, rgb(236 72 153 / 0.22));
		opacity: 0;
		transition:
			opacity 420ms ease,
			transform 420ms ease;
	}

	.product-card::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		content: '';
		background:
			linear-gradient(90deg, transparent, rgb(255 255 255 / 0.45), transparent),
			radial-gradient(circle at 20% 0%, rgb(168 85 247 / 0.16), transparent 34%);
		opacity: 0;
		transform: translateX(-35%);
		transition:
			opacity 300ms ease,
			transform 650ms ease;
	}

	.product-card:hover::before {
		opacity: 1;
		transform: scale(1.03);
	}

	.product-card:hover::after {
		opacity: 1;
		transform: translateX(35%);
	}

	.logo-shell {
		transition:
			transform 450ms ease,
			box-shadow 450ms ease,
			border-color 450ms ease;
	}

	.product-card:hover .logo-shell {
		border-color: rgb(168 85 247 / 0.35);
		box-shadow: 0 18px 45px rgb(124 58 237 / 0.14);
		transform: translateY(-2px);
	}

	.glitch-title {
		position: relative;
		width: fit-content;
	}

	.glitch-title::before,
	.glitch-title::after {
		position: absolute;
		inset: 0;
		content: attr(data-text);
		opacity: 0;
		pointer-events: none;
	}

	.glitch-title::before {
		color: rgb(6 182 212);
		transform: translate(-1px, 0);
	}

	.glitch-title::after {
		color: rgb(236 72 153);
		transform: translate(1px, 0);
	}

	.product-card:hover .glitch-title::before {
		animation: glitch-shift 650ms steps(2, end) infinite;
		opacity: 0.75;
	}

	.product-card:hover .glitch-title::after {
		animation: glitch-shift 520ms steps(2, end) infinite reverse;
		opacity: 0.65;
	}

	.glitch-scan {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.glitch-scan::before {
		position: absolute;
		inset: -40% 0;
		content: '';
		background: repeating-linear-gradient(
			to bottom,
			transparent 0 10px,
			rgb(124 58 237 / 0.08) 10px 12px
		);
		transform: translateY(-20%);
	}

	.product-card:hover .glitch-scan {
		animation: glitch-flicker 900ms steps(3, end) infinite;
		opacity: 1;
	}

	.product-card:hover .glitch-scan::before {
		animation: scan-lines 1400ms linear infinite;
	}

	@keyframes glitch-shift {
		0%,
		100% {
			clip-path: inset(0 0 72% 0);
			transform: translate(0);
		}
		20% {
			clip-path: inset(22% 0 48% 0);
			transform: translate(-3px, 1px);
		}
		45% {
			clip-path: inset(55% 0 18% 0);
			transform: translate(3px, -1px);
		}
		70% {
			clip-path: inset(8% 0 68% 0);
			transform: translate(-2px, -1px);
		}
	}

	@keyframes glitch-flicker {
		0%,
		100% {
			filter: none;
		}
		40% {
			filter: hue-rotate(18deg) saturate(1.25);
		}
		65% {
			filter: contrast(1.15);
		}
	}

	@keyframes scan-lines {
		to {
			transform: translateY(20%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.product-card,
		.product-card::before,
		.product-card::after,
		.logo-shell,
		.glitch-title::before,
		.glitch-title::after,
		.glitch-scan,
		.glitch-scan::before {
			animation: none !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>

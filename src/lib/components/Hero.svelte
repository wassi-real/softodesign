<script lang="ts">
	import { fade, fly } from 'svelte/transition';
</script>

<section
	class="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden bg-white dark:bg-black transition-colors duration-300"
>
	<!-- Animated Grid Background -->
	<div class="absolute inset-0 z-0 overflow-hidden opacity-60 dark:opacity-50 pointer-events-none">
		<div
			class="absolute -inset-[100%] w-[300%] h-[300%] animate-[grid-move_20s_linear_infinite]"
			style="background-image: linear-gradient(to right, #80808040 1px, transparent 1px), linear-gradient(to bottom, #80808040 1px, transparent 1px); background-size: 40px 40px;"
		></div>
	</div>

	<!-- Background Decorations (Blobs) -->
	<div
		class="absolute top-0 transform -translate-x-1/2 left-1/2 w-full h-full z-0 pointer-events-none opacity-40 dark:opacity-30"
	>
		<div
			class="absolute top-[20%] left-[20%] w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"
		></div>
		<div
			class="absolute top-[20%] right-[20%] w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"
		></div>
		<div
			class="absolute bottom-[20%] left-[40%] w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"
		></div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
		<div in:fly={{ y: 20, duration: 800, delay: 200 }} class="mx-auto max-w-3xl">
			<h1
				class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8"
			>
				Crafting Digital <br class="hidden sm:block" />
				<span
					class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400"
					>Masterpieces</span
				>
			</h1>

			<p
				class="mt-4 text-xl sm:text-2xl text-slate-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed"
			>
				We are a parent company of multiple companies and projects. A hub for multiple tools and resources for developers, designers, and entrepreneurs, etc.
			</p>

			<div class="mt-10 flex gap-4 justify-center">
				<a
					href="#products"
					class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-2xl text-white bg-accent hover:bg-accent-hover dark:bg-accent dark:hover:bg-purple-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
				>
					Explore Products
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="ml-2 w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
					</svg>
				</a>
				<a
					href="#contact"
					class="inline-flex items-center px-8 py-4 border border-slate-200 dark:border-zinc-700 text-lg font-medium rounded-2xl text-slate-700 dark:text-zinc-200 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
				>
					Contact Us
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes blob {
		0% {
			transform: translate(0px, 0px) scale(1);
		}
		33% {
			transform: translate(30px, -50px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		100% {
			transform: translate(0px, 0px) scale(1);
		}
	}
	.animate-blob {
		animation: blob 7s infinite;
	}
	.animation-delay-2000 {
		animation-delay: 2s;
	}
	.animation-delay-4000 {
		animation-delay: 4s;
	}
	/* Using global keyframe for grid now */
</style>

<script lang="ts">
	import { goto } from '$app/navigation';

	let query = $state('');

	function handleSearch() {
		if (query.trim()) {
			goto(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSearch();
		}
	}
</script>

<div class="relative flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] px-3 sm:px-4 md:px-6 text-center overflow-hidden bg-gradient-to-br from-white via-purple-50/20 to-gray-50">
	<!-- Animated Grid Background -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute inset-0 bg-[linear-gradient(to_right,#d1d5db_1px,transparent_1px),linear-gradient(to_bottom,#d1d5db_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:40px_40px] opacity-[0.2] sm:opacity-[0.3] animate-[gridMove_20s_linear_infinite]"></div>
	</div>

	<!-- Main Content -->
	<div class="relative z-10 w-full max-w-5xl mx-auto">
		<!-- Logo with animation -->
		<!-- <div class="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center">
			<div class="relative transition-transform duration-300 hover:scale-110 hover:rotate-6">
				<img 
					src="/logo.png" 
					alt="SoftoDesign logo" 
					class="h-12 w-auto sm:h-16 md:h-20 animate-[logoFloat_3s_ease-in-out_infinite]" 
				/>
			</div>
		</div> -->
		<br>
		<br>
		<!-- Main Title with fade-in animation -->
		<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4 animate-[fadeInUp_0.8s_ease-out] leading-tight">
			Everything a founder needs to start and scale 🚀
		</h1>

		<!-- Subtitle with delay -->
		<p class="text-sm sm:text-base md:text-lg lg:text-xl text-black/70 mb-6 sm:mb-8 md:mb-12 max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-4 animate-[fadeInUp_1s_ease-out]">
			Discover tools, agencies, and services to build your business — all in one trusted directory.
		</p>

		<!-- Search Bar with animation -->
		<div class="w-full max-w-xs sm:max-w-md md:max-w-2xl mx-auto px-2 sm:px-4 animate-[fadeInUp_1.2s_ease-out]">
			<div class="relative group">
				<input
					type="text"
					placeholder="Search tools, agencies, founders..."
					bind:value={query}
					onkeydown={handleKeydown}
					class="w-full px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 text-sm sm:text-base md:text-lg bg-white/95 backdrop-blur-md border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500 text-black placeholder-gray-400 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-purple-300 hover:scale-[1.01]"
				/>
				<button
					onclick={handleSearch}
					class="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-all duration-300 p-2 sm:p-2.5 hover:bg-purple-50 rounded-xl hover:scale-110"
					aria-label="Search"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Separator -->
		<div class="mt-4 sm:mt-6 flex items-center justify-center gap-3 text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-[0.3em] animate-[fadeInUp_1.3s_ease-out]">
			<span class="h-px w-8 sm:w-10 bg-gray-200"></span>
			or
			<span class="h-px w-8 sm:w-10 bg-gray-200"></span>
		</div>

		<!-- Primary CTA Button -->
		<div class="mt-6 sm:mt-8 animate-[fadeInUp_1.35s_ease-out]">
			<a
				href="/dashboard/submit"
				class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 hover:scale-[1.03]"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
				</svg>
				Create your business
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>
		<br>
		<br>
		<!-- Quick Links -->
		<!-- <div class="mt-8 sm:mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 animate-[fadeInUp_1.4s_ease-out]">
			<a href="/tools" class="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer">
				<div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-200">
					🛠️
				</div>
				<span class="text-xs sm:text-sm text-black/70 font-medium">SaaS Tools</span>
			</a>
			<a href="/agencies" class="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer">
				<div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-200">
					🏢
				</div>
				<span class="text-xs sm:text-sm text-black/70 font-medium">Agencies</span>
			</a>
			<a href="/founders" class="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer">
				<div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-200">
					👥
				</div>
				<span class="text-xs sm:text-sm text-black/70 font-medium">Founders</span>
			</a>
			<a href="/dashboard" class="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer">
				<div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-200">
					📊
				</div>
				<span class="text-xs sm:text-sm text-black/70 font-medium">Dashboard</span>
			</a>
		</div> -->
	</div>
</div>

<style>
	@keyframes gridMove {
		0% {
			transform: translateX(0) translateY(0);
		}
		50% {
			transform: translateX(40px) translateY(40px);
		}
		100% {
			transform: translateX(0) translateY(0);
		}
	}

	@keyframes logoFloat {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>

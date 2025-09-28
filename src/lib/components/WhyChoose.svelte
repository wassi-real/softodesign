<div class="bg-purple-700 py-16 md:py-20 lg:py-24 relative overflow-hidden">
	<!-- Animated Grid Background Pattern -->
	<div class="absolute inset-0 opacity-10 animate-grid-float">
		<svg class="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
			<defs>
				<pattern id="why-choose-grid" width="8" height="8" patternUnits="userSpaceOnUse">
					<path d="M 8 0 L 0 0 0 8" fill="none" stroke="#FFFFFF" stroke-width="0.3"/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#why-choose-grid)" />
		</svg>
	</div>
	
	<!-- Additional Animated Grid Overlay for Better Coverage -->
	<div class="absolute inset-0 opacity-5 animate-grid-pulse">
		<div class="w-full h-full animate-grid-move" style="background-image: radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0); background-size: 20px 20px;"></div>
	</div>

	<div class="max-w-7xl mx-auto px-4 relative z-10">
		<!-- Header Section -->
		<div class="text-center mb-12 lg:mb-16">
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
				Why Choose SoftoDesign
			</h2>
			<p class="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto italic">
				We're Not Just Another Tech Company. We're Your Strategic Partner In Digital Transformation.
			</p>
		</div>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
			<!-- Human-Centered Design -->
			<div class="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-700">
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
								<circle cx="12" cy="7" r="4"/>
							</svg>
						</div>
					</div>
					<div class="flex-1">
						<h3 class="text-xl font-bold text-gray-900 mb-3">Human-Centered Design</h3>
						<p class="text-gray-600 leading-relaxed">
							Every decision starts with your user. We conduct thorough research to understand their needs, behaviors, and pain points.
						</p>
					</div>
				</div>
			</div>

			<!-- Agile & Flexible -->
			<div class="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-700">
								<polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
							</svg>
						</div>
					</div>
					<div class="flex-1">
						<h3 class="text-xl font-bold text-gray-900 mb-3">Agile & Flexible</h3>
						<p class="text-gray-600 leading-relaxed">
							Quick iterations, clear communication, and adaptive processes that evolve with your business needs.
						</p>
					</div>
				</div>
			</div>

			<!-- Long-Term Partners -->
			<div class="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-700">
								<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
								<line x1="8" y1="21" x2="16" y2="21"/>
								<line x1="12" y1="17" x2="12" y2="21"/>
							</svg>
						</div>
					</div>
					<div class="flex-1">
						<h3 class="text-xl font-bold text-gray-900 mb-3">Long-Term Partners</h3>
						<p class="text-gray-600 leading-relaxed">
							We don't just deliver and disappear. We grow with your business, providing ongoing support and strategic guidance.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes grid-float {
		0%, 100% {
			transform: translateY(0px) translateX(0px);
		}
		25% {
			transform: translateY(-2px) translateX(1px);
		}
		50% {
			transform: translateY(-4px) translateX(-1px);
		}
		75% {
			transform: translateY(-2px) translateX(2px);
		}
	}

	@keyframes grid-pulse {
		0%, 100% {
			opacity: 0.05;
		}
		50% {
			opacity: 0.08;
		}
	}

	@keyframes grid-move {
		0% {
			background-position: 0px 0px;
		}
		100% {
			background-position: 20px 20px;
		}
	}

	.animate-grid-float {
		animation: grid-float 8s ease-in-out infinite;
	}

	.animate-grid-pulse {
		animation: grid-pulse 4s ease-in-out infinite;
	}

	.animate-grid-move {
		animation: grid-move 15s linear infinite;
	}

	/* Performance optimizations */
	.animate-grid-float,
	.animate-grid-pulse,
	.animate-grid-move {
		will-change: transform, opacity, background-position;
		backface-visibility: hidden;
		perspective: 1000px;
	}
</style>
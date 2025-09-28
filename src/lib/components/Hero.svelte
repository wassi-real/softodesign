<div class="bg-white pt-24 md:pt-32 lg:pt-36 pb-12 md:pb-16 lg:pb-20 relative overflow-hidden min-h-screen">
	<!-- Animated Grid Background Pattern -->
	<div class="absolute inset-0 opacity-10 animate-grid-float">
		<svg class="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
			<defs>
				<pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
					<path d="M 8 0 L 0 0 0 8" fill="none" stroke="#6B46C1" stroke-width="0.3"/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid)" />
		</svg>
	</div>
	
	<!-- Additional Animated Grid Overlay for Better Coverage -->
	<div class="absolute inset-0 opacity-5 animate-grid-pulse">
		<div class="w-full h-full animate-grid-move" style="background-image: radial-gradient(circle at 1px 1px, #6B46C1 1px, transparent 0); background-size: 20px 20px;"></div>
	</div>
	
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="container mx-auto">
			<div class="hero-wrapper">
				<div class="flex flex-col lg:flex-row items-center justify-between min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] gap-6 md:gap-8 lg:gap-12">
					<div class="hero-content flex-1 flex flex-col items-start justify-center text-left w-full lg:w-auto px-2 sm:px-4 md:px-0">
						<div class="text-container max-w-3xl">
							<!-- Badge -->
							<div class="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-purple-50 border border-purple-200 rounded-full text-purple-700 text-xs md:text-sm font-medium mb-4 md:mb-6">
								<span class="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
								Founded in 2023 • Bangladesh
							</div>
							
							<div class="heading-container">
								<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 md:mb-6 lg:mb-8 leading-tight">
									Welcome to the Future of
									<span class="text-purple-700 relative block mt-1 md:mt-2">
										Digital Innovation
										<svg class="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M2 10C20 3 40 1 60 2C80 3 100 6 120 4C140 2 160 1 180 3C185 3.5 190 4 195 5" stroke="#6B46C1" stroke-width="2" stroke-linecap="round" fill="none"/>
										</svg>
									</span>
								</h1>
							</div>
							
							<div class="subtitle-container">
								<p class="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 lg:mb-12 leading-relaxed max-w-2xl">
									A creative technology company focused on building innovative solutions. We provide tech services to help businesses transform their ideas into reality.
								</p>
							</div>
							
							<!-- Stats -->
							
						</div>
					</div>
					
					<!-- Image section -->
					<div class="hero-image flex-1 flex items-center justify-center w-full lg:w-auto mt-6 lg:mt-0">
						<div class="image-container relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
							<!-- Floating Elements -->
							<div class="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-purple-100 rounded-xl md:rounded-2xl rotate-12 opacity-60"></div>
							<div class="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full opacity-60"></div>
							<div class="absolute top-1/2 -right-4 sm:-right-6 md:-right-8 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-pink-100 rounded-md md:rounded-lg -rotate-12 opacity-60"></div>
							
							<div class="image-wrapper relative">
								<div class="absolute inset-0 bg-purple-200 rounded-xl md:rounded-2xl transform rotate-2 md:rotate-3 opacity-20"></div>
								<img 
									src="/main.png" 
									alt="SoftoDesign" 
									class="relative w-full h-auto object-contain border border-white md:border-2 rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300"
								/>
							</div>
						</div>
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

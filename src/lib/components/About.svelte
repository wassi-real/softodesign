<script lang="ts">
	import wassi from '$lib/assets/wassi.jpg';
</script>

<section id="about" class="py-24 bg-slate-50 dark:bg-black overflow-hidden relative">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Profile Card -->
		<div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
			<div class="lg:grid lg:grid-cols-2 gap-0">
				<!-- Left Section: Image -->
				<div class="relative">
					<img
						src={wassi}
						alt="Al Wassi Khan"
						class="w-full h-full object-cover aspect-square lg:aspect-auto lg:h-full"
					/>
				</div>

				<!-- Right Section: Text Content -->
				<div class="p-8 lg:p-12 flex flex-col justify-center">
					<!-- Name -->
					<h2 class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-3">
						Al Wassi Khan
					</h2>

					<!-- Tagline -->
					<p class="text-lg sm:text-xl text-blue-600 dark:text-blue-400 mb-6 font-medium">
						19 y/o Solopreneur crafting digital dreams from Bangladesh
					</p>

					<!-- About Me -->
					<p class="text-base text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
						I'm a passionate entrepreneur and developer with a burning desire to create tech that
						matters. My focus is on solving real problems and transforming lives, especially in
						emerging economies like Bangladesh.
					</p>

					<!-- Interests -->
					<p class="text-base text-slate-600 dark:text-zinc-400 mb-8 leading-relaxed">
						When I'm not coding or brainstorming, I love connecting with fellow entrepreneurs and
						learning to stay ahead of the tech curve.
					</p>

					<!-- Social Links -->
					<div class="flex items-center gap-6 flex-wrap">
						<a
							href="https://twitter.com/wassireal"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2] transition-colors group"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
								/>
							</svg>
							<span class="text-sm font-medium">@wassireal</span>
						</a>

						<a
							href="https://linkedin.com/in/alwassikhan"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors group"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm font-medium">alwassikhan</span>
						</a>

						<a
							href="https://alwassikhan.com"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
								/>
							</svg>
							<span class="text-sm font-medium">alwassikhan.com</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

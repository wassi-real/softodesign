<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const founder = $derived(data.founder);
	const stack = $derived(data.stack || []);
	const agencies = $derived(data.agencies || []);
	const socialLinks = $derived(founder?.social_links || {});
</script>

<div class="min-h-screen bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		{#if founder}
			<!-- Back Button -->
			<a href="/founders" class="inline-flex items-center gap-2 text-black/70 hover:text-black mb-8 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				<span>Back to Founders</span>
			</a>

			<!-- Header -->
			<div class="mb-12">
				<div class="flex items-center gap-6 mb-6">
					<div class="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
						{#if founder.pfp}
							<img src={founder.pfp} alt={founder.founder_name} class="w-full h-full object-cover" />
						{:else}
							<span class="text-5xl font-bold text-purple-600">{founder.founder_name?.charAt(0) || 'F'}</span>
						{/if}
					</div>
					<div class="flex-1">
						<div class="flex items-center gap-3 mb-2">
							<h1 class="text-4xl font-bold text-black">{founder.founder_name || 'Founder'}</h1>
							{#if founder.verified}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
							{/if}
						</div>
						
						<!-- Social Links -->
						{#if Object.keys(socialLinks).length > 0}
							<div class="flex flex-wrap gap-3">
								{#if socialLinks.twitter}
									<a
										href={socialLinks.twitter}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-black transition-colors"
										onclick={(e) => e.stopPropagation()}
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
										</svg>
										<span class="text-sm">Twitter</span>
									</a>
								{/if}
								{#if socialLinks.linkedin}
									<a
										href={socialLinks.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-black transition-colors"
										onclick={(e) => e.stopPropagation()}
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
										</svg>
										<span class="text-sm">LinkedIn</span>
									</a>
								{/if}
								{#if socialLinks.github}
									<a
										href={socialLinks.github}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-black transition-colors"
										onclick={(e) => e.stopPropagation()}
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
											<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
										</svg>
										<span class="text-sm">GitHub</span>
									</a>
								{/if}
								{#if socialLinks.website}
									<a
										href={socialLinks.website}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-black transition-colors"
										onclick={(e) => e.stopPropagation()}
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
										</svg>
										<span class="text-sm">Website</span>
									</a>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				{#if founder.bio}
					<p class="text-lg text-black/70 max-w-3xl">{founder.bio}</p>
				{/if}
			</div>

			<!-- Stack Section -->
			{#if stack.length > 0}
				<div class="mb-12">
					<h2 class="text-2xl font-bold text-black mb-6">Tools Used</h2>
					<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{#each stack as tool}
							<a
								href="/tools/{tool.slug || tool.id}"
								class="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
							>
								<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
									{#if tool.logo_url}
										<img src={tool.logo_url} alt={tool.name} class="w-full h-full object-cover rounded-lg" />
									{:else}
										<span class="text-lg font-bold text-purple-600">{tool.name?.charAt(0) || 'T'}</span>
									{/if}
								</div>
								<p class="text-sm text-black text-center font-medium line-clamp-2">{tool.name}</p>
							</a>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Agencies Section -->
			{#if agencies.length > 0}
				<div>
					<h2 class="text-2xl font-bold text-black mb-6">Agencies Hired</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each agencies as agency}
							<a
								href="/agencies/{agency.slug || agency.id}"
								class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
							>
								<div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
									{#if agency.logo_url}
										<img src={agency.logo_url} alt={agency.name} class="w-full h-full object-cover rounded-lg" />
									{:else}
										<span class="text-xl font-bold text-purple-600">{agency.name?.charAt(0) || 'A'}</span>
									{/if}
								</div>
								<div>
									<h3 class="font-bold text-black">{agency.name}</h3>
									{#if agency.website_url}
										<p class="text-sm text-black/60">Visit →</p>
									{/if}
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

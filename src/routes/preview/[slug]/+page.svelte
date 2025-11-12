<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const app = data.app;

	function goBack() {
		goto('/dashboard');
	}
</script>

<div class="fixed inset-0 bg-white flex flex-col">
	<!-- Header Bar -->
	<div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white z-10">
		<div class="flex items-center gap-3">
			<button
				onclick={goBack}
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				aria-label="Back to Dashboard"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-black"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
			</button>
			{#if app.logo_url}
				<img src={app.logo_url} alt={app.name} class="w-8 h-8 rounded" />
			{:else}
				<div class="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
					<span class="text-sm font-bold text-purple-600">{app.name.charAt(0)}</span>
				</div>
			{/if}
			<h1 class="text-lg font-bold text-black">{app.name}</h1>
			{#if app.verified}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-purple-600"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</div>
	</div>

	<!-- App Content (Fullscreen iframe) -->
	<div class="flex-1 overflow-hidden">
		{#if app.storage_path}
			<!-- App hosted in Supabase Storage -->
			<iframe
				src={`/apps/${app.slug}?path=index.html`}
				sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
				class="w-full h-full border-0"
				title={app.name}
			></iframe>
		{:else if app.entry_url}
			<!-- External URL app -->
			<iframe
				src={app.entry_url}
				sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
				class="w-full h-full border-0"
				title={app.name}
			></iframe>
		{:else}
			<!-- Error state -->
			<div class="flex items-center justify-center h-full">
				<div class="text-center">
					<p class="text-black/70 text-lg mb-2">App not available</p>
					<button
						onclick={goBack}
						class="text-purple-600 hover:text-purple-700 font-medium"
					>
						← Back to Dashboard
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

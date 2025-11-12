<script lang="ts">
	import { goto } from '$app/navigation';

	export let status: number;
	export let error: Error;

	const title = status === 404 ? 'Page Not Found' : 'Something went wrong';
	const description =
		status === 404
			? "The page you're looking for might have been removed, had its name changed, or is temporarily unavailable."
			: error?.message || 'An unexpected error occurred. Please try again later.';

	function goHome() {
		goto('/');
	}
</script>

<svelte:head>
	<title>{status} • SoftoDesign</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16">
	<div class="max-w-2xl text-center space-y-8">
		<div class="space-y-4">
			<p class="text-sm font-semibold uppercase tracking-wide text-purple-600">Error {status}</p>
			<h1 class="text-4xl sm:text-5xl font-bold text-black">{title}</h1>
			<p class="text-base sm:text-lg text-black/70 leading-relaxed">{description}</p>
		</div>

		<div class="flex flex-wrap items-center justify-center gap-3">
			<button
				onclick={goHome}
				class="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Home
			</button>

			<a
				href="/dashboard"
				class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-black transition hover:border-purple-300 hover:text-purple-600"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582c1.474 0 2.216 0 2.75.29a2 2 0 01.878.878C8.5 10.682 8.5 11.424 8.5 12.898V21" />
				</svg>
				Go to Dashboard
			</a>
		</div>

		<div class="text-xs text-black/50">
			<p>
				Need something?
				<a href="mailto:hello@softodesign.com" class="text-purple-600 hover:text-purple-700 font-medium">Contact support</a>.
			</p>
		</div>
	</div>
</div>


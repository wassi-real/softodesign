<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Page Not Found - SoftoDesign Labs</title>
</svelte:head>

<div class="bg-white pt-28 pb-16">
	<div class="max-w-4xl mx-auto px-4 text-center">
		
		<!-- Error Code -->
		<div class="mb-8">
			<h1 class="text-6xl font-bold text-gray-400 mb-4">404</h1>
			<h2 class="text-2xl font-bold text-black mb-4">Page Not Found</h2>
		</div>

		<!-- Error Message -->
		<div class="mb-12">
			<p class="text-gray-600 mb-4">
				The page you're looking for doesn't exist.
			</p>
			<p class="text-gray-500 text-sm">
				URL: {$page.url.pathname}
			</p>
		</div>

		<!-- Simple Actions -->
		<div class="space-y-4">
			<div>
				<a href="/" class="inline-block bg-white border border-gray-300 px-8 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium">
					Go Home
				</a>
			</div>
			<div>
				<button on:click={() => history.back()} class="text-gray-500 hover:text-gray-700 underline text-sm">
					Go Back
				</button>
			</div>
		</div>

	</div>
</div>

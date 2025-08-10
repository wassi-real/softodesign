<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Page Not Found | SoftoDesign Labs</title>
</svelte:head>

<div class="container-custom py-16 md:py-24 flex flex-col items-center text-center">
	<div class="w-full max-w-lg">
		<!-- Error code with gradient -->
		<h1 class="text-6xl font-bold text-gradient mb-6">{$page.status}</h1>
		
		<!-- Error message -->
		<h2 class="text-2xl md:text-3xl font-semibold mb-4">
			{$page.status === 404 ? 'Oops! Page not found' : 'Something went wrong'}
		</h2>
		
		<!-- Friendly explanation -->
		<p class="text-lg text-gray-600 mb-8">
			{#if $page.status === 404}
				We couldn't find the page you were looking for.
			{:else}
				Please try again later.
			{/if}
		</p>
		
		<!-- Navigation options -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a 
				href="/" 
				class="btn-primary"
			>
				Back to Home
			</a>
		</div>
	</div>
</div>
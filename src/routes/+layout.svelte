<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import UpdateBanner from '$lib/components/UpdateBanner.svelte';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<!-- <UpdateBanner /> -->
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>

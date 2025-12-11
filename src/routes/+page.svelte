<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import About from '$lib/components/About.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>SoftoDesign - Premium Design Resources</title>
	<meta
		name="description"
		content="Discover premium design resources, tools, and components for modern developers."
	/>
</svelte:head>

<div class="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300">
	<Navbar />

	<main class="flex-grow">
		<Hero />
		<ProductGrid />
		<About />
		<Faq />
	</main>

	<Footer />
</div>

<script lang="ts">
	import '../app.css';
	import favicon from '/logo.png';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const hideChrome = $derived(Boolean(page.url.pathname === '/auth'));
</script>

<svelte:head>
	<title>SoftoDesign</title>
	<link rel="icon" href={favicon} />
	<link rel="shortcut icon" href={favicon} type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/logo.png" />
	<meta name="application-name" content="SoftoDesign" />
	<meta name="title" content="SoftoDesign — Everything a founder needs to start and scale" />
	<meta
		name="description"
		content="Discover verified tools, agencies, and services to launch and grow your business. SoftoDesign is the modern directory for founders."
	/>
	<meta
		name="keywords"
		content="founder tools, saas directory, business agencies, startup stack, softodesign, b2b services, startup resources"
	/>
	<meta name="theme-color" content="#6d28d9" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="SoftoDesign" />
	<meta property="og:title" content="SoftoDesign — Everything a founder needs to start and scale" />
	<meta
		property="og:description"
		content="SoftoDesign is the trusted hub where founders discover SaaS tools, agencies, and services to build and scale their business."
	/>
	<meta property="og:image" content="https://softodesign.com/logo.png" />
	<meta property="og:url" content="https://softodesign.com" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="SoftoDesign — Everything a founder needs to start and scale" />
	<meta
		name="twitter:description"
		content="Browse verified tools, agencies, and services to build your startup stack faster."
	/>
	<meta name="twitter:image" content="https://softodesign.com/logo.png" />
</svelte:head>

<div class="min-h-screen bg-white flex flex-col">
	{#if !hideChrome}
		<Navbar />
	{/if}

	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	{#if !hideChrome}
		<Footer />
	{/if}
</div>

<Toast />

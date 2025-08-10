<script>
	import Cta from '$lib/components/Cta.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import GalleryHome from '$lib/components/GalleryHome.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Work from '$lib/components/Work.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>SoftoDesign</title>
	<meta name="description" content="Welcome to SoftoDesign Labs - Our Main site for Everything SoftoDesign" />
</svelte:head>

<Hero />
<Work/>
<!-- <GalleryHome/> -->
<Faq/>
<Cta/>




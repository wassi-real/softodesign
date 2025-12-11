<script lang="ts">
	import './layout.css';
	import whiteLogo from '$lib/assets/white-logo.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={whiteLogo} type="image/png" />
	<link rel="apple-touch-icon" href={whiteLogo} />
</svelte:head>

{@render children()}

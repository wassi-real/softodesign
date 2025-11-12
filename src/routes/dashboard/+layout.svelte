<script lang="ts">
	import type { LayoutData } from './$types';
	import FounderProfileModal from '$lib/components/FounderProfileModal.svelte';
	import { invalidateAll } from '$app/navigation';

	let { children, data }: { children: any; data: LayoutData } = $props();

	const founder = $derived(data.founder);
	const showModal = $derived(!founder || !founder.founder_name);

	let modalClosed = $state(false);

	function handleModalClose() {
		modalClosed = true;
		invalidateAll();
	}
</script>

{#if showModal && !modalClosed}
	<FounderProfileModal onClose={handleModalClose} />
{/if}

{@render children()}


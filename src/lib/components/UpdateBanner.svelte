<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import updatesData from '$lib/data/updates.json';

	// Get active updates only
	const activeUpdates = updatesData.updates.filter(update => update.active);
	
	// Banner state
	let currentUpdateIndex = 0;
	let showBanner = activeUpdates.length > 0;
	let rotationInterval;
	
	// Get current update
	$: currentUpdate = activeUpdates[currentUpdateIndex];
	
	// Get background color based on update type
	$: bgColorClass = getBgColorClass(currentUpdate?.type);
	
	function getBgColorClass(type) {
		switch(type) {
			case 'announcement':
				return 'bg-blue-500';
			case 'promotion':
				return 'bg-purple-600';
			case 'alert':
				return 'bg-red-500';
			default:
				return 'bg-gray-700';
		}
	}
	
	function nextUpdate() {
		currentUpdateIndex = (currentUpdateIndex + 1) % activeUpdates.length;
	}
	
	function closeBanner() {
		showBanner = false;
		if (rotationInterval) {
			clearInterval(rotationInterval);
		}
	}
	
	onMount(() => {
		// Set up auto-rotation if enabled and there are multiple updates
		if (updatesData.settings.autoRotate && activeUpdates.length > 1) {
			rotationInterval = setInterval(() => {
				nextUpdate();
			}, updatesData.settings.rotationInterval);
		}
	});
	
	onDestroy(() => {
		if (rotationInterval) {
			clearInterval(rotationInterval);
		}
	});
</script>

{#if showBanner && activeUpdates.length > 0}
	<div 
		class="relative {bgColorClass} text-white py-3 px-4 shadow-md"
		in:slide={{ duration: 300 }}
		out:fade={{ duration: 200 }}
	>
		<div class="container-custom flex items-center justify-between">
			<div class="flex items-center space-x-4">
				{#if activeUpdates.length > 1}
					<button 
						class="text-white/80 hover:text-white focus:outline-none" 
						on:click={nextUpdate}
						aria-label="Previous update"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
					</button>
				{/if}
				
				<div class="text-sm md:text-base font-medium">
					{#if currentUpdate.link}
						<a href={currentUpdate.link} class="hover:underline">
							{currentUpdate.message}
						</a>
					{:else}
						{currentUpdate.message}
					{/if}
				</div>
				
				{#if activeUpdates.length > 1}
					<button 
						class="text-white/80 hover:text-white focus:outline-none" 
						on:click={nextUpdate}
						aria-label="Next update"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
						</svg>
					</button>
				{/if}
			</div>
			
			{#if updatesData.settings.showCloseButton}
				<button 
					class="text-white/80 hover:text-white focus:outline-none" 
					on:click={closeBanner}
					aria-label="Close banner"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
					</svg>
				</button>
			{/if}
		</div>
		
		{#if activeUpdates.length > 1}
			<div class="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 pb-1">
				{#each activeUpdates as _, index}
					<span 
						class="h-1 w-2 rounded-full {index === currentUpdateIndex ? 'bg-white' : 'bg-white/40'}"
					></span>
				{/each}
			</div>
		{/if}
	</div>
{/if}
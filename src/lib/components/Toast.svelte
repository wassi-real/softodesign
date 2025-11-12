<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { browser } from '$app/environment';
	import type { Toast } from '$lib/stores/toast';

	let toasts = $state<Toast[]>([]);

	$effect(() => {
		if (browser) {
			const unsubscribe = toast.subscribe((value) => {
				toasts = value;
			});
			return unsubscribe;
		}
	});

	function getIcon(type: string) {
		switch (type) {
			case 'success':
				return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
			case 'error':
				return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
			case 'warning':
				return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
			default:
				return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
		}
	}

	function getColors(type: string) {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800';
			default:
				return 'bg-blue-50 border-blue-200 text-blue-800';
		}
	}
</script>

{#if browser}
	<div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
		{#each toasts as toastItem (toastItem.id)}
			<div
				class="pointer-events-auto animate-slide-down {getColors(toastItem.type)} border rounded-xl shadow-lg p-4 flex items-start gap-3"
				role="alert"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 flex-shrink-0 mt-0.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d={getIcon(toastItem.type)} />
				</svg>
				<p class="flex-1 text-sm font-medium">{toastItem.message}</p>
				<button
					onclick={() => toast.remove(toastItem.id)}
					class="flex-shrink-0 text-current/60 hover:text-current transition-colors"
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}


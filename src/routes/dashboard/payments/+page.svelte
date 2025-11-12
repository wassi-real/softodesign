<script lang="ts">
	import type { PageData } from './$types';
	import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();
	const currentPath = $derived(page.url.pathname);
</script>

<div class="min-h-screen bg-gray-50">
	<DashboardSidebar currentPath={currentPath} />

	<div class="lg:ml-64 pt-16 lg:pt-0">
		<div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
			<h2 class="text-2xl sm:text-3xl font-bold text-black mb-6">My Payments</h2>
			{#if data.payments && data.payments.length > 0}
				<div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-gray-50 border-b border-gray-200">
								<tr>
									<th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Date</th>
									<th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Amount</th>
									<th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Status</th>
									<th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Type</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each data.payments as payment}
									<tr class="hover:bg-gray-50">
										<td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-black">
											{new Date(payment.created_at).toLocaleDateString()}
										</td>
										<td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
											${(payment.amount / 100).toFixed(2)}
										</td>
										<td class="px-4 sm:px-6 py-4 whitespace-nowrap">
											<span class="px-2 py-1 text-xs font-medium rounded {payment.status === 'completed'
												? 'bg-green-100 text-green-800'
												: payment.status === 'pending'
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-red-100 text-red-800'}">
												{payment.status}
											</span>
										</td>
										<td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-black/60">
											{payment.payment_type || 'N/A'}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{:else}
				<div class="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center">
					<p class="text-black/70 text-lg mb-4">No payment history</p>
				</div>
			{/if}
		</div>
	</div>
</div>

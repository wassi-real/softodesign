<script lang="ts">
	import type { PageData } from './$types';
	import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
	import { page } from '$app/state';
	import { signOut } from '$lib/auth';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	const currentPath = $derived(page.url.pathname);

	let loggingOut = $state(false);

	async function handleLogout() {
		loggingOut = true;
		try {
			await signOut();
			await fetch('/api/auth/session', { method: 'DELETE' });
			goto('/');
		} catch (err) {
			console.error('Logout error:', err);
			loggingOut = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<DashboardSidebar currentPath={currentPath} />

	<div class="lg:ml-64 pt-16 lg:pt-0">
		<div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
			<h2 class="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8">Settings</h2>

			<div class="space-y-6">
				<!-- Account Settings -->
				<div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
					<h3 class="text-lg sm:text-xl font-bold text-black mb-4">Account Settings</h3>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-black mb-2">Email</label>
							<input
								type="email"
								value={data.user?.email || ''}
								disabled
								class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black/60 cursor-not-allowed"
							/>
						</div>
					</div>
				</div>

				<!-- Danger Zone -->
				<div class="bg-white border-2 border-red-200 rounded-xl p-4 sm:p-6">
					<h3 class="text-lg sm:text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
					<div class="space-y-4">
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div>
								<h4 class="font-medium text-black mb-1">Log Out</h4>
								<p class="text-sm text-black/60">Sign out of your account</p>
							</div>
							<button
								onclick={handleLogout}
								disabled={loggingOut}
								class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
							>
								{loggingOut ? 'Logging out...' : 'Log Out'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

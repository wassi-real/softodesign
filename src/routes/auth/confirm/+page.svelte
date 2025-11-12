<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let email = $state('');

	$effect(() => {
		if (browser) {
			const urlParams = new URLSearchParams(window.location.search);
			email = urlParams.get('email') || '';
		}
	});
</script>

<div class="relative min-h-screen bg-white flex items-center justify-center px-4 overflow-hidden">
	<!-- Animated Grid Background -->
	<div class="absolute inset-0 pointer-events-none">
		<div class="w-full h-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.15] animate-pulse"></div>
	</div>

	<div class="relative w-full max-w-md z-10">
		<!-- Logo -->
		<div class="mb-8 flex justify-center">
			<img src="/logo.png" alt="SoftoDesign logo" class="h-12 w-auto" />
		</div>

		<!-- Confirmation Card -->
		<div class="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-xl p-8 shadow-sm text-center">
			<!-- Success Icon -->
			<div class="mb-6 flex justify-center">
				<div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
			</div>

			<h1 class="text-2xl font-bold text-black mb-3">Check Your Email</h1>
			
			<p class="text-black/70 mb-6">
				We've sent a confirmation link to
			</p>
			
			{#if email}
				<p class="text-lg font-semibold text-purple-600 mb-6 break-all">{email}</p>
			{/if}

			<div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 text-left">
				<p class="text-sm text-black/80 mb-2">
					<strong>Next steps:</strong>
				</p>
				<ol class="text-sm text-black/70 space-y-2 list-decimal list-inside">
					<li>Check your email inbox (and spam folder)</li>
					<li>Click the confirmation link in the email</li>
					<li>Return here to sign in and complete your founder profile</li>
				</ol>
			</div>

			<div class="space-y-4">
				<button
					onclick={() => goto('/auth')}
					class="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
				>
					Go to Sign In
				</button>
				
				<a
					href="/"
					class="block text-center text-purple-600 hover:text-purple-700 font-medium text-sm"
				>
					← Back to home
				</a>
			</div>

			<div class="mt-6 pt-6 border-t border-gray-200">
				<p class="text-xs text-black/60">
					Didn't receive the email? Check your spam folder or try signing up again.
				</p>
			</div>
		</div>
	</div>
</div>


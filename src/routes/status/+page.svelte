<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	
	let currentTime = '';
	let uptime = '';
	
	onMount(() => {
		const updateTime = () => {
			currentTime = new Date().toLocaleString();
		};
		
		updateTime();
		const interval = setInterval(updateTime, 1000);
		
		// Calculate uptime (simplified - shows time since page load)
		const startTime = Date.now();
		const updateUptime = () => {
			const now = Date.now();
			const diff = now - startTime;
			const seconds = Math.floor(diff / 1000);
			const minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			
			if (hours > 0) {
				uptime = `${hours}h ${minutes % 60}m ${seconds % 60}s`;
			} else if (minutes > 0) {
				uptime = `${minutes}m ${seconds % 60}s`;
			} else {
				uptime = `${seconds}s`;
			}
		};
		
		updateUptime();
		const uptimeInterval = setInterval(updateUptime, 1000);
		
		return () => {
			clearInterval(interval);
			clearInterval(uptimeInterval);
		};
	});
</script>

<svelte:head>
	<title>Status - SoftoDesign Labs</title>
	<meta name="description" content="Website status page for SoftoDesign Labs" />
</svelte:head>

<!-- Status Page Section -->
<section class="py-24 relative overflow-hidden min-h-screen flex items-center">
	<!-- Background decorative elements -->
	<div class="absolute top-0 left-0 w-full h-64 bg-purple-100 opacity-50 -skew-y-6 transform -translate-y-32"></div>
	<div class="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full opacity-30 transform translate-x-1/4 -translate-y-1/4"></div>
	<div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
	
	<div class="container-custom relative z-10">
		<!-- Status Header -->
		<div class="text-center mb-12" in:fade={{ duration: 500, delay: 200 }}>
			<span class="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
				System Status
			</span>
			<div class="flex items-center justify-center gap-4 mb-6">
				<div class="relative">
					<div class="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
					<div class="absolute inset-0 w-6 h-6 bg-green-500 rounded-full animate-ping opacity-20"></div>
				</div>
				<h1 class="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
					All Systems Operational
				</h1>
			</div>
			<div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mb-6"></div>
			<p class="text-xl text-gray-700 max-w-2xl mx-auto">
				Website is up and running smoothly
			</p>
		</div>
		
		<!-- Status Cards Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
			<!-- Current Status Card -->
			<div 
				class="card hover-lift"
				in:fly={{ y: 30, duration: 600, delay: 400 }}
			>
				<div class="flex items-center gap-4 mb-4">
					<div class="p-3 bg-green-100 rounded-full">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900">Current Status</h3>
				</div>
				<div class="space-y-4">
					<div class="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg border border-green-200">
						<span class="font-medium text-gray-700">System Status:</span>
						<span class="font-semibold text-green-700 flex items-center gap-2">
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							Online
						</span>
					</div>
					<div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
						<span class="font-medium text-gray-700">Current Time:</span>
						<span class="font-mono text-gray-900">{currentTime}</span>
					</div>
					<div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
						<span class="font-medium text-gray-700">Page Uptime:</span>
						<span class="font-mono text-gray-900">{uptime}</span>
					</div>
				</div>
			</div>
			
			<!-- Services Status Card -->
			<div 
				class="card hover-lift"
				in:fly={{ y: 30, duration: 600, delay: 600 }}
			>
				<div class="flex items-center gap-4 mb-4">
					<div class="p-3 bg-purple-100 rounded-full">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900">Services</h3>
				</div>
				<div class="grid grid-cols-2 gap-3">
					{#each ['Website', 'API', 'Database', 'CDN'] as service, i}
						<div 
							class="flex items-center gap-3 py-3 px-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
							in:fly={{ x: -20, duration: 400, delay: 800 + (i * 100) }}
						>
							<div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
							<span class="font-medium text-gray-700">{service}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
		
		<!-- Performance Metrics -->
		<div 
			class="card max-w-2xl mx-auto text-center mb-12"
			in:fly={{ y: 30, duration: 600, delay: 800 }}
		>
			<div class="flex items-center justify-center gap-4 mb-6">
				<div class="p-3 bg-indigo-100 rounded-full">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<h3 class="text-xl font-bold text-gray-900">Performance Metrics</h3>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="text-center">
					<div class="text-3xl font-bold text-green-600 mb-2">99.9%</div>
					<div class="text-gray-600">Uptime</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-blue-600 mb-2">&lt;100ms</div>
					<div class="text-gray-600">Response Time</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-purple-600 mb-2">0</div>
					<div class="text-gray-600">Active Incidents</div>
				</div>
			</div>
		</div>
		
		<!-- Footer -->
		<div 
			class="text-center"
			in:fade={{ duration: 500, delay: 1000 }}
		>
			<div class="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
				<div class="w-2 h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse"></div>
				<span class="text-gray-700">
					Managed by <span class="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">SoftoDesign</span> team, 2025
				</span>
			</div>
		</div>
	</div>
</section>

<script>
	// Status page - minimal design
</script>

<svelte:head>
	<title>Status - SoftoDesign Labs</title>
	<meta name="description" content="System status and uptime information for SoftoDesign Labs services." />
</svelte:head>

<div class="bg-white pt-28 pb-16">
	<div class="max-w-4xl mx-auto px-4">
		
		<!-- Header -->
		<div class="mb-12">
			<h1 class="text-4xl font-bold text-black mb-4">System Status</h1>
			<p class="text-xl text-gray-600">
				Current status and uptime information for all SoftoDesign Labs services.
			</p>
		</div>

		<!-- Overall Status -->
		<div class="mb-16">
			<div class="border border-gray-200 p-8 rounded-lg">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold text-black">All Systems Operational</h2>
					<div class="flex items-center space-x-2">
						<div class="w-3 h-3 bg-green-500 rounded-full"></div>
						<span class="text-green-600 font-medium">Operational</span>
					</div>
				</div>
				<p class="text-gray-600 mt-2">All services are running normally.</p>
			</div>
		</div>

		<!-- Services Status -->
		<div class="mb-16">
			<h2 class="text-2xl font-bold text-black mb-6">Services</h2>
			<div class="space-y-4">
				<div class="border border-gray-200 p-6 rounded-lg">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-lg font-semibold text-black">Website</h3>
							<p class="text-gray-600">Main website and marketing pages</p>
						</div>
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							<span class="text-green-600 text-sm">Operational</span>
						</div>
					</div>
				</div>
				
				<div class="border border-gray-200 p-6 rounded-lg">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-lg font-semibold text-black">Platform</h3>
							<p class="text-gray-600">Main application and dashboard</p>
						</div>
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							<span class="text-green-600 text-sm">Operational</span>
						</div>
					</div>
				</div>
				
				<div class="border border-gray-200 p-6 rounded-lg">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-lg font-semibold text-black">API</h3>
							<p class="text-gray-600">Backend services and integrations</p>
						</div>
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							<span class="text-green-600 text-sm">Operational</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Contact -->
		<div class="border border-gray-200 p-8 rounded-lg text-center">
			<h2 class="text-2xl font-bold text-black mb-4">Having Issues?</h2>
			<p class="text-gray-600 mb-4">
				If you're experiencing problems that aren't reflected here, please contact our support team.
			</p>
			<a href="mailto:support@softodesign.com" class="text-gray-700 hover:text-gray-900 font-medium underline">
				support@softodesign.com
			</a>
		</div>

	</div>
</div>

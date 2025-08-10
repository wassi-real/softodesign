<script>
	// Import any necessary components or utilities
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>About Us | SoftoDesign Labs</title>
	<meta name="description" content="Learn about SoftoDesign Labs, our mission, values, and the team behind our innovative solutions." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
	<!-- Hero section -->
	<div class="mb-16 text-center" in:fade={{ duration: 300, delay: 150 }}>
		<h1 class="text-4xl md:text-5xl font-bold mb-6">About SoftoDesign Labs</h1>
		<p class="text-xl text-gray-700 max-w-3xl mx-auto">
			We're a creative technology company focused on building innovative solutions that help shape the future.
		</p>
	</div>
	
	<!-- Our story section -->
	<section class="mb-16" in:fade={{ duration: 300, delay: 300 }}>
		<h2 class="text-2xl md:text-3xl font-bold mb-6 text-gradient">Our Story</h2>
		<div class="prose prose-lg max-w-none">
			<p>
				Founded in 2023 in Bangladesh, SoftoDesign began with a simple mission: Subscription based Graphic Design Solutions.
				What started as a small design agency now converted into a tech company with a mission to provide the best 
				solutions to our clients.
			</p>
			<p>
				We believe that great design and powerful technology should work together seamlessly. Our approach combines 
				cutting-edge technical expertise with human-centered design principles to create solutions that are both 
				innovative and intuitive.
			</p>
			<p>
				Today, we partner with businesses to transform their ideas into reality, helping them navigate 
				the ever-changing digital landscape with confidence.
			</p>
		</div>
	</section>
	
	<!-- Our values section -->
	<section class="mb-16" in:fade={{ duration: 300, delay: 450 }}>
		<h2 class="text-2xl md:text-3xl font-bold mb-6 text-gradient">Our Values</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="card">
				<h3 class="text-xl font-semibold mb-3">Innovation</h3>
				<p>We constantly push boundaries and explore new possibilities to create solutions that stand out.</p>
			</div>
			<div class="card">
				<h3 class="text-xl font-semibold mb-3">Quality</h3>
				<p>We're committed to excellence in everything we do, from code to design to customer service.</p>
			</div>
			<div class="card">
				<h3 class="text-xl font-semibold mb-3">Collaboration</h3>
				<p>We believe the best results come from working together, both within our team and with our clients.</p>
			</div>
			<div class="card">
				<h3 class="text-xl font-semibold mb-3">Impact</h3>
				<p>We measure our success by the positive difference our work makes for our clients and their users.</p>
			</div>
		</div>
	</section>
	
	<!-- Founder section -->
	<section class="mb-16" in:fade={{ duration: 300, delay: 600 }}>
		<h2 class="text-2xl md:text-3xl font-bold mb-8 text-gradient">Meet Our Founder</h2>
		
		<div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
			<div class="md:flex">
				<div class="md:shrink-0">
					<img 
						class="h-48 w-full object-cover md:h-full md:w-48" 
						src="pfp.jpg" 
						alt="Founder of SoftoDesign Labs"
					/>
				</div>
				<div class="p-8">
					<div class="uppercase tracking-wide text-sm text-purple-700 font-semibold">Founder & CEO</div>
					<h3 class="mt-1 text-2xl font-semibold">Al Wassi Khan</h3>
					<p class="mt-2 text-gray-600">
						My name is Wassi and I am the founder of SoftoDesign. I am also a student who is pursuing my education and working for this business at the same time. I have a lot of goals and aspirations in life 😃. Hope
						I could make a good change in the world 😁.
					</p>
					
					<div class="mt-4">
						<h4 class="text-sm font-medium text-gray-500 mb-2">Contact</h4>
						<p class="text-gray-700 mb-1">
							<span class="inline-block w-5 mr-2">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
							</span>
							+880 1942095596
						</p>
						<p class="text-gray-700">
							<span class="inline-block w-5 mr-2">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
							</span>
							wassi@softodesign.com
						</p>
					</div>
					
					<div class="mt-6">
						<h4 class="text-sm font-medium text-gray-500 mb-2">Connect</h4>
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<div class="flex space-x-4">
							<!-- svelte-ignore a11y_consider_explicit_label -->
							<a href="https://twitter.com/wassireal" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-purple-700 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
							</a>
							<a href="https://linkedin.com/in/alwassikhan" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-purple-700 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
							</a>
							<a href="https://github.com/alwassikhan" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-purple-700 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
							</a>
							<a href="https://alwassikhan.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-purple-700 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="10"></circle>
									<ellipse cx="12" cy="12" rx="4" ry="10"></ellipse>
									<line x1="2" y1="12" x2="22" y2="12"></line>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	
	<!-- Call to action -->
	<section class="text-center py-8 px-6 bg-purple-50 rounded-xl border border-purple-100" in:fade={{ duration: 300, delay: 750 }}>
		<h2 class="text-2xl font-bold mb-4">Want to work with us?</h2>
		<p class="text-lg text-gray-700 mb-6">
			We're always looking for new challenges and opportunities to create amazing solutions.
		</p>
		<a href="/contact" class="btn-primary inline-block">Get in Touch</a>
	</section>
	
	<div class="mt-12">
		<a href="/" class="text-purple-700 hover:underline flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
			Back to Home
		</a>
	</div>
</div>
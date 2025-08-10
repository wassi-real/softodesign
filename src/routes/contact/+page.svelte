<script>
	import { fade, fly } from 'svelte/transition';
	
	// Form state
	let name = '';
	let email = '';
	let subject = '';
	let message = '';
	let isSubmitting = false;
	let formSubmitted = false;
	let formError = false;
	
	// Handle form submission
	async function handleSubmit() {
		isSubmitting = true;
		
		try {
			// Here you would typically send the form data to your backend
			// For now, we'll simulate a successful submission after a delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Reset form
			name = '';
			email = '';
			subject = '';
			message = '';
			
			formSubmitted = true;
			formError = false;
		} catch (error) {
			console.error('Error submitting form:', error);
			formError = true;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Contact Us | SoftoDesign Labs</title>
	<meta name="description" content="Get in touch with SoftoDesign Labs. We're here to answer your questions and help with your projects." />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
	<!-- Hero section with gradient background -->
	<div class="mb-20 text-center relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 py-16 px-6 shadow-sm border border-purple-100" in:fade={{ duration: 300, delay: 150 }}>
		<!-- Decorative elements -->
		<div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
			<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="absolute -top-10 -left-10 text-purple-700 transform rotate-12"><path d="M12 5v14M5 12h14"></path></svg>
			<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="absolute bottom-4 right-4 text-indigo-700"><circle cx="12" cy="12" r="10"></circle></svg>
		</div>
		
		<div class="relative z-10">
			<h1 class="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
			<p class="text-xl text-gray-700 max-w-3xl mx-auto">
				Have a question or want to work with us? We'd love to hear from you.
			</p>
		</div>
	</div>
	
	<!-- Decorative divider -->
	<div class="relative mb-16">
		<div class="absolute inset-0 flex items-center" aria-hidden="true">
			<div class="w-full border-t border-purple-200"></div>
		</div>
		<div class="relative flex justify-center">
			<span class="bg-white px-4">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500"><path d="M12 5v14M5 12h14"></path></svg>
			</span>
		</div>
	</div>
	
	<div class="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20">
		<!-- Contact Form - Takes up 3 columns -->
		<div class="lg:col-span-3" in:fly={{ y: 20, duration: 300, delay: 300 }}>
			<div class="bg-white rounded-xl shadow-md border border-gray-100 p-8 relative overflow-hidden">
				<!-- Decorative corner accent -->
				<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100 to-transparent -mr-12 -mt-12 rounded-full opacity-70"></div>
				
				<div class="relative z-10">
					<h2 class="text-2xl font-bold mb-6 flex items-center">
						<span class="bg-purple-100 text-purple-700 p-2 rounded-full mr-3">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
							</svg>
						</span>
						Send us a message
					</h2>
					
					{#if formSubmitted}
						<div class="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
							<div class="flex">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
								<p>Thank you for your message! We'll get back to you as soon as possible.</p>
							</div>
						</div>
					{:else if formError}
						<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
							<div class="flex">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
								<p>There was an error sending your message. Please try again later.</p>
							</div>
						</div>
					{/if}
					
					<form on:submit|preventDefault={handleSubmit} class="space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
								<input 
									type="text" 
									id="name" 
									bind:value={name} 
									required
									class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
									placeholder="John Doe"
								/>
							</div>
							
							<div>
								<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
								<input 
									type="email" 
									id="email" 
									bind:value={email} 
									required
									class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
									placeholder="john@example.com"
								/>
							</div>
						</div>
						
						<div>
							<label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
							<input 
								type="text" 
								id="subject" 
								bind:value={subject} 
								required
								class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								placeholder="How can we help you?"
							/>
						</div>
						
						<div>
							<label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
							<textarea 
								id="message" 
								bind:value={message} 
								required
								rows="6"
								class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								placeholder="Tell us about your project or question..."
							></textarea>
						</div>
						
						<button 
							type="submit" 
							class="btn-primary w-full flex justify-center items-center py-3 text-base"
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							{:else}
								Send Message
							{/if}
						</button>
					</form>
				</div>
			</div>
		</div>
		
		<!-- Contact Information - Takes up 2 columns -->
		<div class="lg:col-span-2" in:fly={{ y: 20, duration: 300, delay: 450 }}>
			<div class="bg-white rounded-xl shadow-md border border-gray-100 p-8 h-full relative overflow-hidden">
				<!-- Decorative corner accent -->
				<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100 to-transparent -mr-12 -mt-12 rounded-full opacity-70"></div>
				
				<div class="relative z-10">
					<h2 class="text-2xl font-bold mb-8 flex items-center">
						<span class="bg-indigo-100 text-indigo-700 p-2 rounded-full mr-3">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</span>
						Get in touch
					</h2>
					
					<div class="space-y-8">
						<div class="flex items-start transform transition-all duration-300 hover:translate-x-2">
							<div class="flex-shrink-0 bg-purple-100 rounded-full p-3 mr-4">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-semibold mb-1">Email</h3>
								<p class="text-gray-600 mb-2">For general inquiries:</p>
								<a href="mailto:support@softodesign.com" class="text-purple-700 hover:underline font-medium">support@softodesign.com</a>
							</div>
						</div>
						
						<div class="flex items-start transform transition-all duration-300 hover:translate-x-2">
							<div class="flex-shrink-0 bg-purple-100 rounded-full p-3 mr-4">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-semibold mb-1">Phone</h3>
								<p class="text-gray-600 mb-2">Monday to Friday, 9am to 6pm:</p>
								<a href="tel:+8801576915227" class="text-purple-700 hover:underline font-medium">+1 302 5205074</a>
							</div>
						</div>
						
						<div class="flex items-start transform transition-all duration-300 hover:translate-x-2">
							<div class="flex-shrink-0 bg-purple-100 rounded-full p-3 mr-4">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-semibold mb-1">Location</h3>
								<p class="text-gray-600 mb-2">Our headquarters:</p>
								<p class="text-gray-800 font-medium">Dhaka, Bangladesh</p>
							</div>
						</div>
						
						<div class="pt-6 border-t border-gray-200">
							<h3 class="text-lg font-semibold mb-4">Connect with us</h3>
							<div class="flex space-x-4">
								<a href="https://twitter.com/softodesign" target="_blank" rel="noopener noreferrer" class="bg-gray-100 hover:bg-purple-100 p-3 rounded-full text-gray-600 hover:text-purple-700 transition-colors transform hover:scale-110">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
								</a>
								<a href="https://linkedin.com/company/softodesign" target="_blank" rel="noopener noreferrer" class="bg-gray-100 hover:bg-purple-100 p-3 rounded-full text-gray-600 hover:text-purple-700 transition-colors transform hover:scale-110">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
								</a>
								<a href="https://github.com/softodesign" target="_blank" rel="noopener noreferrer" class="bg-gray-100 hover:bg-purple-100 p-3 rounded-full text-gray-600 hover:text-purple-700 transition-colors transform hover:scale-110">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
								</a>
								<a href="https://instagram.com/softodesign" target="_blank" rel="noopener noreferrer" class="bg-gray-100 hover:bg-purple-100 p-3 rounded-full text-gray-600 hover:text-purple-700 transition-colors transform hover:scale-110">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- FAQ Section -->
	<section class="mb-16" in:fade={{ duration: 300, delay: 600 }}>
		<h2 class="text-2xl md:text-3xl font-bold mb-8 text-center text-gradient">Frequently Asked Questions</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="card">
				<h3 class="text-xl font-semibold mb-3">How quickly can you respond to inquiries?</h3>
				<p>We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please indicate so in your message.</p>
			</div>
			
			<div class="card">
				<h3 class="text-xl font-semibold mb-3">Do you work with clients internationally?</h3>
				<p>Yes! We work with clients from all around the world. Our team is experienced in remote collaboration and communication.</p>
			</div>
			
			<div class="card">
				<h3 class="text-xl font-semibold mb-3">What information should I provide for a project inquiry?</h3>
				<p>It helps if you can share your project goals, timeline, budget range, and any specific requirements. The more details you provide, the better we can assess if we're the right fit.</p>
			</div>
			
			<div class="card">
				<h3 class="text-xl font-semibold mb-3">Can I request a custom quote for my project?</h3>
				<p>Absolutely! Each project is unique, and we provide custom quotes based on your specific requirements. Just reach out through our contact form with your project details.</p>
			</div>
		</div>
	</section>
	
	
	
		<!-- Call to action -->
        <section class="text-center py-16 px-8 bg-gradient-to-r from-purple-100 via-purple-50 to-indigo-100 rounded-xl border border-purple-200 mt-20 shadow-md relative overflow-hidden" in:fade={{ duration: 300, delay: 600 }}>
            <!-- Decorative elements -->
            <div class="absolute top-0 left-0 w-full h-full opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="absolute top-4 left-4 text-purple-700"><path d="M12 5v14M5 12h14"></path></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="absolute bottom-4 right-4 text-indigo-700"><circle cx="12" cy="12" r="10"></circle></svg>
            </div>
            
            <div class="relative z-10">
                <div class="inline-block p-3 bg-white rounded-full shadow-md mb-6">
                    <div class="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
                    </div>
                </div>
                <h2 class="text-3xl font-bold mb-5 text-gradient">Need a custom solution?</h2>
                <p class="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                    We can build tailored products and services to meet your specific business requirements.
                    Let's discuss how we can help you achieve your goals.
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="mailto:contact@softodesign.com?subject=Custom Solution Inquiry" class="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
                        Email Us Directly
                    </a>
                    
                    <a href="/contact" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 font-medium rounded-md border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Contact Us
                    </a>
                </div>
            </div>
        </section>
	
	
	<div class="mt-12">
		<a href="/" class="text-purple-700 hover:underline flex items-center gap-2 group">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
			Back to Home
		</a>
	</div>
</div>
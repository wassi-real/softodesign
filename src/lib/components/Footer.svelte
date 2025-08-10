<script>
	const currentYear = new Date().getFullYear();
	
	const footerLinks = [
		{
			title: 'Products',
			items: [
				{ label: 'All Products', href: '/products' },
				{ label: 'Services', href: '/products#services' },
				{ label: 'Solutions', href: '/products#solutions' }
			]
		},
		{
			title: 'Company',
			items: [
				{ label: 'About Us', href: '/about' },
				{ label: 'Contact', href: '/contact' },
				{ label: 'Careers', href: '/careers' }
			]
		},
		{
			title: 'Resources',
			items: [
				// { label: 'Blog', href: '/blog' },
				// { label: '', href: '/docs' },
				{ label: 'Status', href: '/status' }
			]
		}
	];
	
	const socialLinks = [
		{ 
			label: 'Twitter',
			href: 'https://twitter.com/softodesign',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>`
		},
		{ 
			label: 'GitHub',
			href: 'https://github.com/softodesign',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`
		},
		{ 
			label: 'LinkedIn',
			href: 'https://linkedin.com/company/softodesign',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`
		}
	];
</script>

<footer class="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
	<div class="container-custom">
		<!-- Footer top section with links -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
			<!-- Company info -->
			<div>
				<div class="flex items-center gap-2 mb-4">
					<img src="/favicon.png" alt="SoftoDesign Logo" class="w-8 h-8" />
					<span class="text-lg font-semibold text-gradient">SoftoDesign</span>
				</div>
				<p class="text-gray-600 mb-4">
					Creating innovative solutions for the digital world. We help businesses transform their ideas into reality.
				</p>
				<div class="flex space-x-4">
					{#each socialLinks as social}
						<a 
							href={social.href} 
							target="_blank" 
							rel="noopener noreferrer"
							class="text-gray-500 hover:text-purple-700 transition-colors"
							aria-label={social.label}
						>
							{@html social.icon}
						</a>
					{/each}
				</div>
			</div>
			
			<!-- Footer link columns -->
			{#each footerLinks as section}
				<div>
					<h3 class="font-semibold text-gray-900 mb-4">{section.title}</h3>
					<ul class="space-y-3">
						{#each section.items as item}
							<li>
								<a 
									href={item.href} 
									class="text-gray-600 hover:text-purple-700 transition-colors"
								>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
		
		<!-- Footer bottom with copyright -->
		<div class="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
			<p class="text-gray-600 text-sm mb-4 md:mb-0">
				© {currentYear} SoftoDesign Labs. All rights reserved.
			</p>
			<div class="flex space-x-6">
				<a href="/privacy-policy" class="text-gray-600 hover:text-purple-700 text-sm transition-colors">
					Privacy Policy
				</a>
				<a href="/terms-of-service" class="text-gray-600 hover:text-purple-700 text-sm transition-colors">
					Terms of Service
				</a>
			</div>
		</div>
	</div>
</footer>
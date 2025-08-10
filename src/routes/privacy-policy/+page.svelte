<script>
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Privacy Policy | SoftoDesign Labs</title>
	<meta name="description" content="Privacy Policy for SoftoDesign Labs - Learn how we collect, use, and protect your data." />
</svelte:head>

<div class="container-custom py-12 md:py-16" in:fade={{ duration: 300, delay: 150 }}>
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
		<p class="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
		
		<div class="prose prose-purple max-w-none">
			<p>
				At SoftoDesign Labs, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
			</p>
			
			<h2>Information We Collect</h2>
			<p>
				We may collect information about you in various ways, including:
			</p>
			<ul>
				<li><strong>Personal Data:</strong> Name, email address, phone number, and other contact information you provide when filling out forms on our website.</li>
				<li><strong>Usage Data:</strong> Information about how you use our website, including IP address, browser type, pages visited, time spent on pages, and other diagnostic data.</li>
				<li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our website and hold certain information.</li>
			</ul>
			
			<h2>How We Use Your Information</h2>
			<p>
				We may use the information we collect for various purposes, including:
			</p>
			<ul>
				<li>To provide and maintain our services</li>
				<li>To notify you about changes to our services</li>
				<li>To provide customer support</li>
				<li>To gather analysis or valuable information so that we can improve our services</li>
				<li>To monitor the usage of our services</li>
				<li>To detect, prevent, and address technical issues</li>
				<li>To provide you with news, special offers, and general information about other goods, services, and events</li>
			</ul>
			
			<h2>Disclosure of Your Information</h2>
			<p>
				We may share your information with:
			</p>
			<ul>
				<li><strong>Service Providers:</strong> Third-party companies and individuals that provide services on our behalf or help us analyze how our services are used.</li>
				<li><strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
				<li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities.</li>
			</ul>
			
			<h2>Security of Your Information</h2>
			<p>
				We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
			</p>
			
			<h2>Your Data Protection Rights</h2>
			<p>
				Depending on your location, you may have certain rights regarding your personal information, such as:
			</p>
			<ul>
				<li>The right to access, update, or delete your information</li>
				<li>The right to rectification</li>
				<li>The right to object to processing</li>
				<li>The right to data portability</li>
				<li>The right to withdraw consent</li>
			</ul>
			
			<h2>Children's Privacy</h2>
			<p>
				Our services are not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
			</p>
			
			<h2>Changes to This Privacy Policy</h2>
			<p>
				We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
			</p>
			
			<h2>Contact Us</h2>
			<p>
				If you have any questions about this Privacy Policy, please contact us:
			</p>
			<ul>
				<li>By email: <a href="mailto:contact@softodesign.com">contact@softodesign.com</a></li>
			</ul>
		</div>
		
		<div class="mt-12">
			<a href="/" class="text-purple-700 hover:underline flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
				Back to Home
			</a>
		</div>
	</div>
</div>
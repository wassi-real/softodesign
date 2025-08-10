<script>
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Terms of Service | SoftoDesign Labs</title>
	<meta name="description" content="Terms of Service for SoftoDesign Labs - Understand the terms governing your use of our services." />
</svelte:head>

<div class="container-custom py-12 md:py-16" in:fade={{ duration: 300, delay: 150 }}>
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
		<p class="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
		
		<div class="prose prose-purple max-w-none">
			<p>
				Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the SoftoDesign Labs website and services operated by SoftoDesign.
			</p>
			
			<h2>1. Agreement to Terms</h2>
			<p>
				By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access our services.
			</p>
			
			<h2>2. Intellectual Property</h2>
			<p>
				Our website and its original content, features, and functionality are and will remain the exclusive property of SoftoDesign. Our services are protected by copyright, trademark, and other laws of both the United States and foreign countries.
			</p>
			
			<h2>3. User Accounts</h2>
			<p>
				When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our services.
			</p>
			<p>
				You are responsible for safeguarding the password that you use to access our services and for any activities or actions under your password.
			</p>
			
			<h2>4. User Content</h2>
			<p>
				Our services may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content you post to our services.
			</p>
			
			<h2>5. Links To Other Web Sites</h2>
			<p>
				Our services may contain links to third-party web sites or services that are not owned or controlled by SoftoDesign.
			</p>
			<p>
				SoftoDesign has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that SoftoDesign shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such web sites or services.
			</p>
			
			<h2>6. Termination</h2>
			<p>
				We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
			</p>
			<p>
				Upon termination, your right to use our services will immediately cease. If you wish to terminate your account, you may simply discontinue using our services.
			</p>
			
			<h2>7. Limitation of Liability</h2>
			<p>
				In no event shall SoftoDesign, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use our services.
			</p>
			
			<h2>8. Governing Law</h2>
			<p>
				These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
			</p>
			
			<h2>9. Changes</h2>
			<p>
				We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
			</p>
			
			<h2>10. Contact Us</h2>
			<p>
				If you have any questions about these Terms, please contact us:
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
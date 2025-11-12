<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let addingToStack = $state(false);
	let error = $state('');
	let success = $state('');
	let showReviewForm = $state(false);
	let submittingReview = $state(false);
	let reviewError = $state('');
	let reviewSuccess = $state('');

	const agency = $derived(data.agency);
	const inStack = $derived(data.hired);
	const user = $derived(data.user);
	const reviews = $derived(data.reviews || []);
	const avgRating = $derived(data.avgRating);
	const userReview = $derived(data.userReview);
	const stackCount = $derived(data.stackCount || 0);

	let reviewRating = $state(userReview?.rating || 0);
	let reviewComment = $state(userReview?.comment || '');

	$effect(() => {
		if (userReview) {
			reviewRating = userReview.rating || 0;
			reviewComment = userReview.comment || '';
			showReviewForm = false;
		}
	});

	async function addToStack() {
		if (!user) {
			goto(`/auth?redirectTo=${encodeURIComponent(`/agencies/${agency.slug}`)}`);
			return;
		}

		if (inStack) {
			error = 'This agency is already in your stack';
			setTimeout(() => (error = ''), 3000);
			return;
		}

		addingToStack = true;
		error = '';
		success = '';

		try {
			const response = await fetch(`/agencies/${agency.slug}/api/hire`, {
				method: 'POST'
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || 'Failed to add agency to stack';
			} else {
				success = 'Agency added to your stack!';
				await invalidateAll();
			}
		} catch (err) {
			error = 'An unexpected error occurred';
		} finally {
			addingToStack = false;
			setTimeout(() => {
				error = '';
				success = '';
			}, 3000);
		}
	}

	async function submitReview() {
		if (!user) {
			goto(`/auth?redirectTo=${encodeURIComponent(`/agencies/${agency.slug}`)}`);
			return;
		}

		if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
			reviewError = 'Please select a rating';
			setTimeout(() => (reviewError = ''), 3000);
			return;
		}

		submittingReview = true;
		reviewError = '';
		reviewSuccess = '';

		try {
			const response = await fetch(`/agencies/${agency.slug}/api/review`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					rating: reviewRating,
					comment: reviewComment.trim() || null
				})
			});

			const result = await response.json();

			if (!response.ok) {
				reviewError = result.error || 'Failed to submit review';
			} else {
				reviewSuccess = userReview ? 'Review updated successfully!' : 'Review submitted successfully!';
				showReviewForm = false;
				await invalidateAll();
			}
		} catch (err) {
			reviewError = 'An unexpected error occurred';
		} finally {
			submittingReview = false;
			setTimeout(() => {
				reviewError = '';
				reviewSuccess = '';
			}, 3000);
		}
	}
</script>

<div class="min-h-screen bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		{#if agency}
			<!-- Back Button -->
			<a href="/agencies" class="inline-flex items-center gap-2 text-black/70 hover:text-black mb-8 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				<span>Back to Agencies</span>
			</a>

			<!-- Header -->
			<div class="flex flex-col md:flex-row gap-8 mb-12">
				<!-- Logo -->
				<div class="w-24 h-24 md:w-32 md:h-32 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
					{#if agency.logo_url}
						<img src={agency.logo_url} alt={agency.name} class="w-full h-full object-cover rounded-lg" />
					{:else}
						<span class="text-4xl font-bold text-purple-600">{agency.name?.charAt(0) || 'A'}</span>
					{/if}
				</div>

				<!-- Info -->
				<div class="flex-1">
					<div class="flex items-center gap-3 mb-4">
						<h1 class="text-4xl font-bold text-black">{agency.name}</h1>
						{#if agency.verified}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
							</svg>
						{/if}
						{#if agency.featured}
							<span class="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">Featured</span>
						{/if}
					</div>

					<p class="text-lg text-black/70 mb-6">{agency.description || 'No description available'}</p>

					<!-- Actions -->
					<div class="flex flex-wrap gap-4">
						{#if user}
							<button
								onclick={addToStack}
								disabled={addingToStack || inStack}
								class="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed {inStack
									? 'bg-green-600 text-white'
									: 'bg-purple-600 text-white hover:bg-purple-700'}"
							>
								{#if addingToStack}
									Adding...
								{:else if inStack}
									✓ In Your Stack
								{:else}
									Add to My Stack
								{/if}
							</button>
						{/if}
						{#if agency.website_url}
							<a
								href={agency.website_url}
								target="_blank"
								rel="noopener noreferrer"
								class="px-6 py-3 bg-gray-100 text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
							>
								Visit Website →
							</a>
						{/if}
						{#if agency.portfolio_url}
							<a
								href={agency.portfolio_url}
								target="_blank"
								rel="noopener noreferrer"
								class="px-6 py-3 bg-gray-100 text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
							>
								View Portfolio →
							</a>
						{/if}
					</div>

					<!-- Messages -->
					{#if error}
						<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p class="text-red-600 text-sm">{error}</p>
						</div>
					{/if}
					{#if success}
						<div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
							<p class="text-green-600 text-sm">{success}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Details Grid -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				<!-- Service Type -->
				{#if agency.service_type}
					<div>
						<h3 class="text-sm font-medium text-black/60 mb-2">Service Type</h3>
						<p class="text-lg text-black">{agency.service_type}</p>
					</div>
				{/if}

				<!-- Location -->
				{#if agency.location}
					<div>
						<h3 class="text-sm font-medium text-black/60 mb-2">Location</h3>
						<p class="text-lg text-black">📍 {agency.location}</p>
					</div>
				{/if}

				<!-- Rating -->
				{#if avgRating !== '0.0'}
					<div>
						<h3 class="text-sm font-medium text-black/60 mb-2">Rating</h3>
						<div class="flex items-center gap-2">
							<span class="text-lg font-bold text-black">{avgRating}</span>
							<div class="flex text-yellow-400">
								{#each Array(5) as _, i}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {i < Math.round(Number(avgRating)) ? 'fill-current' : ''}" viewBox="0 0 20 20" fill="currentColor">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								{/each}
							</div>
							<span class="text-sm text-black/60">({reviews.length})</span>
						</div>
					</div>
				{/if}

				<!-- Stack Count -->
				<div>
					<h3 class="text-sm font-medium text-black/60 mb-2">In Stacks</h3>
					<div class="flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						<span class="text-lg font-bold text-black">{stackCount}</span>
						<span class="text-sm text-black/60">founder{stackCount === 1 ? '' : 's'} added this</span>
					</div>
				</div>
			</div>

			<!-- Pricing Tiers -->
			{#if agency.pricing_tiers}
				<div class="mb-8">
					<h3 class="text-xl font-bold text-black mb-4">Pricing</h3>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						{#each Object.entries(agency.pricing_tiers) as [tier, price]}
							<div class="border border-gray-200 rounded-lg p-4">
								<h4 class="font-bold text-black mb-2">{tier}</h4>
								<p class="text-lg text-purple-600 font-medium">{price}</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Reviews Section -->
			<div>
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-2xl font-bold text-black">Reviews ({reviews.length})</h3>
					{#if user}
						<button
							onclick={() => { showReviewForm = !showReviewForm; reviewError = ''; reviewSuccess = ''; }}
							class="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
						>
							{userReview ? 'Edit Review' : 'Write a Review'}
						</button>
					{/if}
				</div>

				{#if showReviewForm && user}
					<div class="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
						<h4 class="text-lg font-bold text-black mb-4">{userReview ? 'Edit Your Review' : 'Write a Review'}</h4>
						
						{#if reviewError}
							<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p class="text-red-600 text-sm">{reviewError}</p>
							</div>
						{/if}
						{#if reviewSuccess}
							<div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
								<p class="text-green-600 text-sm">{reviewSuccess}</p>
							</div>
						{/if}

						<form onsubmit={(e) => { e.preventDefault(); submitReview(); }} class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-black mb-2">Rating *</label>
								<div class="flex gap-2">
									{#each Array(5) as _, i}
										<button
											type="button"
											onclick={() => reviewRating = i + 1}
											class="focus:outline-none"
										>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 {i < reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}" viewBox="0 0 20 20" fill="currentColor">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										</button>
									{/each}
								</div>
							</div>

							<div>
								<label for="review-comment" class="block text-sm font-medium text-black mb-2">Comment</label>
								<textarea
									id="review-comment"
									bind:value={reviewComment}
									rows="4"
									class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
									placeholder="Share your experience with this agency..."
								></textarea>
							</div>

							<div class="flex gap-3">
								<button
									type="submit"
									disabled={submittingReview}
									class="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{submittingReview ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
								</button>
								<button
									type="button"
									onclick={() => { showReviewForm = false; reviewError = ''; reviewSuccess = ''; }}
									class="px-6 py-2 bg-gray-200 text-black rounded-lg font-medium hover:bg-gray-300 transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				{/if}

				{#if reviews.length === 0}
					<p class="text-black/70">No reviews yet. Be the first to review!</p>
				{:else}
					<div class="space-y-6">
						{#each reviews as review}
							<div class="border border-gray-200 rounded-lg p-6">
								<div class="flex items-start justify-between mb-3">
									<div>
										<p class="font-medium text-black">{review.reviewer?.name || review.reviewer?.email || 'Anonymous'}</p>
										<p class="text-sm text-black/60">{new Date(review.created_at).toLocaleDateString()}</p>
									</div>
									{#if review.rating}
										<div class="flex text-yellow-400">
											{#each Array(5) as _, i}
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {i < review.rating ? 'fill-current' : ''}" viewBox="0 0 20 20" fill="currentColor">
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
											{/each}
										</div>
									{/if}
								</div>
								{#if review.comment}
									<p class="text-black/70">{review.comment}</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>


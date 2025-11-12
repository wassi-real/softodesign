<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { data }: { data: PageData } = $props();

	const posts = $derived(data.posts || []);
	const founder = $derived(data.founder);

	let showPostForm = $state(false);
	let editingPost = $state<any>(null);
	let postTitle = $state('');
	let postContent = $state('');
	let submitting = $state(false);
	let error = $state('');
	let deletingPostId = $state<string | null>(null);


	function openPostForm(post?: any) {
		if (post) {
			editingPost = post;
			postTitle = post.title;
			postContent = post.content;
		} else {
			editingPost = null;
			postTitle = '';
			postContent = '';
		}
		showPostForm = true;
		error = '';
	}

	function closePostForm() {
		showPostForm = false;
		editingPost = null;
		postTitle = '';
		postContent = '';
		error = '';
	}

	async function submitPost() {
		if (!founder) {
			goto('/auth?redirectTo=/community');
			return;
		}

		if (!postTitle.trim() || !postContent.trim()) {
			error = 'Title and content are required';
			toast.error('Title and content are required');
			return;
		}

		submitting = true;
		error = '';

		try {
			const url = editingPost
				? `/community/api/posts/${editingPost.id}`
				: '/community/api/posts';
			const method = editingPost ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: postTitle.trim(),
					content: postContent.trim()
				})
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || 'Failed to save post';
				toast.error(result.error || 'Failed to save post');
			} else {
				toast.success(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
				closePostForm();
				await invalidateAll();
			}
		} catch (err) {
			error = 'An unexpected error occurred';
			toast.error('An unexpected error occurred');
		} finally {
			submitting = false;
		}
	}

	async function deletePost(postId: string) {
		deletingPostId = postId;

		try {
			const response = await fetch(`/community/api/posts/${postId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				toast.success('Post deleted successfully!');
				await invalidateAll();
			} else {
				const result = await response.json();
				toast.error(result.error || 'Failed to delete post');
			}
		} catch (err) {
			toast.error('An unexpected error occurred');
		} finally {
			deletingPostId = null;
		}
	}

	function canEditPost(post: any): boolean {
		const postFounder = Array.isArray(post.founder) ? post.founder[0] : post.founder;
		return !!founder && !!postFounder && founder.id === postFounder.id;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<br>
		<br>
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1 class="text-3xl font-bold text-black mb-2">Community</h1>
				<p class="text-black/70">Connect with fellow founders and share your experiences</p>
			</div>
			{#if founder}
				<button
					onclick={() => openPostForm()}
					class="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
				>
					+ New Post
				</button>
			{/if}
		</div>

		{#if !founder}
			<div class="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
				<p class="text-purple-800 text-sm">
					<a href="/auth?redirectTo=/community" class="font-medium underline">Sign in</a> to create posts and join the conversation.
				</p>
			</div>
		{/if}

		<!-- Post Form Modal -->
		{#if showPostForm}
			<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
				<div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
					<div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
						<h2 class="text-xl font-bold text-black">
							{editingPost ? 'Edit Post' : 'Create New Post'}
						</h2>
						<button
							onclick={closePostForm}
							class="text-gray-400 hover:text-gray-600 transition-colors"
							aria-label="Close form"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<div class="p-6">
						{#if error}
							<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p class="text-red-600 text-sm">{error}</p>
							</div>
						{/if}

						<form onsubmit={(e) => { e.preventDefault(); submitPost(); }} class="space-y-4">
							<div>
								<label for="post-title" class="block text-sm font-medium text-black mb-2">
									Title *
								</label>
								<input
									id="post-title"
									type="text"
									bind:value={postTitle}
									required
									class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
									placeholder="What's on your mind?"
								/>
							</div>

							<div>
								<label for="post-content" class="block text-sm font-medium text-black mb-2">
									Content *
								</label>
								<textarea
									id="post-content"
									bind:value={postContent}
									required
									rows="8"
									class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
									placeholder="Share your thoughts..."
								></textarea>
							</div>

							<div class="flex gap-3">
								<button
									type="submit"
									disabled={submitting}
									class="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{submitting ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
								</button>
								<button
									type="button"
									onclick={closePostForm}
									class="px-6 py-3 bg-gray-200 text-black rounded-lg font-medium hover:bg-gray-300 transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		{/if}

		<!-- Posts List -->
		<div class="space-y-6">
			{#if posts.length === 0}
				<div class="text-center py-12">
					<p class="text-black/70 text-lg">No posts yet. Be the first to share!</p>
				</div>
			{:else}
				{#each posts as post}
					{@const postFounder = Array.isArray(post.founder) ? post.founder[0] : post.founder}
					<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<!-- Post Header -->
						<div class="flex items-start justify-between mb-4">
							<div class="flex items-center gap-3">
								{#if postFounder?.pfp}
									<img src={postFounder.pfp} alt={postFounder.founder_name || 'Founder'} class="w-10 h-10 rounded-full object-cover" />
								{:else}
									<div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
										<span class="text-purple-600 font-semibold">
											{(postFounder?.founder_name || 'U')[0].toUpperCase()}
										</span>
									</div>
								{/if}
								<div>
									<p class="font-semibold text-black">{postFounder?.founder_name || 'Anonymous'}</p>
									<p class="text-sm text-black/60">
										{new Date(post.created_at).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
								</div>
							</div>
							{#if canEditPost(post)}
								<div class="flex items-center gap-2">
									<button
										onclick={() => openPostForm(post)}
										class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
										title="Edit post"
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
									</button>
									<button
										onclick={() => deletePost(post.id)}
										disabled={deletingPostId === post.id}
										class="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
										title="Delete post"
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							{/if}
						</div>

						<!-- Post Content -->
						<a href="/community/{post.id}" class="block hover:opacity-90 transition-opacity">
							<h2 class="text-xl font-bold text-black mb-3 hover:text-purple-600 transition-colors">{post.title}</h2>
							<p class="text-black/80 whitespace-pre-wrap mb-4 line-clamp-3">{post.content}</p>
						</a>

						<!-- Comments Count Link -->
						<div class="border-t border-gray-200 pt-4 mt-4">
							<a
								href="/community/{post.id}"
								class="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								</svg>
								<span class="text-sm font-medium">
									{post.commentCount || 0} {post.commentCount === 1 ? 'comment' : 'comments'}
								</span>
							</a>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>


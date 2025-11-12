<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { data }: { data: PageData } = $props();

	const post = $derived(data.post);
	const comments = $derived(data.comments || []);
	const founder = $derived(data.founder);

	let editingCommentId = $state<string | null>(null);
	let commentContent = $state<Record<string, string>>({});
	let submittingComment = $state<Record<string, boolean>>({});
	let deletingCommentId = $state<string | null>(null);

	function startEditingComment(comment: any) {
		editingCommentId = comment.id;
		commentContent[comment.id] = comment.content;
	}

	function cancelEditComment() {
		editingCommentId = null;
	}

	async function submitComment(commentId?: string) {
		if (!founder) {
			goto('/auth?redirectTo=/community');
			return;
		}

		const content = commentId ? commentContent[commentId] : commentContent['new'];
		if (!content || !content.trim()) {
			return;
		}

		submittingComment[commentId || 'new'] = true;

		try {
			const url = commentId
				? `/community/api/comments/${commentId}`
				: `/community/api/comments`;
			const method = commentId ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					post_id: post.id,
					content: content.trim()
				})
			});

			const result = await response.json();

			if (!response.ok) {
				toast.error(result.error || 'Failed to save comment');
			} else {
				toast.success(commentId ? 'Comment updated successfully!' : 'Comment posted successfully!');
				if (commentId) {
					cancelEditComment();
				} else {
					commentContent['new'] = '';
				}
				await invalidateAll();
			}
		} catch (err) {
			toast.error('An unexpected error occurred');
		} finally {
			submittingComment[commentId || 'new'] = false;
		}
	}

	async function deleteComment(commentId: string) {
		deletingCommentId = commentId;

		try {
			const response = await fetch(`/community/api/comments/${commentId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				toast.success('Comment deleted successfully!');
				await invalidateAll();
			} else {
				const result = await response.json();
				toast.error(result.error || 'Failed to delete comment');
			}
		} catch (err) {
			toast.error('An unexpected error occurred');
		} finally {
			deletingCommentId = null;
		}
	}

	function canEditComment(comment: any): boolean {
		return founder && founder.id === comment.founder?.id;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Back Button -->
		<a href="/community" class="inline-flex items-center gap-2 text-black/70 hover:text-black mb-8 transition-colors">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			<span>Back to Community</span>
		</a>

		{#if post}
			<!-- Post Card -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
				<!-- Post Header -->
				<div class="flex items-start justify-between mb-4">
					<div class="flex items-center gap-3">
						{#if post.founder?.pfp}
							<img src={post.founder.pfp} alt={post.founder.founder_name || 'Founder'} class="w-10 h-10 rounded-full object-cover" />
						{:else}
							<div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
								<span class="text-purple-600 font-semibold">
									{(post.founder?.founder_name || 'U')[0].toUpperCase()}
								</span>
							</div>
						{/if}
						<div>
							<p class="font-semibold text-black">{post.founder?.founder_name || 'Anonymous'}</p>
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
				</div>

				<!-- Post Content -->
				<h1 class="text-2xl font-bold text-black mb-4">{post.title}</h1>
				<p class="text-black/80 whitespace-pre-wrap">{post.content}</p>
			</div>

			<!-- Comments Section -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-bold text-black mb-6">
					Comments ({comments.length})
				</h2>

				<!-- Comments List -->
				<div class="space-y-6 mb-6">
					{#if comments.length === 0}
						<p class="text-black/70 text-center py-8">No comments yet. Be the first to comment!</p>
					{:else}
						{#each comments as comment}
							<div class="flex items-start gap-3">
								{#if comment.founder?.pfp}
									<img src={comment.founder.pfp} alt={comment.founder.founder_name || 'Founder'} class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
								{:else}
									<div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
										<span class="text-purple-600 font-semibold">
											{(comment.founder?.founder_name || 'U')[0].toUpperCase()}
										</span>
									</div>
								{/if}
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<p class="font-semibold text-black">{comment.founder?.founder_name || 'Anonymous'}</p>
										<p class="text-sm text-black/60">
											{new Date(comment.created_at).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											})}
										</p>
									</div>
									{#if editingCommentId === comment.id}
										<div class="space-y-2">
											<textarea
												bind:value={commentContent[comment.id]}
												rows="4"
												class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
											></textarea>
											<div class="flex gap-2">
												<button
													onclick={() => submitComment(comment.id)}
													disabled={submittingComment[comment.id]}
													class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
												>
													Save
												</button>
												<button
													onclick={cancelEditComment}
													class="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
												>
													Cancel
												</button>
											</div>
										</div>
									{:else}
										<div class="flex items-start justify-between">
											<p class="text-black/80 whitespace-pre-wrap">{comment.content}</p>
											{#if canEditComment(comment)}
												<div class="flex items-center gap-1 ml-4">
													<button
														onclick={() => startEditingComment(comment)}
														class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
														title="Edit comment"
													>
														<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
														</svg>
													</button>
													<button
														onclick={() => deleteComment(comment.id)}
														disabled={deletingCommentId === comment.id}
														class="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
														title="Delete comment"
													>
														<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
														</svg>
													</button>
												</div>
											{/if}
										</div>
									{/if}
								</div>
							</div>
						{/each}
					{/if}
				</div>

				<!-- Add Comment Form -->
				{#if founder}
					<div class="border-t border-gray-200 pt-6">
						<div class="flex items-start gap-3">
							{#if founder.pfp}
								<img src={founder.pfp} alt={founder.founder_name || 'You'} class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
							{:else}
								<div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
									<span class="text-purple-600 font-semibold">
										{(founder.founder_name || 'U')[0].toUpperCase()}
									</span>
								</div>
							{/if}
							<div class="flex-1">
								<textarea
									bind:value={commentContent['new']}
									placeholder="Write a comment..."
									rows="4"
									class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
								></textarea>
								<button
									onclick={() => submitComment()}
									disabled={submittingComment['new'] || !commentContent['new']?.trim()}
									class="mt-3 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{submittingComment['new'] ? 'Posting...' : 'Post Comment'}
								</button>
							</div>
						</div>
					</div>
				{:else}
					<div class="border-t border-gray-200 pt-6">
						<p class="text-center text-black/70 text-sm">
							<a href="/auth?redirectTo=/community/{post.id}" class="text-purple-600 hover:text-purple-700 font-medium underline">Sign in</a> to leave a comment.
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>


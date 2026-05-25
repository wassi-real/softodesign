<script lang="ts">
	const interactiveSelector = [
		'a',
		'button',
		'input',
		'textarea',
		'select',
		'summary',
		'[role="button"]',
		'.product-card'
	].join(',');

	let x = $state(0);
	let y = $state(0);
	let isVisible = $state(false);
	let isHovering = $state(false);

	const isFinePointer = (event: PointerEvent) => event.pointerType === 'mouse' || event.pointerType === 'pen';

	const updatePosition = (event: PointerEvent) => {
		x = event.clientX;
		y = event.clientY;
	};

	const updateHoverState = (target: EventTarget | null) => {
		isHovering = target instanceof Element && Boolean(target.closest(interactiveSelector));
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!isFinePointer(event)) return;

		updatePosition(event);
		updateHoverState(event.target);
		isVisible = true;
	};

	const handlePointerEnter = (event: PointerEvent) => {
		if (!isFinePointer(event)) return;

		updatePosition(event);
		updateHoverState(event.target);
		isVisible = true;
	};

	const handlePointerLeave = () => {
		isVisible = false;
		isHovering = false;
	};

	const handlePointerOver = (event: PointerEvent) => {
		if (!isFinePointer(event)) return;

		updateHoverState(event.target);
	};

	const handlePointerOut = (event: PointerEvent) => {
		if (!isFinePointer(event)) return;

		updateHoverState(event.relatedTarget);
	};
</script>

<svelte:body
	onpointerenter={handlePointerEnter}
	onpointerleave={handlePointerLeave}
	onpointermove={handlePointerMove}
	onpointerover={handlePointerOver}
	onpointerout={handlePointerOut}
/>

<div
	class={[
		'site-cursor',
		'site-cursor-ring',
		isVisible && 'site-cursor-active',
		isHovering && 'site-cursor-hovering'
	]}
	style:--cursor-x={`${x}px`}
	style:--cursor-y={`${y}px`}
	aria-hidden="true"
></div>
<div
	class={[
		'site-cursor',
		'site-cursor-dot',
		isVisible && 'site-cursor-active',
		isHovering && 'site-cursor-hovering'
	]}
	style:--cursor-x={`${x}px`}
	style:--cursor-y={`${y}px`}
	aria-hidden="true"
></div>

<style>
	.site-cursor {
		position: fixed;
		left: var(--cursor-x);
		top: var(--cursor-y);
		z-index: 9999;
		display: none;
		pointer-events: none;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.72);
		transition:
			left 90ms ease-out,
			top 90ms ease-out,
			opacity 160ms ease,
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease,
			box-shadow 180ms ease;
		will-change: left, top, transform;
	}

	.site-cursor-dot {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 9999px;
		background: rgb(124 58 237);
		box-shadow: 0 0 20px rgb(124 58 237 / 0.75);
		transition-duration: 140ms;
	}

	.site-cursor-ring {
		width: 2.75rem;
		height: 2.75rem;
		border: 1px solid rgb(124 58 237 / 0.5);
		border-radius: 9999px;
		background: rgb(255 255 255 / 0.05);
		backdrop-filter: blur(2px);
		transition-duration: 240ms;
	}

	.site-cursor-active {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	.site-cursor-hovering.site-cursor-dot {
		background: rgb(255 255 255);
		box-shadow: 0 0 22px rgb(124 58 237 / 0.9);
		transform: translate(-50%, -50%) scale(0.35);
	}

	.site-cursor-hovering.site-cursor-ring {
		border-color: rgb(124 58 237 / 0.85);
		background: rgb(124 58 237 / 0.12);
		box-shadow: 0 0 28px rgb(124 58 237 / 0.2);
		transform: translate(-50%, -50%) scale(1.55);
	}

	@media (pointer: fine) and (prefers-reduced-motion: no-preference) {
		.site-cursor {
			display: block;
		}
	}
</style>

<script lang="ts">
	import { fly } from 'svelte/transition';

	function asciiScene(node: HTMLDivElement) {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const hero = node.closest<HTMLElement>('.hero-section') ?? node;
		let animationFrame = 0;
		let cleanup = () => {};
		let destroyed = false;

		const init = async () => {
			const THREE = await import('three');
			const { AsciiEffect } = await import('three/addons/effects/AsciiEffect.js');

			if (destroyed || reduceMotion.matches) return;

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
			camera.position.z = 5;

			const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
			renderer.setClearColor(0x000000, 0);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

			const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true, resolution: 0.18 });
			effect.domElement.className = 'ascii-effect';
			node.appendChild(effect.domElement);

			const shapeGeometries = [
				new THREE.SphereGeometry(0.55, 32, 18),
				new THREE.BoxGeometry(0.85, 0.85, 0.85),
				new THREE.TetrahedronGeometry(0.7, 0)
			];
			const shapes = Array.from({ length: 12 }, (_, index) => {
				const geometry = shapeGeometries[index % shapeGeometries.length];
				const material = new THREE.MeshStandardMaterial({
					color: [0x8b5cf6, 0x6366f1, 0xc084fc][index % 3],
					roughness: 0.38,
					metalness: 0.12
				});
				const mesh = new THREE.Mesh(geometry, material);
				mesh.position.set(
					(Math.random() - 0.5) * 6.8,
					(Math.random() - 0.5) * 3.8,
					(Math.random() - 0.5) * 2
				);
				mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
				mesh.scale.setScalar(0.75 + Math.random() * 0.65);
				scene.add(mesh);

				return {
					mesh,
					material,
					seed: Math.random() * Math.PI * 2,
					speed: 0.45 + Math.random() * 0.55,
					baseX: mesh.position.x,
					baseY: mesh.position.y,
					baseZ: mesh.position.z,
					parallax: 0.35 + Math.random() * 0.9,
					sideways: Math.random() > 0.5 ? 1 : -1
				};
			});

			const particlesGeometry = new THREE.BufferGeometry();
			const particleCount = 350;
			const positions = new Float32Array(particleCount * 3);

			for (let i = 0; i < particleCount * 3; i += 3) {
				positions[i] = (Math.random() - 0.5) * 9;
				positions[i + 1] = (Math.random() - 0.5) * 6;
				positions[i + 2] = (Math.random() - 0.5) * 5;
			}

			particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			const particles = new THREE.Points(
				particlesGeometry,
				new THREE.PointsMaterial({ color: 0x6366f1, size: 0.025 })
			);
			scene.add(particles);

			scene.add(new THREE.AmbientLight(0xffffff, 0.8));
			const keyLight = new THREE.PointLight(0xc084fc, 2.2, 14);
			keyLight.position.set(3, 3, 4);
			scene.add(keyLight);

			const pointer = new THREE.Vector2();

			const resize = () => {
				const { width, height } = node.getBoundingClientRect();
				camera.aspect = width / Math.max(height, 1);
				camera.updateProjectionMatrix();
				renderer.setSize(width, height);
				effect.setSize(width, height);
			};

			const trackPointer = (event: PointerEvent) => {
				const bounds = node.getBoundingClientRect();
				pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
				pointer.y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
			};

			const resetPointer = () => {
				pointer.set(0, 0);
			};

			const animate = () => {
				const time = performance.now() * 0.001;
				for (const shape of shapes) {
					const orbit = Math.sin(time * shape.speed + shape.seed) * 0.22;
					const sideDrift = pointer.y * shape.sideways * shape.parallax * 0.45;
					const targetX = shape.baseX + pointer.x * shape.parallax * 1.25 + sideDrift + orbit;
					const targetY =
						shape.baseY + pointer.y * shape.parallax * 0.85 + Math.cos(time * shape.speed + shape.seed) * 0.28;
					const targetZ = shape.baseZ + (Math.abs(pointer.x) + Math.abs(pointer.y)) * shape.parallax * 0.35;

					shape.mesh.rotation.x += 0.004 * shape.speed;
					shape.mesh.rotation.y += 0.007 * shape.speed;
					shape.mesh.rotation.z += pointer.x * 0.002 * shape.sideways;
					shape.mesh.position.x += (targetX - shape.mesh.position.x) * 0.055;
					shape.mesh.position.y += (targetY - shape.mesh.position.y) * 0.055;
					shape.mesh.position.z += (targetZ - shape.mesh.position.z) * 0.045;
				}
				particles.rotation.y -= 0.0018;
				particles.rotation.x += pointer.y * 0.0009 + 0.0008;
				particles.position.x += (pointer.x * 0.45 - particles.position.x) * 0.035;
				particles.position.y += (pointer.y * 0.25 - particles.position.y) * 0.035;
				effect.render(scene, camera);
				animationFrame = requestAnimationFrame(animate);
			};

			resize();
			animate();
			window.addEventListener('resize', resize);
			hero.addEventListener('pointermove', trackPointer);
			hero.addEventListener('pointerleave', resetPointer);

			cleanup = () => {
				cancelAnimationFrame(animationFrame);
				window.removeEventListener('resize', resize);
				hero.removeEventListener('pointermove', trackPointer);
				hero.removeEventListener('pointerleave', resetPointer);
				for (const shape of shapes) {
					shape.material.dispose();
				}
				for (const geometry of shapeGeometries) {
					geometry.dispose();
				}
				particlesGeometry.dispose();
				renderer.dispose();
				effect.domElement.remove();
			};
		};

		void init();

		return {
			destroy() {
				destroyed = true;
				cleanup();
			}
		};
	}
</script>

<section class="hero-section relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden bg-white dark:bg-black transition-colors duration-300">
	<!-- Animated ASCII Background -->
	<div
		use:asciiScene
		class="ascii-background absolute inset-0 z-0 overflow-hidden opacity-70 dark:opacity-80 pointer-events-none"
	>
	</div>

	<!-- Background Decorations (Blobs) -->
	<div
		class="absolute top-0 transform -translate-x-1/2 left-1/2 w-full h-full z-0 pointer-events-none opacity-40 dark:opacity-30"
	>
		<div
			class="absolute top-[20%] left-[20%] w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"
		></div>
		<div
			class="absolute top-[20%] right-[20%] w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"
		></div>
		<div
			class="absolute bottom-[20%] left-[40%] w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"
		></div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
		<div in:fly={{ y: 20, duration: 800, delay: 200 }} class="mx-auto max-w-3xl">
			<h1
				class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8"
			>
				The HUB <br class="hidden sm:block" />
				<span
					class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400"
					>For Masterpieces</span
				>
			</h1>

			<p
				class="mt-4 text-xl sm:text-2xl text-slate-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed"
			>
				We are a parent company of multiple companies and projects. A hub for multiple tools and resources for developers, designers, and entrepreneurs, etc.
			</p>

			<div class="mt-10 flex gap-4 justify-center">
				<a
					href="#products"
					class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-2xl text-white bg-accent hover:bg-accent-hover dark:bg-accent dark:hover:bg-purple-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
				>
					Explore Products
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="ml-2 w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
					</svg>
				</a>
				<a
					href="#contact"
					class="inline-flex items-center px-8 py-4 border border-slate-200 dark:border-zinc-700 text-lg font-medium rounded-2xl text-slate-700 dark:text-zinc-200 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
				>
					Contact Us
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	:global(.ascii-effect) {
		width: 100%;
		height: 100%;
		color: rgb(124 58 237 / 0.5);
		background: transparent !important;
		font: 700 9px/9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
			'Courier New', monospace;
		letter-spacing: -1px;
		text-shadow: 0 0 14px rgb(139 92 246 / 0.35);
	}

	:global(.dark .ascii-effect) {
		color: rgb(196 181 253 / 0.55);
		text-shadow: 0 0 18px rgb(168 85 247 / 0.55);
	}

	.ascii-background {
		mask-image: radial-gradient(circle at center, black 0%, black 54%, transparent 86%);
	}

	.ascii-background::after {
		position: absolute;
		inset: 0;
		content: '';
		background:
			radial-gradient(circle at 50% 35%, rgb(255 255 255 / 0.65), transparent 34%),
			linear-gradient(to bottom, rgb(255 255 255 / 0.1), rgb(255 255 255 / 0.8));
		mix-blend-mode: screen;
	}

	:global(.dark) .ascii-background::after {
		background:
			radial-gradient(circle at 50% 35%, rgb(88 28 135 / 0.28), transparent 36%),
			linear-gradient(to bottom, transparent, rgb(0 0 0 / 0.72));
		mix-blend-mode: multiply;
	}

	@keyframes blob {
		0% {
			transform: translate(0px, 0px) scale(1);
		}
		33% {
			transform: translate(30px, -50px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		100% {
			transform: translate(0px, 0px) scale(1);
		}
	}
	.animate-blob {
		animation: blob 7s infinite;
	}
	.animation-delay-2000 {
		animation-delay: 2s;
	}
	.animation-delay-4000 {
		animation-delay: 4s;
	}
</style>

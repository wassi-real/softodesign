import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		add: (message: string, type: ToastType = 'info', duration: number = 3000) => {
			const id = Math.random().toString(36).substring(2, 9);
			const toast: Toast = { id, message, type, duration };
			
			update((toasts) => [...toasts, toast]);

			if (duration > 0) {
				setTimeout(() => {
					update((toasts) => toasts.filter((t) => t.id !== id));
				}, duration);
			}

			return id;
		},
		remove: (id: string) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		},
		success: (message: string, duration?: number) => {
			return createToastStore().add(message, 'success', duration);
		},
		error: (message: string, duration?: number) => {
			return createToastStore().add(message, 'error', duration);
		},
		info: (message: string, duration?: number) => {
			return createToastStore().add(message, 'info', duration);
		},
		warning: (message: string, duration?: number) => {
			return createToastStore().add(message, 'warning', duration);
		}
	};
}

const toastStore = createToastStore();

export const toast = {
	subscribe: toastStore.subscribe,
	success: (message: string, duration?: number) => toastStore.add(message, 'success', duration),
	error: (message: string, duration?: number) => toastStore.add(message, 'error', duration),
	info: (message: string, duration?: number) => toastStore.add(message, 'info', duration),
	warning: (message: string, duration?: number) => toastStore.add(message, 'warning', duration),
	add: (message: string, type: ToastType = 'info', duration?: number) => toastStore.add(message, type, duration),
	remove: (id: string) => toastStore.remove(id)
};


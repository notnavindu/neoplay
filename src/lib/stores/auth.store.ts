import { writable } from 'svelte/store';

export const auth = writable({
	isLoggedIn: false
});

export const pendingCallbackUrl = writable<string | null>(null);

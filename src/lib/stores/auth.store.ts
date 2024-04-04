import { writable } from 'svelte/store';

const createAuthStore = () => {
	const { subscribe, set, update } = writable<{
		isLoggedIn: boolean;
		accessToken: string | null;
		refreshToken: string | null;
		expiresAt: Date | null;
	}>({
		isLoggedIn: false,
		accessToken: null,
		refreshToken: null,
		expiresAt: null
	});

	return {
		subscribe,
		login: (accessToken: string, refreshToken: string, expiresAt: Date) => {
			set({
				isLoggedIn: true,
				accessToken,
				refreshToken,
				expiresAt
			});
		},
		logout: () => {
			set({
				isLoggedIn: false,
				accessToken: null,
				refreshToken: null,
				expiresAt: null
			});
		}
	};
};
export const auth = createAuthStore();

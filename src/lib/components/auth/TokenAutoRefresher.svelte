<script lang="ts">
	import { storageKeys } from '$lib/constants/storage.const';
	import { auth } from '$lib/stores/auth.store';
	import { clearSpotifySdk, getSpotifyAuthStrategy } from '$lib/stores/spotify.store';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	// Refresh every 20 minutes (token expires in 1 hour, 5 min buffer in strategy)
	const REFRESH_INTERVAL_MS = 1000 * 60 * 20;

	let intervalId: ReturnType<typeof setInterval> | null = null;

	const refreshToken = async () => {
		const strategy = getSpotifyAuthStrategy();

		if (!strategy) {
			console.warn('[TokenAutoRefresher] No auth strategy found');
			return;
		}

		try {
			console.log('[TokenAutoRefresher] Forcing token refresh...');
			await strategy.forceRefresh();
			console.log('[TokenAutoRefresher] Token refreshed successfully');
		} catch (error) {
			console.error('[TokenAutoRefresher] Failed to refresh token:', error);
			toast.error('Session expired. Please log in again.', { duration: 5000 });

			// Clear auth state
			clearSpotifySdk();
			localStorage.removeItem(storageKeys.accessToken);
			$auth.isLoggedIn = false;
		}
	};

	onMount(() => {
		// Start the refresh interval
		intervalId = setInterval(refreshToken, REFRESH_INTERVAL_MS);

		// Also do an immediate check in case we're close to expiry
		// The strategy will only refresh if needed (within 5 min of expiry)
		const strategy = getSpotifyAuthStrategy();
		if (strategy) {
			strategy.getAccessToken(); // This auto-refreshes if needed
		}
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAccessToken, saveSpotifyAccessTokenResponse } from '$lib/actions/auth.actions';
	import { storageKeys } from '$lib/constants/storage.const';
	import { auth, pendingCallbackUrl } from '$lib/stores/auth.store';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	let error: string = '';

	onMount(async () => {
		if (!$pendingCallbackUrl || $pendingCallbackUrl?.length === 0) return goto('/');

		try {
			const url = new URL($pendingCallbackUrl);
			const state = localStorage.getItem(storageKeys.state);
			const clientId = localStorage.getItem(storageKeys.clientId);
			const codeVerifier = localStorage.getItem(storageKeys.codeVerifier);
			const err = url.searchParams.get('error');

			if (err) return (error = err);
			if (!clientId) {
				toast.error('No client id found. Please try again.');
				return goto('/auth/login');
			}

			if (!codeVerifier) {
				toast.error('No verification code found. Please try again.');
				return goto('/auth/login');
			}

			const code = url.searchParams.get('code');
			const returnedState = url.searchParams.get('state');

			if (state !== returnedState) return (error = 'State mismatch');
			if (!code) return (error = 'No code found. invalid url');

			const response = await getAccessToken(clientId, code, codeVerifier);

			saveSpotifyAccessTokenResponse(response);
			const sdk = await SpotifyApi.withAccessToken(clientId, response);
			spotifySdk.set(sdk);
			$auth.isLoggedIn = true;
		} catch (error) {
			console.log(error);
		} finally {
			localStorage.removeItem(storageKeys.state);
			localStorage.removeItem(storageKeys.codeVerifier);
			pendingCallbackUrl.set(null);
			goto('/');
		}
	});
</script>

{#if error}
	<div class="w-full h-full flex items-center justify-center">
		<div class="text-red-500">{error}</div>
	</div>
{/if}

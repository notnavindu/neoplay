<script lang="ts">
	import { getAccessToken, saveSpotifyAccessTokenResponse } from '$lib/actions/auth.actions';
	import CommandInputRow from '$lib/components/auth/CommandInputRow.svelte';
	import { storageKeys } from '$lib/constants/storage.const';
	import { auth } from '$lib/stores/auth.store';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import {
		base64encode,
		generateRandomString,
		getAuthorizeUrl,
		sha256
	} from '$lib/utils/auth.utils';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import { open } from '@tauri-apps/plugin-shell';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher<OnboardingStepDispatcher>();

	let clientId = localStorage.getItem(storageKeys.clientId)!;
	let authUrl: string;
	let codeVerifier: string;
	let state: string;
	let hashed: ArrayBuffer;
	let codeChallenge: string;

	let value: string = '';

	onMount(async () => {
		codeVerifier = generateRandomString(64);
		state = generateRandomString(6);
		hashed = await sha256(codeVerifier);
		codeChallenge = base64encode(hashed);

		authUrl = getAuthorizeUrl(clientId, codeChallenge, state);
		localStorage.setItem(storageKeys.state, state);

		dispatch('pushToStack', { text: '-------------', type: 'info' });
		dispatch('pushToStack', { text: 'Login with your Spotify account.', type: 'info' });
		dispatch('pushToStack', {
			text: 'After you login, you will be redirected to a page that starts with https://localhost/. Copy the FULL URL and paste it here.',
			type: 'info'
		});

		setTimeout(() => {
			open(authUrl);
		}, 3000);
	});

	const handleEnterPress = async () => {
		try {
			if (value.length == 0) return;

			const url = new URL(value);

			const error = url.searchParams.get('error');

			if (error) return dispatch('pushToStack', { text: 'Error: ' + error, type: 'error' });

			const code = url.searchParams.get('code');
			const returnedState = url.searchParams.get('state');

			if (state !== returnedState)
				return dispatch('pushToStack', { text: 'Invalid URL (State mismatch)', type: 'error' });
			if (!code)
				return dispatch('pushToStack', {
					text: 'Invalid URL (Auth code not found)',
					type: 'error'
				});

			const response = await getAccessToken(clientId, code, codeVerifier);

			saveSpotifyAccessTokenResponse(response);
			const sdk = await SpotifyApi.withAccessToken(clientId, response);
			spotifySdk.set(sdk);
			$auth.isLoggedIn = true;
		} catch (error) {
			console.log('error:', error);
			dispatch('pushToStack', { text: 'Something went wrong', type: 'error' });
		}
	};
</script>

<div>
	<CommandInputRow
		bind:value
		on:enterPress={handleEnterPress}
		placeholder="http://localhost/callback?code=......"
	/>
</div>

<script lang="ts">
	import CommandInputRow from '$lib/components/auth/CommandInputRow.svelte';
	import { storageKeys } from '$lib/constants/storage.const';
	import { createEventDispatcher, onMount } from 'svelte';
	import CliRow from '../CliRow.svelte';
	import { slide } from 'svelte/transition';
	import {
		base64encode,
		generateRandomString,
		getAuthorizeUrl,
		sha256
	} from '$lib/utils/auth.utils';
	import { open } from '@tauri-apps/plugin-shell';
	import { getAccessToken } from '$lib/actions/auth.actions';
	import { auth } from '$lib/stores/auth.store';

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

			auth.login(
				response.access_token,
				response.refresh_token,
				new Date(Date.now() + response.expires_in * 1000)
			);

			localStorage.setItem(storageKeys.accessToken, response.access_token);
			localStorage.setItem(storageKeys.refreshToken, response.refresh_token);
			localStorage.setItem(
				storageKeys.expiresAt,
				new Date(Date.now() + response.expires_in * 1000).toISOString()
			);
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

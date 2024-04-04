<script lang="ts">
	import CommandInputRow from '$lib/components/auth/CommandInputRow.svelte';
	import { storageKeys } from '$lib/constants/storage.const';
	import { createEventDispatcher } from 'svelte';
	import CliRow from '../CliRow.svelte';
	import { slide } from 'svelte/transition';
	import { generateRandomString, getAuthorizeUrl } from '$lib/utils/auth.utils';

	const dispatch = createEventDispatcher<OnboardingStepDispatcher>();

	let clientId = localStorage.getItem(storageKeys.clientId)!;
	let state = generateRandomString(6);

	localStorage.setItem(storageKeys.state, state);

	const authUrl = getAuthorizeUrl(clientId, state);
	console.log('🚀 ~ authUrl:', authUrl);
	let value: string = '';

	const handleEnterPress = () => {
		if (value.length == 0) return;

		// localStorage.setItem(storageKeys.clientId, value);
		dispatch('pushToStack', { text: 'Client ID ✅' });
		dispatch('stepComplete');
	};
</script>

<div>
	<div in:slide={{ delay: 500 }}>
		<CliRow
			>Please visit <a href={authUrl} target="_blank">this page</a> to log in with Spotify.</CliRow
		>
	</div>

	<div in:slide={{ delay: 1000 }}>
		<CliRow>
			After you login, you will be redirected to a page that starts with https://localhost/. Copy
			the entire URL and paste it here.
		</CliRow>
	</div>
	<CommandInputRow
		bind:value
		on:enterPress={handleEnterPress}
		placeholder="htt[://localhost/callback....."
	/>
</div>

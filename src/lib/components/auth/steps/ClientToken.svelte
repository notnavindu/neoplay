<script lang="ts">
	import CommandInputRow from '$lib/components/auth/CommandInputRow.svelte';
	import { storageKeys } from '$lib/constants/storage.const';
	import { createEventDispatcher } from 'svelte';

	const preSavedClientId = localStorage.getItem(storageKeys.clientId) ?? '';
	const dispatch = createEventDispatcher<OnboardingStepDispatcher>();

	let value: string = '';

	const handleEnterPress = () => {
		if (value.length === 0 && preSavedClientId?.length > 0) {
			dispatch('pushToStack', { text: 'Using previously used client ID ✅', type: 'info' });
			dispatch('stepComplete');
			return;
		}

		if (value.length == 0) return;

		localStorage.setItem(storageKeys.clientId, value);
		dispatch('pushToStack', { text: 'Client ID ✅', type: 'info' });
		dispatch('stepComplete');
	};
</script>

<div>
	<CommandInputRow
		bind:value
		on:enterPress={handleEnterPress}
		placeholder={`Paste your Client ID ${preSavedClientId ? `or press enter to use previously used clientId (${preSavedClientId.slice(0, 10)}...)` : ''}`}
	/>
</div>

<script lang="ts">
	import CommandInputRow from '$lib/components/auth/CommandInputRow.svelte';
	import { storageKeys } from '$lib/constants/storage.const';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<OnboardingStepDispatcher>();

	let value: string = '';

	const handleEnterPress = () => {
		if (value.length == 0) return;

		localStorage.setItem(storageKeys.clientId, value);
		dispatch('pushToStack', { text: 'Client ID ✅' });
		dispatch('stepComplete');
	};
</script>

<div>
	<CommandInputRow
		bind:value
		on:enterPress={handleEnterPress}
		placeholder="Paste your Client ID here"
	/>
</div>

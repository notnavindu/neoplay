<script lang="ts">
	import CliRow from '../lib/components/auth/CliRow.svelte';

	import { onMount } from 'svelte';
	import CommandInputRow from '../lib/components/auth/CommandInputRow.svelte';
	import { generateRandomString, getAuthorizeUrl } from '$lib/utils/auth.utils';
	import OnboardingStepper from '$lib/components/auth/OnboardingStepper.svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';

	let commands: CliCommand[] = [
		{
			text: 'Welcome to neoplay'
		}
	];
</script>

<div class="p-4 flex flex-col text-sm w-full">
	<CliRow>Hello!</CliRow>
	<CliRow>Let's get you setup.</CliRow>
	<CliRow>
		<a href="https://github.com/" target="_blank" class="text-neo-blue underline"> Click Here </a> to
		view the setup instructions
	</CliRow>

	<CliRow>Come back here when you're ready!</CliRow>

	{#each commands as command, i (i)}
		<div in:slide>
			<CliRow>{command.text}</CliRow>
		</div>
	{/each}

	<!-- <a href={getAuthorizeUrl(clientId, state)} target="_blank">Login</a> -->

	<OnboardingStepper
		on:pushToStack={(event) => {
			commands = [...commands, event.detail];
		}}
	/>
</div>

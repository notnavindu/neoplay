<script lang="ts">
	import CliRow from '../lib/components/auth/CliRow.svelte';

	import OnboardingStepper from '$lib/components/auth/OnboardingStepper.svelte';
	import { slide } from 'svelte/transition';

	let commands: CliCommand[] = [
		{
			text: 'Welcome to neoplay',
			type: 'info'
		}
	];
</script>

<div class="p-4 flex flex-col text-sm w-full">
	<CliRow>Hello!</CliRow>
	<CliRow>Let's get you setup.</CliRow>
	<CliRow>
		<a
			href="https://github.com/notnavindu/neoplay?tab=readme-ov-file#spotify-account-setup"
			target="_blank"
			class="text-neo-blue underline"
		>
			Click Here
		</a> to view the Spotify account setup instructions
	</CliRow>

	<CliRow>Come back here when you're ready!</CliRow>

	{#each commands as command, i (i)}
		<div in:slide>
			<CliRow type={command.type}>{command.text}</CliRow>
		</div>
	{/each}

	<OnboardingStepper
		on:pushToStack={(event) => {
			commands = [...commands, event.detail];
		}}
	/>
</div>

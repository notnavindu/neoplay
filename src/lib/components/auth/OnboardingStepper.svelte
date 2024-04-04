<script lang="ts">
	import ClientToken from './steps/ClientToken.svelte';
	import ClientSecret from './steps/AuthenticateUrl.svelte';

	const steps: OnboardingStep[] = [
		{
			component: ClientToken
		},
		{
			component: ClientSecret
		}
	];

	let step = 0;
</script>

<svelte:component this={steps[step].component} on:stepComplete={() => step++} on:pushToStack />

<script>
	import { currentTrack } from '$lib/stores/track.store';
	import Sections from './Sections.svelte';
	import Seeker from './Seeker.svelte';
</script>

<div class="w-full h-full mt-4 relative flex-shrink max-h-64 mb-8 border-b-2 border-neo-blue">
	{#key $currentTrack?.id}
		<Seeker />

		<Sections />
		<!-- <Segments /> -->
	{/key}
</div>

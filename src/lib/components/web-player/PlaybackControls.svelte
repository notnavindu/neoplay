<script>
	import { spotifyPlaybackState, spotifyPlayer } from '$lib/stores/spotify.store';

	const handlePrevPress = () => {
		$spotifyPlayer?.previousTrack();
	};

	const handleNextPress = () => {
		$spotifyPlayer?.nextTrack();
	};

	const handlePlayPress = () => {
		$spotifyPlayer?.togglePlay();
	};
</script>

<div class="flex gap-2 mt-3">
	<button on:click={handlePrevPress} class="w-6 h-6 bg-white/40 flex items-center justify-center">
		&lt;&lt;
	</button>

	<button on:click={handlePlayPress} class="w-6 h-6 bg-white/40 flex items-center justify-center">
		{#if $spotifyPlaybackState?.paused}
			p
		{:else}
			||
		{/if}
	</button>
	<button on:click={handleNextPress} class="w-6 h-6 bg-white/40 flex items-center justify-center">
		&gt;&gt;
	</button>
</div>

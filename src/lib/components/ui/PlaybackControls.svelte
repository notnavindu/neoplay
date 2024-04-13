<script lang="ts">
	import { spotifyPlaybackState, spotifyPlayer, spotifySdk } from '$lib/stores/spotify.store';

	let isLiked = false;

	const handlePrevPress = () => {
		$spotifyPlayer?.previousTrack();
	};

	const handleNextPress = () => {
		$spotifyPlayer?.nextTrack();
	};

	const handlePlayPress = () => {
		$spotifyPlayer?.togglePlay();
	};

	const getLikedStatus = async () => {
		const res = await $spotifySdk?.currentUser.tracks.hasSavedTracks([
			$spotifyPlaybackState?.track_window.current_track.id as string
		]);
		if (res) isLiked = res[0];
	};

	const toggleLike = async () => {
		if (isLiked) {
			await $spotifySdk?.currentUser.tracks.removeSavedTracks([
				$spotifyPlaybackState?.track_window.current_track.id as string
			]);
		} else {
			await $spotifySdk?.currentUser.tracks.saveTracks([
				$spotifyPlaybackState?.track_window.current_track.id as string
			]);
		}
		isLiked = !isLiked;
	};

	const toggleShuffle = () => {
		$spotifySdk?.player.togglePlaybackShuffle(!$spotifyPlaybackState?.shuffle);
	};

	$: if ($spotifyPlaybackState?.track_window.current_track.id) {
		getLikedStatus();
	}
</script>

<div class="flex gap-2 mt-3">
	<button on:click={handlePrevPress} class="w-6 h-6 bg-white/40 flex items-center justify-center">
		&lt;&lt;
	</button>

	<button on:click={handlePlayPress} class="w-6 h-6 bg-white/40 flex items-center justify-center">
		{#if $spotifyPlaybackState?.paused}
			▶
		{:else}
			||
		{/if}
	</button>

	<button on:click={handleNextPress} class="w-6 h-6 bg-white/40 flex items-center justify-center">
		&gt;&gt;
	</button>

	<button
		on:click={toggleLike}
		class:active={isLiked}
		class="w-6 h-6 bg-white/40 flex items-center justify-center ml-3 transition-colors duration-500"
	>
		&lt;3
	</button>

	<button
		on:click={toggleShuffle}
		class:active={$spotifyPlaybackState?.shuffle}
		class="w-6 h-6 bg-white/40 flex items-center justify-center text-lg transition-colors duration-500"
	>
		⤨
	</button>
</div>

<style lang="postcss">
	.active {
		@apply bg-neo-blue/70;
	}
</style>

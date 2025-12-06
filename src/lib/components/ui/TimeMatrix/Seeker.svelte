<script lang="ts">
	import { spotifyPlaybackState, spotifySdk } from '$lib/stores/spotify.store';
	import { formatPlayheadTime } from '$lib/utils/time.utils';
	import { onDestroy } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	let loop: number;
	let progressBar: HTMLDivElement;
	let currentPosition = 0;

	$: duration = $spotifyPlaybackState?.duration ?? 1;
	$: paused = $spotifyPlaybackState?.paused;

	// Sync position when playback state updates
	$: if ($spotifyPlaybackState) {
		currentPosition = $spotifyPlaybackState.position ?? 0;
	}

	$: progressPercent = (currentPosition / duration) * 100;
	$: timestamp = formatPlayheadTime(currentPosition);

	const startTracking = () => {
		clearInterval(loop);
		loop = setInterval(() => {
			if (currentPosition < duration) {
				currentPosition += 100;
			}
		}, 100);
	};

	const stopTracking = () => {
		clearInterval(loop);
	};

	$: {
		if (!paused) startTracking();
		else stopTracking();
	}

	onDestroy(() => {
		clearInterval(loop);
	});

	const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
		const rect = progressBar.getBoundingClientRect();
		const percent = (event.clientX - rect.left) / rect.width;
		const seekPosition = Math.floor(duration * percent);
		$spotifySdk?.player.seekToPosition(seekPosition);
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex items-center gap-3 px-4 py-3">
	<!-- Progress bar container -->
	<div
		bind:this={progressBar}
		class="flex-1 h-3 border border-white/80 cursor-pointer relative"
		on:click={onClick}
	>
		<!-- Progress fill -->
		<div class="h-full bg-white/90" style="width: {progressPercent}%"></div>
	</div>

	<!-- Timestamp display -->
	<div class="text-white/80 text-sm font-mono tabular-nums whitespace-nowrap">
		{timestamp}
	</div>
</div>

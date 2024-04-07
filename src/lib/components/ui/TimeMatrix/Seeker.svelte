<script lang="ts">
	import { spotifyPlaybackState } from '$lib/stores/spotify.store';
	import { onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';

	let loop: number;
	let seekerPosition = tweened(0, {
		duration: 1000
	});

	$: duration = $spotifyPlaybackState?.duration ?? 1;
	$: position = $spotifyPlaybackState?.position ?? 0;
	$: paused = $spotifyPlaybackState?.paused;

	const resume = () => {
		console.log('🚀 ~ resume ~ resume:');

		loop = setInterval(() => {
			if (position < duration) {
				position += 1000;
				$seekerPosition = (position / duration) * 100;
			}
		}, 1000);
	};

	const pause = () => {
		console.log('🚀 ~ pause ~ pause:');

		clearInterval(loop);
	};

	$: {
		if (!paused) resume();
		else pause();
	}

	onDestroy(() => {
		clearInterval(loop);
	});
</script>

<div class="w-full h-full relative z-40">
	<div class="w-px h-full bg-white absolute top-0 bottom-0" style="left: {$seekerPosition}%">
		{duration}
		{position}
		{$spotifyPlaybackState?.position}
	</div>
</div>

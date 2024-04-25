<script lang="ts">
	import { spotifyPlaybackState, spotifySdk } from '$lib/stores/spotify.store';
	import { onDestroy } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { tweened } from 'svelte/motion';

	let loop: number;
	let container: HTMLDivElement;
	let isHovering = false;
	let hoverX = 0;
	let seekerPosition = tweened(0, {
		duration: 1000
	});

	$: duration = $spotifyPlaybackState?.duration ?? 1;
	$: position = $spotifyPlaybackState?.position ?? 0;
	$: paused = $spotifyPlaybackState?.paused;

	const resume = () => {
		loop = setInterval(() => {
			if (position < duration) {
				position += 1000;
				$seekerPosition = (position / duration) * 100;
			}
		}, 1000);
	};

	const pause = () => {
		clearInterval(loop);
	};

	$: {
		if (!paused) resume();
		else pause();
	}

	onDestroy(() => {
		clearInterval(loop);
	});

	const onMouseEnter: MouseEventHandler<HTMLDivElement> = (event) => {
		isHovering = true;
	};
	const onMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
		hoverX = event.pageX - container.getBoundingClientRect().left;
	};
	const onMouseLeave: MouseEventHandler<HTMLDivElement> = (event) => {
		isHovering = false;
	};

	const onClick = () => {
		const percent = hoverX / container.getBoundingClientRect().width;
		const position = Math.floor(duration * percent);
		$spotifySdk?.player.seekToPosition(position);
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	bind:this={container}
	class="w-full h-full relative z-40 cursor-pointer"
	on:mouseenter={onMouseEnter}
	on:mouseleave={onMouseLeave}
	on:mousemove={onMouseMove}
	on:click={onClick}
>
	{#if isHovering}
		<div
			class="w-px h-full bg-white/60 absolute top-0 bottom-0 z-50"
			style="left: {hoverX}px"
		></div>
	{/if}

	<div class="w-px h-full bg-white absolute top-0 bottom-0" style="left: {$seekerPosition}%">
		<div class="size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
	</div>
</div>

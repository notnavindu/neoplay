<script>
	import { currentTrack } from '$lib/stores/track.store';
	import { msToMinutesSeconds } from '$lib/utils/time.utils';
	import { fly } from 'svelte/transition';
	import TrackAttribute from './TrackAttribute.svelte';
</script>

{#if !$currentTrack}
	<div>No Track</div>
{:else}
	{#key $currentTrack.id}
		<div class="flex gap-8">
			<div class="w-52 h-52">
				<img
					in:fly={{ y: 30 }}
					src={$currentTrack?.album.images[0].url}
					alt="Album art for {$currentTrack?.name}"
				/>
			</div>

			<div>
				<div in:fly={{ y: 30, delay: 50 }}>
					<div class="text-white/70">// NOW PLAYING</div>
					<div class="text-white/70 mb-2">---------------</div>
				</div>

				<div in:fly={{ y: 30, delay: 100 }}>
					<TrackAttribute key="Song" value={$currentTrack.name} />
					<TrackAttribute
						key="Artist(s)"
						value={$currentTrack.artists.map((artist) => artist.name).join(', ')}
					/>
					<TrackAttribute key="Duration" value={msToMinutesSeconds($currentTrack.duration_ms)} />
					<TrackAttribute key="Album" value={$currentTrack.album.name} />
				</div>
			</div>
		</div>
	{/key}
{/if}

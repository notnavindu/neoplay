<script>
	import { spotifyDeviceId, spotifySdk } from '$lib/stores/spotify.store';
	import toast from 'svelte-french-toast';
	import ModalBase from './ModalBase.svelte';

	let loading = false;

	const onTransferClick = async () => {
		loading = true;
		if ($spotifyDeviceId) await $spotifySdk?.player.transferPlayback([$spotifyDeviceId]);
		else toast.error('Unable to transfer playback. Try using another device');
	};
</script>

<ModalBase>
	<div class="text-center">
		Player Disconnected.

		<button
			on:click={onTransferClick}
			class="w-fit px-3 py-1 mt-2 text-black bg-white"
			class:shimmer-bg-white={loading}
		>
			Transfer Playback to This Device
		</button>
	</div>
</ModalBase>

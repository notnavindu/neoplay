export const msToMinutesSeconds = (milliseconds: number): string => {
	const minutes = Math.floor(milliseconds / 60000);
	const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
	return `${minutes}m ${seconds}s`;
};

/**
 * Format milliseconds to M:SS:ms format (e.g., "4:33:22")
 * Used for retro-style playhead timestamp display
 */
export const formatPlayheadTime = (milliseconds: number): string => {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	const ms = Math.floor((milliseconds % 1000) / 10); // 2-digit ms (centiseconds)

	const secondsStr = seconds.toString().padStart(2, '0');
	const msStr = ms.toString().padStart(2, '0');

	return `${minutes}:${secondsStr}:${msStr}`;
};

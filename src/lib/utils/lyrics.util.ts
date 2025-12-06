export interface LyricLine {
	time: number;
	text: string;
}

export interface LyricsResponse {
	lyrics: LyricLine[];
	error: string | null;
}

/**
 * Parse LRC format lyrics into an array of timestamped lines
 */
export function parseLRC(lrcContent: string): LyricLine[] {
	const lines = lrcContent.split('\n');
	const parsed: LyricLine[] = [];

	for (const line of lines) {
		const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/);
		if (match) {
			const minutes = parseInt(match[1], 10);
			const seconds = parseInt(match[2], 10);
			const ms = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;
			const time = minutes * 60 + seconds + ms / 1000;
			const text = match[4].trim();
			if (text) {
				parsed.push({ time, text });
			}
		}
	}
	return parsed.sort((a, b) => a.time - b.time);
}

/**
 * Fetch lyrics from lrclib.net API
 */
export async function fetchLyrics(
	trackName: string,
	artistName: string,
	albumName?: string,
	durationSec?: number
): Promise<LyricsResponse> {
	try {
		const params = new URLSearchParams({
			track_name: trackName,
			artist_name: artistName
		});
		if (albumName) params.append('album_name', albumName);
		if (durationSec) params.append('duration', Math.round(durationSec).toString());

		const response = await fetch(`https://lrclib.net/api/get?${params.toString()}`);

		if (!response.ok) {
			return {
				lyrics: [],
				error: response.status === 404 ? 'Lyrics not found' : 'Failed to fetch lyrics'
			};
		}

		const data = await response.json();

		if (data.syncedLyrics) {
			return { lyrics: parseLRC(data.syncedLyrics), error: null };
		} else if (data.plainLyrics) {
			// Fallback: distribute plain lyrics evenly across duration
			const lines = data.plainLyrics.split('\n').filter((l: string) => l.trim());
			const duration = durationSec || 180;
			const interval = duration / lines.length;
			return {
				lyrics: lines.map((text: string, i: number) => ({
					time: i * interval,
					text: text.trim()
				})),
				error: null
			};
		}

		return { lyrics: [], error: 'No lyrics available' };
	} catch {
		return { lyrics: [], error: 'Error fetching lyrics' };
	}
}

/**
 * Find the current lyric index based on playback position
 */
export function findCurrentLyricIndex(
	lyrics: LyricLine[],
	positionSec: number,
	delay: number = 0
): number {
	if (lyrics.length === 0) return -1;
	const adjustedPosition = positionSec + delay;
	for (let i = lyrics.length - 1; i >= 0; i--) {
		if (adjustedPosition >= lyrics[i].time) return i;
	}
	return -1;
}

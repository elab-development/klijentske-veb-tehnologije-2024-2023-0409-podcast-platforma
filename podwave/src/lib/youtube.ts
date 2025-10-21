import type {
  YTSearchResponse,
  YTVideoResponse,
  PodcastVideo,
  YTThumbnails,
} from '../types/youtube';

const API_KEY = import.meta.env.VITE_YT_API_KEY as string;
const BASE = 'https://www.googleapis.com/youtube/v3';

function bestThumb(thumbnails?: YTThumbnails): string {
  return (
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ''
  );
}

export function parseISODurationToClock(iso?: string): string | undefined {
  if (!iso) return undefined;
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso) || undefined;
  if (!match) return undefined;

  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  const s = parseInt(match[3] || '0', 10);

  const pad = (n: number) => String(n).padStart(2, '0');
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}

export class YouTubeAPI {
  private apiKey: string;

  constructor(apiKey: string = API_KEY) {
    this.apiKey = apiKey;
    if (!this.apiKey) {
      console.warn(
        'YouTube API key missing. Set VITE_YT_API_KEY in your .env file.'
      );
    }
  }

  async searchPodcasts(opts?: {
    q?: string;
    pageToken?: string;
    maxResults?: number;
    order?: 'relevance' | 'date' | 'viewCount';
    channelId?: string;
  }): Promise<YTSearchResponse> {
    const {
      q = 'podcast',
      pageToken,
      maxResults = 24,
      order = 'relevance',
      channelId,
    } = opts || {};

    const url = new URL(`${BASE}/search`);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('q', q);
    url.searchParams.set('order', order);
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    if (channelId) url.searchParams.set('channelId', channelId);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`YouTube search error: ${res.status} ${text}`);
    }
    return (await res.json()) as YTSearchResponse;
  }

  async getVideoDetails(ids: string[]): Promise<YTVideoResponse> {
    if (!ids.length) return { items: [] };
    const url = new URL(`${BASE}/videos`);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('id', ids.join(','));
    url.searchParams.set('part', 'snippet,contentDetails,statistics');

    const res = await fetch(url.toString());
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`YouTube videos error: ${res.status} ${text}`);
    }
    return (await res.json()) as YTVideoResponse;
  }

  async searchPodcastVideosNormalized(opts?: {
    q?: string;
    pageToken?: string;
    maxResults?: number;
    order?: 'relevance' | 'date' | 'viewCount';
    channelId?: string;
  }): Promise<{
    items: PodcastVideo[];
    nextPageToken?: string;
    prevPageToken?: string;
    totalResults?: number;
    resultsPerPage?: number;
  }> {
    const search = await this.searchPodcasts(opts);

    const ids = search.items
      .map((it) => it.id?.videoId)
      .filter(Boolean) as string[];

    const details = await this.getVideoDetails(ids);
    const map = new Map(details.items.map((v) => [v.id, v]));

    const items: PodcastVideo[] = search.items.map((s) => {
      const d = map.get(s.id.videoId);
      const durationClock = parseISODurationToClock(
        d?.contentDetails?.duration
      );
      const viewCount = d?.statistics?.viewCount
        ? Number(d.statistics.viewCount)
        : undefined;

      return {
        id: s.id.videoId,
        title: d?.snippet?.title ?? s.snippet.title,
        description: d?.snippet?.description ?? s.snippet.description,
        channelTitle: d?.snippet?.channelTitle ?? s.snippet.channelTitle,
        publishedAt: d?.snippet?.publishedAt ?? s.snippet.publishedAt,
        thumbnail: bestThumb(d?.snippet?.thumbnails ?? s.snippet.thumbnails),
        duration: durationClock,
        viewCount,
      };
    });

    return {
      items,
      nextPageToken: search.nextPageToken,
      prevPageToken: search.prevPageToken,
      totalResults: search.pageInfo?.totalResults,
      resultsPerPage: search.pageInfo?.resultsPerPage,
    };
  }
}
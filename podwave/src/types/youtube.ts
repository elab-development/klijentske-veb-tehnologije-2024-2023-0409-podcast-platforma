export interface YTThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YTThumbnails {
  default?: YTThumbnail;
  medium?: YTThumbnail;
  high?: YTThumbnail;
}

export interface YTSearchVideoId {
  kind: 'youtube#video';
  videoId: string;
}

export interface YTSearchItem {
  id: YTSearchVideoId;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YTThumbnails;
    channelTitle: string;
  };
}

export interface YTSearchResponse {
  kind: 'youtube#searchListResponse';
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: { totalResults: number; resultsPerPage: number };
  items: YTSearchItem[];
}

export interface YTVideoContentDetails {
  duration: string;
}

export interface YTVideoStatistics {
  viewCount?: string;
  likeCount?: string;
}

export interface YTVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails: YTThumbnails;
  };
  contentDetails?: YTVideoContentDetails;
  statistics?: YTVideoStatistics;
}

export interface YTVideoResponse {
  items: YTVideoItem[];
}

export interface PodcastVideo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  thumbnail: string;
  duration?: string;
  viewCount?: number;
}

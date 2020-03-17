type THUMBNAILS_QUALITY = 'default' | 'medium' | 'high';
type VIDEO_KIND = 'kind' | 'videoId';

interface YoutubePageInfo {
  totalResults: number;
  resultsPerPage: number;
}

interface YoutubeBasicItem {
  kind: string;
  etag: string;
}

interface YoutubeThumbnail {
  url: string;
  width: number;
  height: number;
}

interface YoutubeSnippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Record<THUMBNAILS_QUALITY, YoutubeThumbnail>;
  channelTitle: string;
  liveBroadcastContent: string;
}

export interface YoutubeItem extends YoutubeBasicItem {
  id: Record<VIDEO_KIND, string>;
  snippet: YoutubeSnippet;
}

export interface YoutubeResponse extends YoutubeBasicItem {
  nextPageToken: string;
  regionCode: string;
  pageInfo: YoutubePageInfo;
  items: Array<YoutubeItem>;
}

export interface YoutubeResults {
  id: Record<VIDEO_KIND, string>;
  snippet: YoutubeSnippet;
}
type THUMBNAILS_QUALITY = 'default' | 'medium' | 'high';
type VIDEO_KIND = 'kind' | 'videoId';

interface YoutubeSnippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Record<THUMBNAILS_QUALITY, object>;
  channelTitle: string;
  liveBroadcastContent: string;
}

export interface YoutubeItem {
  kind: string;
  etag: string;
  id: Record<VIDEO_KIND, string>;
  snippet: YoutubeSnippet;
}

export interface YoutubeResults {
  id: Record<VIDEO_KIND, string>;
  snippet: YoutubeSnippet;
}
import commonUtil from './commonUtils';
import { YoutubeItem, YoutubeResults } from '../models/yt.interface';

const defaultUrl = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_TOKEN = process.env.YOUTUBE_TOKEN;

export default {
  searchVideo: async (searchKey: string): Promise<Array<YoutubeResults>> => {
    const part = 'snippet',
          q = searchKey,
          maxResults = 50,
          type = 'video',
          key = YOUTUBE_TOKEN;

    const req = {
      part, q, maxResults, type, key
    };

    return await commonUtil.send(defaultUrl + '/search', req, 'GET').then((re: any): Array<YoutubeResults> =>
      re.data.items.map((v: YoutubeItem) => { return { id: v.id, snippet: v.snippet } }));
  }
}

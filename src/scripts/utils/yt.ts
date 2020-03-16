import commonUtil from './commonUtils';

const defaultUrl = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_TOKEN = process.env.YOUTUBE_TOKEN;

export default {
  searchVideo: async (searchKey: string): Promise<any> => {
    const part = 'snippet',
          q = searchKey,
          maxResults = 50,
          type = 'video',
          key = YOUTUBE_TOKEN;

    const req = {
      part, q, maxResults, type, key
    };

    return await commonUtil.send(defaultUrl + '/search', req, 'GET').then((re: any) => re.data.items);
  }
}

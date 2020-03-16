import axios from 'axios';

type URL = string;
type METHOD = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export default {
  errToString: (params: Error | string): string => {
    return params instanceof Error
      ? params.toString()
      : params;
  },

  send: async <ResponseData> (url: URL, req: any, method: METHOD): Promise<ResponseData> => {
    if (method === 'GET') {
      return await axios.get(url, { params: req });
    } else if (method === 'POST') {
      return await axios.post(url, { params: req });
    } else if (method === 'PATCH') {
      return await axios.patch(url, { params: req });
    } else if (method === 'PUT') {
      return await axios.put(url, { params: req });
    } else if (method === 'DELETE') {
      return await axios.delete(url, { params: req });
    } else {
      return await axios.post(url, { params: req });
    }
  }
}
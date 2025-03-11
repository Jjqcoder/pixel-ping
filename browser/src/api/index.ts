import axios from 'axios';

class Api {
  // GET 请求
  async get(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST 请求
  async post(url: string, data: any): Promise<any> {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export { Api };
import Axios, { AxiosInstance } from 'axios'

export default class Request {
  headers: Record<string, any>
  axiosInstance: AxiosInstance
  constructor({ cookie }) {
    this.axiosInstance = Axios.create({
      headers: {
        'Content-Type': "text/html",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'Cookie': cookie,
      }
    })
  }

  async get(url: string): Promise<string> {
    const res = await this.axiosInstance.get(url)
    return res.data
  }
}
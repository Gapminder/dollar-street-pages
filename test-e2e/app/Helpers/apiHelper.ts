import fetch from 'node-fetch';

export class ApiHelper {
  static doGet(url: string, headers = {}): Promise<any> {
    return this.makeRequest('GET', url, headers);
  }

  static doPut(url: string, headers = {}, body: string): Promise<any> {
    return this.makeRequest('PUT', url, headers, body);
  }

  static doPost(url: string, headers = {}, body: string): Promise<any> {
    return this.makeRequest('POST', url, headers, body);
  }

  static makeRequest(method: string, url: string, headers = {}, body?: string): Promise<void> {
    let options = {
      method,
      body,
      headers
    };

    return fetch(url, options)
      .then(res => {
        return res.json();
      })
      .catch(err => {
        console.error(`${method}: error: ${err}`);
        throw err;
      });
  }
}

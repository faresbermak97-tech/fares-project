export class NextRequest {
  constructor(url, options) {
    this.url = url;
    this.method = options.method || 'GET';
    this._headers = new Map();
    
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        this._headers.set(key, value);
      });
    }
    
    if (options.body) {
      this._body = options.body;
    }
  }
  
  async json() {
    return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
  }
  
  headers = {
    get: (name) => this._headers ? this._headers.get(name) : null
  };
}

export const NextResponse = {
  json: (data, options) => ({
    status: options?.status || 200,
    json: async () => data,
    headers: options?.headers || {}
  }),
};

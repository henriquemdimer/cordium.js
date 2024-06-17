import { request } from "https";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type HTTP_METHODS = 'get' | 'GET' | 'post' | 'POST' | 'delete' | 'DELETE' | 'patch' | 'PATCH';

export interface RequestOptions {
  method: HTTP_METHODS;
  endpoint: string;
  body?: any;
  auth?: boolean;
  headers?: { [key: string]: string };
}

export interface RequestManagerOptions {
  apiVersion?: string | number;
  alwaysSendAuthorizationHeader?: boolean;
}

export class RequestManager {

  #token: string;
  public options: RequestManagerOptions;

  public constructor(token: string, options?: RequestManagerOptions) {
    if (!token || typeof token !== 'string') throw new Error('RequestManager(token): token is missing or is not a string.');

    this.#token = token;

    if (options) this.options = options;
    else this.options = {
      apiVersion: '10',
      alwaysSendAuthorizationHeader: false
    }
  }

  public request(options: RequestOptions) {
    return new Promise((resolve, reject) => {
      if (!options || typeof options != 'object') throw new Error('RequestManager.request(options): options is missing or invalid.');

      const requestOptions = {
        host: 'discord.com',
        path: `/api/v${this.options.apiVersion}/${options.endpoint}`,
        method: options.method,
        headers: {
          'Authorization': `${options.auth ? `Bot ${this.#token}` : this.options.alwaysSendAuthorizationHeader ? `Bot ${this.#token}` : ''}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Edwiges/1.0.0',
          ...options.headers,
        }
      };

      try {
        const req = request(requestOptions, (res) => {
          res.setEncoding('utf8');
          let body = '';

          res.on('data', (chunk) => {
            body += chunk;
          });

          res.on('end', () => {
            if (res.statusCode === 200) {
              resolve(JSON.parse(body));
            } else {
              reject(JSON.parse(body));
            }
          })
        });

        if (options.body) {
          req.write(JSON.stringify(options.body));
        }

        req.end();
      } catch (err) {
        console.log(err);
      }
    });
  }
}

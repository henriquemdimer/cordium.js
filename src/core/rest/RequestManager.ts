import { request } from 'https';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../Client';

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
  #client: Client;

  public constructor(client: Client, token: string) {
    if (!token || typeof token !== 'string') throw new Error('RequestManager(token): token is missing or is not a string.');
    if (!client || !(client instanceof Client)) throw new Error('RequestManager(client): client is missing or invalid');

    this.#token = token;
    this.#client = client;
  }

  public request(options: RequestOptions) {
    return new Promise((resolve, reject) => {
      if (!options || typeof options != 'object') throw new Error('RequestManager.request(options): options is missing or invalid.');

      const requestOptions = {
        host: 'discord.com',
        path: `/api/v${this.#client.options.rest.apiVersion}/${options.endpoint}`,
        method: options.method,
        headers: {
          'Authorization': `${options.auth ? `Bot ${this.#token}` : this.#client.options.rest.alwaysSendAuthorizationHeader ? `Bot ${this.#token}` : ''}`,
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
            if(chunk && chunk.length) body += chunk;
          });
          
          // Criar uma classe de resposta da API.
          res.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (res.statusCode === 200) {
                resolve(parsed);
              } else {
                reject(parsed);
              }
            } catch(err) {
              reject(err);
            }
          });
        });

        req.on('error', reject);
        if (options.body) {
          req.write(JSON.stringify(options.body));
        }

        req.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

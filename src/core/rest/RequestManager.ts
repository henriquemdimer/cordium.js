/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from 'https';
import { Client } from '../Client';
import { version, name } from '../../../package.json';

export type HTTP_METHODS = 'get' | 'GET' | 'post' | 'POST' | 'delete' | 'DELETE' | 'patch' | 'PATCH';

export interface RequestOptions {
  /**
   * The HTTP method that will be used to make the request.
   */
  method: HTTP_METHODS;

  /**
   * The Discord API endpoint, the base URL always will be (`https://discord.com/api/v{version}`), so you only need to specify the endpoint, EXAMPLE: /users, /channels, etc...
   */
  endpoint: string;

  /**
   * The HTTP request body.
   */
  body?: any;

  /**
   * Whether to send the authorization token or not (NOTE if the alwaysSendAuthorizationHeader option is true, the token will be sent anyway)
   */
  auth?: boolean;

  /**
   * The HTTP request headers.
   */
  headers?: { [key: string]: string };
}

export interface RequestManagerOptions {
  /**
   * The API version of Discord.
   *
   * @defaultValue 10
   */
  apiVersion?: string | number;

  /**
   * If the request method will always send authorization token.
   *
   * @defaultValue false
   */
  alwaysSendAuthorizationHeader?: boolean;
}

/**
 * Represents a RequestManager.
 */
export class RequestManager {
  /**
   * The Discord authorization token.
   *
   * @protected
   */
  #token: string;

  /**
   * The client instance.
   *
   * @protected
   */
  #client: Client;

  public constructor(client: Client, token: string) {
    if (!token || typeof token !== 'string') throw new Error('RequestManager(token): token is missing or is not a string.');
    if (!client || !(client instanceof Client)) throw new Error('RequestManager(client): client is missing or invalid');

    this.#token = token;
    this.#client = client;
  }

  /**
   * The method used to send a request to Discord API.
   *
   * ```ts copy showLineNumbers
   * const user = await client.rest.request({
   *  method: 'GET',
   *  endpoint: '/users/@me',
   *  auth: true
   * });
   * 
   * // Raw user object from API
   * console.log(user);
   * ```
   */
  public request(options: RequestOptions) {
    return new Promise((resolve, reject) => {
      if (!options || typeof options != 'object') throw new Error('RequestManager.request(options): options is missing or invalid.');

      const requestOptions = {
        host: 'discord.com',
        path: `/api/v${this.#client.options.rest.apiVersion}${options.endpoint}`,
        method: options.method,
        headers: {
          'Authorization': `${options.auth ? `Bot ${this.#token}` : this.#client.options.rest.alwaysSendAuthorizationHeader ? `Bot ${this.#token}` : ''}`,
          'Content-Type': 'application/json',
          'User-Agent': `${name}/${version}`,
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
              const parsed = body.length ? JSON.parse(body) : {};
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

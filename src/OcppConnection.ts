import { Client } from './Client';

export declare class OcppConnection extends Client {
  on(event: string, listener: (this: OcppConnection, request: any, cb: (response: any) => void) => void): this;
  on(event: 'close', listener: (this: OcppConnection, code: number, reason: Buffer) => void): this;
  on(event: 'connect', listener: (this: OcppConnection) => void): this;
  on(event: 'error', listener: (this: OcppConnection, err: Error) => void): this;

  getCpId(): string;
}

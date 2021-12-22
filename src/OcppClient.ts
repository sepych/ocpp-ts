import { Client } from './Client';
import { Protocol } from './Protocol';

export declare class OcppClient extends Client {
  on(event: string, listener: (this: OcppClient, request: any, cb: (response: any) => void) => void): this;
  on(event: 'close', listener: (this: OcppClient, code: number, reason: Buffer) => void): this;
  on(event: 'connect', listener: (this: OcppClient) => void): this;
  on(event: 'error', listener: (this: OcppClient, err: Error) => void): this;

  getCpId(): string;
  setConnection(connection: Protocol | null): void;
  callRequest(request: string, payload: any): Promise<any>;
}

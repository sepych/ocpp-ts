import { OutgoingHttpHeaders } from 'http';
import { OcppConnection } from './OcppConnection';

export declare class OcppClient extends OcppConnection {
  connect(centralSystemUrl: string, headers?: OutgoingHttpHeaders): void;
  callRequest(request: string, payload: any): Promise<any>;
}

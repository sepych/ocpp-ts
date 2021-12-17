import EventEmitter from 'events';
import WebSocket from 'ws';
import {BootNotificationRequest} from './ocpp-1.6-types/BootNotification';
import {Protocol} from "./Protocol";

export const OCPP_PROTOCOL_1_6 = 'ocpp1.6';

export class Client extends EventEmitter {
  connection: Protocol | null = null;

  connect(centralSystemUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(centralSystemUrl, [OCPP_PROTOCOL_1_6], {
        perMessageDeflate: false,
        protocolVersion: 13
      });

      ws.on('upgrade', (res) => {
        if (!res.headers['sec-websocket-protocol']) {
          return reject(new Error(`Server doesn't support protocol ${OCPP_PROTOCOL_1_6}`));
        }
      });

      ws.on('close', () => {
        console.debug(`Connection is closed`);
        this.connection = null;
      });

      ws.on('open', () => {
        if (ws) {
          ws.removeAllListeners('error');
          this.connection = new Protocol(this, ws);
          resolve();
        }
      });

      ws.on('error', (err) => {
        reject(err);
      });
    });
  }

  callRequest(action: string, payload: any): Promise<any> {
    if (this.connection) {
      return this.connection.callRequest(action, payload);
    }
    throw new Error('Charging point not connected to central system');
  }
}

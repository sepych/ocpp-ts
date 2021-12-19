import WebSocket from 'ws';
import { Protocol } from './Protocol';
import { Client } from './Client';

export const OCPP_PROTOCOL_1_6 = 'ocpp1.6';

export class ChargingPoint extends Client {
  connect(centralSystemUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(centralSystemUrl + this.getCpId(), [OCPP_PROTOCOL_1_6], {
        perMessageDeflate: false,
        protocolVersion: 13,
      });

      ws.on('upgrade', (res) => {
        if (!res.headers['sec-websocket-protocol']) {
          reject(new Error(`Server doesn't support protocol ${OCPP_PROTOCOL_1_6}`));
        }
      });

      ws.on('close', () => {
        console.debug('Connection is closed');
        this.setConnection(null);
      });

      ws.on('open', () => {
        if (ws) {
          ws.removeAllListeners('error');
          this.setConnection(new Protocol(this, ws));
          resolve();
        }
      });

      ws.on('error', (err) => {
        reject(err);
      });
    });
  }
}

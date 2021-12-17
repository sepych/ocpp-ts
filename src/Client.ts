import WebSocket from 'ws';

export const OCPP_PROTOCOL_1_6 = 'ocpp1.6';

export class Client {
  ws: WebSocket| null = null;

  connect (centralSystemUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(centralSystemUrl, [OCPP_PROTOCOL_1_6], {
        perMessageDeflate: false,
        protocolVersion: 13
      });

      this.ws.on('upgrade', (res) => {
        if (!res.headers['sec-websocket-protocol']) {
          return reject(new Error(`Server doesn't support protocol ${OCPP_PROTOCOL_1_6}`));
        }
      });

      this.ws.on('close', () => {
        console.debug(`Connection is closed`);
        this.ws = null;
      });

      this.ws.on('open', () => {
        if (this.ws) {
          this.ws.removeAllListeners('error');
          this.ws.on('message', (msg) => {
            console.log(msg);
          });
          resolve();
        }
      });

      this.ws.on('error', (err) => {
        reject(err);
      });
    });
  }
}

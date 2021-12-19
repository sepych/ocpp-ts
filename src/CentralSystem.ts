import EventEmitter from 'events';
import WebSocket, { ServerOptions } from 'ws';
import { IncomingMessage } from 'http';
import { Protocol } from './Protocol';
import { Client } from './Client';
import { OCPP_PROTOCOL_1_6 } from './schemas';

export type CSOptions = {
  wsOptions?: ServerOptions,
  validateConnection?: (cpId: string, req: IncomingMessage) => Promise<boolean>
};

export class CentralSystem extends EventEmitter {
  options: CSOptions;

  server: WebSocket.Server | null = null;

  clients: Array<Client> = [];

  constructor(options: CSOptions) {
    super();
    this.options = options;
  }

  listen(port = 9220, host?: string) {
    const validateConnection = this.options.validateConnection || (() => true);
    const wsOptions = {
      port,
      host,
      handleProtocols: (protocols: Set<string>) => {
        if (protocols.has(OCPP_PROTOCOL_1_6)) {
          return OCPP_PROTOCOL_1_6;
        }
        return false;
      },
      verifyClient: async (
        info: { origin: string; secure: boolean; req: IncomingMessage },
        callback: (res: boolean, code?: number, message?: string) => void,
      ) => {
        console.debug(info.req.url, info.req.headers);
        try {
          const cpId = CentralSystem.getCpIdFromUrl(info.req.url);
          if (!cpId) {
            throw new Error('Invalid Charging point id');
          }
          const isAccepted = await validateConnection(cpId, info.req);
          if (!isAccepted) {
            throw new Error('The central system does not recognize the charging point or an'
              + ' authorization error');
          }
          callback(true);
        } catch (e) {
          if (e instanceof Error) {
            callback(false, 404, e.message);
          } else {
            callback(false, 404, 'Unknown error');
          }
        }
      },
      ...(this.options.wsOptions || {}),
    };

    this.server = new WebSocket.Server(wsOptions);

    this.server.on('error', (err: Error) => {
      console.info(err);
    });

    this.server.on('connection', (ws, req) => this.onNewConnection(ws, req));
  }

  onNewConnection(socket: WebSocket, req: IncomingMessage) {
    const cpId = CentralSystem.getCpIdFromUrl(req.url);
    if (!socket.protocol || !cpId) {
      // From Spec: If the Central System does not agree to using one of the subprotocols offered
      // by the client, it MUST complete the WebSocket handshake with a response without a
      // Sec-WebSocket-Protocol header and then immediately close the WebSocket connection.
      console.info('Closed connection due to unsupported protocol');
      socket.close();
      return;
    }

    socket.on('error', (err) => {
      console.info(err, socket.readyState);
    });

    const client = new Client(cpId);
    client.setConnection(new Protocol(client, socket));
    socket.on('close', (code: number, reason: Buffer) => {
      const index = this.clients.indexOf(client);
      this.clients.splice(index, 1);
      client.emit('close', code, reason);
      this.emit('close', client, code, reason);
    });
    this.clients.push(client);
    this.emit('connection', client);
  }

  static getCpIdFromUrl(url: string | undefined): string | undefined {
    if (url) {
      const parts = decodeURI(url).split('/')
      .filter((item) => item);
      return parts[parts.length - 1];
    }
    return undefined;
  }
}

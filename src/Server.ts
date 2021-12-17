import EventEmitter from 'events';
import WebSocket, { ServerOptions } from 'ws';
import { IncomingMessage } from 'http';
import { Protocol } from './Protocol';

const OCPP_PROTOCOL_1_6 = 'ocpp1.6';

export type CSOptions = {
  wsOptions?: ServerOptions,
  validateConnection?: (url: string | undefined) => boolean
};

export class Server extends EventEmitter {
  options: CSOptions;

  server: WebSocket.Server | null = null;

  clients: Array<Protocol> = [];

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
        const isAccept = await validateConnection(info.req.url);

        console.debug(`Request for connect "${info.req.url}" (${info.req.headers['sec-websocket-protocol']}) - ${isAccept ? 'Valid identifier' : 'Invalid identifier'}`);

        callback(isAccept, 404, 'Central System does not recognize the charge point identifier in the URL path');
      },
      ...(this.options.wsOptions || {}),
    };

    this.server = new WebSocket.Server(wsOptions);

    this.server.on('error', (server: WebSocket.Server, err: Error) => {
      console.info(err);
    });

    this.server.on('connection', (ws, req) => this.onNewConnection(ws, req));
  }

  onNewConnection(socket: WebSocket, req: IncomingMessage) {
    socket.on('error', (err) => {
      console.info(err, socket.readyState);
    });

    if (!socket.protocol) {
      // From Spec: If the Central System does not agree to using one of the subprotocols offered by the client,
      // it MUST complete the WebSocket handshake with a response without a Sec-WebSocket-Protocol header and then
      // immediately close the WebSocket connection.
      console.info('Close connection due to unsupported protocol');
      return socket.close();
    }

    const cpId = this.getCpIdFromUrl(req.url);
    const connection = new Protocol(this, socket, cpId);

    socket.on('close', (ws: WebSocket, code: number, reason: Buffer) => {
      console.info(reason);
      const index = this.clients.indexOf(connection);
      this.clients.splice(index, 1);
    });
    this.clients.push(connection);
  }

  private getCpIdFromUrl(url: string | undefined): string | undefined {
    if (url) {
      const parts = url.split('/').filter((item) => item);
      return parts[parts.length - 1];
    }
    return undefined;
  }
}

import WebSocket from 'ws';
import * as schemas from './schemas';

const CALL_MESSAGE = 2; // Client-to-Server
const CALLRESULT_MESSAGE = 3; // Server-to-Client
const CALLERROR_MESSAGE = 4; // Server-to-Client

export class ConnectionClient {
  constructor (socket: WebSocket) {
    socket.on('message', (message) => {
      try {
        const [messageType, ...rest] = JSON.parse(message.toString());
        if (!Array.isArray(rest)) {
          throw new Error('ProtocolError');
        }

        if (messageType === CALL_MESSAGE && rest.length === 3) {
          const [messageId, action, payload] = rest;
          this.onCall(messageId, action, payload);
        } else if (messageType === CALLRESULT_MESSAGE && rest.length === 2) {
          const [messageId, payload] = rest;
          this.onCallResult(messageId, payload);
        } else if (messageType === CALLERROR_MESSAGE && rest.length === 4) {
          const [messageId, errorCode, errorDescription, errorDetails] = rest;
          this.onCallError(messageId, errorCode, errorDescription, errorDetails);
        } else {
          throw new Error('ProtocolError');
        }
      } catch (err) {
        if (err instanceof SyntaxError || err instanceof Error) {
          console.error(err.message);
        }
      }
    });
  }

  onCallError (messageId: string, errorCode: string, errorDescription: string, errorDetails: any) {
    throw new Error('Method not implemented.');
  }

  onCallResult (messageId: string, payload: any) {
    throw new Error('Method not implemented.');
  }

  async onCall (messageId: string, action: string, payload: any) {
    // @ts-ignore
    const schema = schemas[action];
    console.log(schema, payload);
    if (!schema) {
      throw new Error('NotImplemented');
    }
    // TODO validate payload
  }
}

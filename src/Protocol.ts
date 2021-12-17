import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import EventEmitter from 'events';
import schemas from './schemas';
import { ERROR_INTERNALERROR, ERROR_NOTIMPLEMENTED, OcppError } from './OcppError';

const CALL_MESSAGE = 2; // Client-to-Server
const CALLRESULT_MESSAGE = 3; // Server-to-Client
const CALLERROR_MESSAGE = 4; // Server-to-Client

export class Protocol {
  pendingCalls: any = {};

  eventEmitter: EventEmitter;

  socket: WebSocket;

  cpId: string | undefined;

  constructor(eventEmitter: EventEmitter, socket: WebSocket, cpId?: string) {
    this.eventEmitter = eventEmitter;
    this.socket = socket;
    this.cpId = cpId;
    this.socket.on('message', (message) => {
      this.onMessage(message.toString());
    });
  }

  onMessage(message: string) {
    try {
      console.debug(message);
      const [messageType, ...rest] = JSON.parse(message);
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
  }

  public callRequest(action: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const formattedAction = this.formatSchemaAction(action);
        const messageId = uuidv4();
        const result = JSON.stringify([CALL_MESSAGE,
          messageId,
          formattedAction,
          payload]);
        console.debug(result);
        this.socket.send(result);
        this.pendingCalls[messageId] = { resolve, reject };

        setTimeout(() => {
          // timeout error
          this.onCallError(messageId, ERROR_INTERNALERROR, 'No response from the client', {});
        }, 10000);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  private formatSchemaAction(action: string) {
    // for some reason schema titles contains "Request" postfix
    return action.replace('Request', '');
  }

  private deFormatSchemaAction(action: string) {
    // for some reason schema titles contains "Request" postfix
    return `${action}Request`;
  }

  private callError(messageId: string, error: OcppError) {
    try {
      const result = JSON.stringify([CALLERROR_MESSAGE,
        messageId,
        error.code,
        error.message,
        error.details || {}]);
      this.socket.send(result);
    } catch (e) {
      console.error(e);
    }
  }

  private onCallError(messageId: string, errorCode: string, errorDescription: string, errorDetails: any) {
    const { reject } = this.pendingCalls[messageId];
    if (reject) {
      reject(new OcppError(errorCode, errorDescription, errorDetails));
    }
    delete this.pendingCalls[messageId];
  }

  private onCallResult(messageId: string, payload: any) {
    const { resolve } = this.pendingCalls[messageId];
    if (resolve) {
      resolve(payload);
    }
    delete this.pendingCalls[messageId];
  }

  private async onCall(messageId: string, action: string, payload: any) {
    // @ts-ignore
    const schema = schemas[action];
    console.log(schema, action, payload);
    if (!schema) {
      throw new Error('NotImplemented');
    }
    // TODO validate payload

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // timeout error
        reject(new OcppError(ERROR_INTERNALERROR, 'No response from the handler'));
      }, 10000);

      const deformattedAction = this.deFormatSchemaAction(action);
      const hasListener = this.eventEmitter.emit(deformattedAction, payload, (response: any) => {
        resolve(response);
      });
      if (!hasListener) {
        reject(new OcppError(ERROR_NOTIMPLEMENTED, `Listener for action "${deformattedAction}" not set`));
      }
    });
    promise.then((response) => {
      this.callResult(messageId, action, response);
    }).catch((err: OcppError) => {
      this.callError(messageId, err);
    });
  }

  private callResult(messageId: string, action: string, responsePayload: any) {
    try {
      const result = JSON.stringify([
        CALLRESULT_MESSAGE,
        messageId,
        responsePayload]);
      this.socket.send(result);
    } catch (e) {
      if (e instanceof SyntaxError) {
        this.callError(messageId, new OcppError(ERROR_INTERNALERROR, 'Response payload is invalid'));
        console.error(e.message);
      }
    }
  }
}

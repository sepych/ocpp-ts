import EventEmitter from 'events';
import { Protocol } from './Protocol';

export class ClientBase extends EventEmitter {
  private connection: Protocol | null = null;

  private cpId: string;

  constructor(cpId: string) {
    super();
    this.cpId = cpId;
  }

  getCpId(): string {
    return this.cpId;
  }

  setConnection(connection: Protocol | null): void {
    this.connection = connection;
  }

  callRequest(action: string, payload: any): Promise<any> {
    if (this.connection) {
      return this.connection.callRequest(action, payload);
    }
    throw new Error('Charging point not connected to central system');
  }
}

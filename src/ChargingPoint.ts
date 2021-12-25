import WebSocket from 'ws';
import { OutgoingHttpHeaders } from 'http';
import { Protocol } from './Protocol';
import { OCPP_PROTOCOL_1_6 } from './schemas';
import { Client } from './Client';
import {
  AuthorizeRequest,
  AuthorizeResponse,
  BootNotificationRequest,
  BootNotificationResponse,
  DataTransferRequest,
  DataTransferResponse,
  DiagnosticsStatusNotificationRequest,
  DiagnosticsStatusNotificationResponse,
  FirmwareStatusNotificationRequest,
  FirmwareStatusNotificationResponse,
  HeartbeatRequest,
  HeartbeatResponse,
  MeterValuesRequest,
  MeterValuesResponse,
  StartTransactionRequest,
  StartTransactionResponse,
  StatusNotificationRequest,
  StatusNotificationResponse,
  StopTransactionRequest, StopTransactionResponse,
} from './types';

export class ChargingPoint extends Client {
  callRequest(request: 'Authorize', payload: AuthorizeRequest): Promise<AuthorizeResponse>
  callRequest(request: 'BootNotification', payload: BootNotificationRequest): Promise<BootNotificationResponse>
  callRequest(request: 'DataTransfer', payload: DataTransferRequest): Promise<DataTransferResponse>
  callRequest(request: 'DiagnosticsStatusNotification', payload: DiagnosticsStatusNotificationRequest): Promise<DiagnosticsStatusNotificationResponse>
  callRequest(request: 'FirmwareStatusNotification', payload: FirmwareStatusNotificationRequest): Promise<FirmwareStatusNotificationResponse>
  callRequest(request: 'Heartbeat', payload: HeartbeatRequest): Promise<HeartbeatResponse>
  callRequest(request: 'MeterValues', payload: MeterValuesRequest): Promise<MeterValuesResponse>
  callRequest(request: 'StartTransaction', payload: StartTransactionRequest): Promise<StartTransactionResponse>
  callRequest(request: 'StatusNotification', payload: StatusNotificationRequest): Promise<StatusNotificationResponse>
  callRequest(request: 'StopTransaction', payload: StopTransactionRequest): Promise<StopTransactionResponse>
  callRequest(request: string, payload: any): Promise<any> {
    return super.callRequest(request, payload);
  }

  connect(centralSystemUrl: string, headers?: OutgoingHttpHeaders) {
    const ws = new WebSocket(centralSystemUrl + this.getCpId(), [OCPP_PROTOCOL_1_6], {
      perMessageDeflate: false,
      protocolVersion: 13,
      headers,
    });

    ws.on('upgrade', (res) => {
      if (!res.headers['sec-websocket-protocol']) {
        this.emit('error', new Error(`Server doesn't support protocol ${OCPP_PROTOCOL_1_6}`));
      }
    });

    ws.on('close', (code: number, reason: Buffer) => {
      this.setConnection(null);
      this.emit('close', code, reason);
    });

    ws.on('open', () => {
      if (ws) {
        this.setConnection(new Protocol(this, ws));
        this.emit('connect');
      }
    });

    ws.on('error', (err) => {
      this.emit('error', err);
    });
  }
}

import { Client } from './Client';
import {
  CancelReservationRequest,
  CancelReservationResponse,
  ChangeAvailabilityRequest,
  ChangeAvailabilityResponse,
  ChangeConfigurationRequest,
  ChangeConfigurationResponse,
  ClearCacheRequest,
  ClearCacheResponse,
  ClearChargingProfileRequest,
  ClearChargingProfileResponse,
  DataTransferRequest,
  DataTransferResponse,
  GetCompositeScheduleRequest,
  GetCompositeScheduleResponse,
  GetConfigurationRequest,
  GetConfigurationResponse,
  GetDiagnosticsRequest,
  GetDiagnosticsResponse,
  GetLocalListVersionRequest,
  GetLocalListVersionResponse,
  RemoteStartTransactionRequest,
  RemoteStartTransactionResponse,
  RemoteStopTransactionRequest,
  RemoteStopTransactionResponse,
  ReserveNowRequest,
  ReserveNowResponse,
  ResetRequest,
  ResetResponse,
  SendLocalListRequest,
  SendLocalListResponse,
  SetChargingProfileRequest,
  SetChargingProfileResponse,
  TriggerMessageRequest,
  TriggerMessageResponse,
  UnlockConnectorRequest,
  UnlockConnectorResponse,
  UpdateFirmwareRequest,
  UpdateFirmwareResponse,
} from './types';

export class ClientConnection extends Client {
  callRequest(request: 'CancelReservation', payload: CancelReservationRequest): Promise<CancelReservationResponse>
  callRequest(request: 'ChangeAvailability', payload: ChangeAvailabilityRequest): Promise<ChangeAvailabilityResponse>
  callRequest(request: 'ChangeConfiguration', payload: ChangeConfigurationRequest): Promise<ChangeConfigurationResponse>
  callRequest(request: 'ClearCache', payload: ClearCacheRequest): Promise<ClearCacheResponse>
  callRequest(request: 'ClearChargingProfile', payload: ClearChargingProfileRequest): Promise<ClearChargingProfileResponse>
  callRequest(request: 'DataTransfer', payload: DataTransferRequest): Promise<DataTransferResponse>
  callRequest(request: 'GetCompositeSchedule', payload: GetCompositeScheduleRequest): Promise<GetCompositeScheduleResponse>
  callRequest(request: 'GetConfiguration', payload: GetConfigurationRequest): Promise<GetConfigurationResponse>
  callRequest(request: 'GetDiagnostics', payload: GetDiagnosticsRequest): Promise<GetDiagnosticsResponse>
  callRequest(request: 'GetLocalListVersion', payload: GetLocalListVersionRequest): Promise<GetLocalListVersionResponse>
  callRequest(request: 'RemoteStartTransaction', payload: RemoteStartTransactionRequest): Promise<RemoteStartTransactionResponse>
  callRequest(request: 'RemoteStopTransaction', payload: RemoteStopTransactionRequest): Promise<RemoteStopTransactionResponse>
  callRequest(request: 'ReserveNow', payload: ReserveNowRequest): Promise<ReserveNowResponse>
  callRequest(request: 'Reset', payload: ResetRequest): Promise<ResetResponse>
  callRequest(request: 'SendLocalList', payload: SendLocalListRequest): Promise<SendLocalListResponse>
  callRequest(request: 'SetChargingProfile', payload: SetChargingProfileRequest): Promise<SetChargingProfileResponse>
  callRequest(request: 'TriggerMessage', payload: TriggerMessageRequest): Promise<TriggerMessageResponse>
  callRequest(request: 'UnlockConnector', payload: UnlockConnectorRequest): Promise<UnlockConnectorResponse>
  callRequest(request: 'UpdateFirmware', payload: UpdateFirmwareRequest): Promise<UpdateFirmwareResponse>
  callRequest(request: string, payload: any): Promise<any> {
    return super.callRequest(request, payload);
  }
}

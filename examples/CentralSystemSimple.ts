import {
  OcppServer, OcppTypes, ChargingPointRequests as events, OcppClientConnection,
} from '../src';

const centralSystemSimple = new OcppServer();
centralSystemSimple.listen(9220);
centralSystemSimple.on('connection', (client: OcppClientConnection) => {
  console.log(`Client ${client.getCpId()} connected`);
  client.on('close', (code: number, reason: Buffer) => {
    console.log(`Client ${client.getCpId()} closed connection`, code, reason.toString());
  });

  client.on(events.BootNotification, (request: OcppTypes.BootNotificationRequest, cb: (response: OcppTypes.BootNotificationResponse) => void) => {
    const response: OcppTypes.BootNotificationResponse = {
      status: 'Accepted',
      currentTime: new Date().toISOString(),
      interval: 60,
    };
    cb(response);
  });
});

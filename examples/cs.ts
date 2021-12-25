import {
  CentralSystem, OcppTypes, ChargingPointRequests as events, ClientConnection,
} from '../src';

const cs = new CentralSystem();
cs.listen(9220);
cs.on('connection', (client: ClientConnection) => {
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

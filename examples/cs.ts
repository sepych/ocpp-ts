import {
 CentralSystem, Client, OcppType, CP_ACTIONS,
} from '../src';

const cs = new CentralSystem({});
cs.listen(9220);
cs.on('connection', (client: Client) => {
  console.log(`Client ${client.getCpId()} connected`);
  client.on('close', (code: number, reason: Buffer) => {
    console.log(`Client ${client.getCpId()} closed connection`, code, reason.toString());
  });

  client.on(CP_ACTIONS.BootNotification, (request: OcppType.BootNotificationRequest, cb: (response: OcppType.BootNotificationResponse) => void) => {
    const response: OcppType.BootNotificationResponse = {
      status: 'Accepted',
      currentTime: new Date().toISOString(),
      interval: 60,
    };
    cb(response);
  });
});

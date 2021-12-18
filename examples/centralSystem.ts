import { Server, ClientBase, ocpp } from '../src';
import { BootNotificationRequest } from '../src/ocpp-1.6-types/BootNotification';
import { BootNotificationResponse } from '../src/ocpp-1.6-types/BootNotificationResponse';

const server = new Server({});
server.listen(9220);
server.on('connection', (client: ClientBase) => {
  console.log(`Client ${client.getCpId()} connected`);
  client.on('close', (code: number, reason: Buffer) => {
    console.log(`Client ${client.getCpId()} closed connection`, code, reason.toString());
  });

  client.on(ocpp.BootNotification.title, (request: BootNotificationRequest, cb: (response: BootNotificationResponse) => void) => {
    const response: BootNotificationResponse = {
      status: 'Accepted',
      currentTime: new Date().toISOString(),
      interval: 60,
    };
    cb(response);
  });
});

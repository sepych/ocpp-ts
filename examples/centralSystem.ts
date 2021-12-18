import {
 Server, ClientBase, OcppSchema, OcppType,
} from '../src';

const server = new Server({});
server.listen(9220);
server.on('connection', (client: ClientBase) => {
  console.log(`Client ${client.getCpId()} connected`);
  client.on('close', (code: number, reason: Buffer) => {
    console.log(`Client ${client.getCpId()} closed connection`, code, reason.toString());
  });

  client.on(OcppSchema.BootNotification.title, (request: OcppType.BootNotificationRequest, cb: (response: OcppType.BootNotificationResponse) => void) => {
    const response: OcppType.BootNotificationResponse = {
      status: 'Accepted',
      currentTime: new Date().toISOString(),
      interval: 60,
    };
    cb(response);
  });
});

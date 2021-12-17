import { Server } from '../src/Server';
import schemas from '../src/schemas';
import { BootNotificationRequest } from '../src/ocpp-1.6-types/BootNotification';
import { BootNotificationResponse } from '../src/ocpp-1.6-types/BootNotificationResponse';

const server = new Server({});
server.listen(9220);

server.on(schemas.BootNotification.title, (request: BootNotificationRequest, cb: (response: BootNotificationResponse) => void) => {
  const response: BootNotificationResponse = {
    status: 'Accepted',
    currentTime: new Date().toISOString(),
    interval: 60,
  };
  cb(response);
});

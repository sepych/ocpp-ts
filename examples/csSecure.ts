import { IncomingMessage } from 'http';
import fs from 'fs';
import {
  CentralSystem, Client, OcppTypes, ChargingPointRequests as events,
} from '../src';

const cs = new CentralSystem();
cs.on('connection', (client: Client) => {
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

cs.on('authorization', (cbId: string, req: IncomingMessage, cb: (err?: Error) => void) => {
  console.log('authorization', cbId, req.headers.authorization);
  // validate authorization header
  // cb(new Error('Unathorized')); // Deny
  cb(); // Accept
});
cs.listen(9220, {
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem'),
});

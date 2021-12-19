# OCPP

Typescript package implementing the JSON version of the Open Charge Point Protocol (OCPP). Currently OCPP 1.6 is supported.

Open Charge Point Protocol (OCPP, <http://www.openchargealliance.org/>) is a communication protocol between multiple charging stations ("charge points") and a single management software ("central system").

## Installation
```
npm i ocpp-ts
```

## Usage

### Central System

```ts
import {
  CentralSystem, Client, OcppTypes, ChargingPointRequests as events,
} from 'ocpp-ts';

const cs = new CentralSystem();
cs.listen(9220);
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
```

### Charging Point

```ts
import {
  Client, OcppError, OcppType, ChargingPointRequests as requests,
} from 'ocpp-ts';

const cp = new ChargingPoint('CP1111');

async function init() {
  await cp.connect('ws://localhost:9220/webServices/ocpp/');
  const boot: OcppTypes.BootNotificationRequest = {
    chargePointVendor: 'eParking',
    chargePointModel: 'NECU-T2',
  };

  try {
    const bootResp: OcppTypes.BootNotificationResponse = await cp.callRequest(requests.BootNotification, boot);
    if (bootResp.status === 'Accepted') {
      const transaction: OcppTypes.StartTransactionRequest = {
        connectorId: 0,
        idTag: '1234',
        meterStart: 0,
        timestamp: new Date().toISOString(),
      };
      const transactionResp: OcppTypes.StartTransactionResponse = await cp.callRequest(requests.StartTransaction, transaction);
      if (transactionResp.idTagInfo.status === 'Accepted') {
        console.log('Starting transaction...');
      }
    }
  } catch (e) {
    if (e instanceof Error || e instanceof OcppError) {
      console.error(e.message);
    }
  }
}

init();
```

## Security

Add required certificates for Central System, note from OCPP protocol:

``
As some Charge Point implementations are using embedded systems with limited computing
resources, we impose an additional restriction on the TLS configuration on the server side:
The TLS certificate SHALL be an RSA certificate with a size no greater than 2048 bytes
``

```ts
import https from 'https';
import fs from 'fs';
import { IncomingMessage } from 'http';
import { CentralSystem } from 'ocpp-ts';

const server = https.createServer({
    cert: fs.readFileSync('certificate.pem'),
    key: fs.readFileSync('key.pem')
});
const cs = new CentralSystem({ 
  wsOptions: {
    server
  },
  validateConnection: (cpId: string, req: IncomingMessage): Promise<boolean> => {
    // validate an authorization header
    // ...
    return Promise.resolve(isAuthorized);
  }
});
cs.listen(9220);
```

If the central system requires authorization, an authorization header can be placed as the second parameter.

```ts
await cp.connect('wss://eparking.fi/webServices/ocpp/', {
  Authorization: getBasicAuth(),
});
```


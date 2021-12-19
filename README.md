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
  Server, ClientBase, OcppSchema, OcppType,
} from 'ocpp-ts';

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
```

### Charging Point

```ts
import {
  Client, OcppSchema, OcppError, OcppType,
} from 'ocpp-ts';

const client = new Client('CP1111');

async function init() {
  await client.connect('ws://localhost:9220/webServices/ocpp/');
  const boot: OcppType.BootNotificationRequest = {
    chargePointVendor: 'eParking',
    chargePointModel: 'NECU-T2',
  };

  try {
    const bootResp: OcppType.BootNotificationResponse = await client.callRequest(OcppSchema.BootNotification.title, boot);
    if (bootResp.status === 'Accepted') {
      const transaction: OcppType.StartTransactionRequest = {
        connectorId: 0,
        idTag: '1234',
        meterStart: 0,
        timestamp: new Date().toISOString(),
      };
      const transactionResp: OcppType.StartTransactionResponse = await client.callRequest(OcppSchema.StartTransaction.title, transaction);
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


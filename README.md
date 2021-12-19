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

const cs = new CentralSystem({});
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


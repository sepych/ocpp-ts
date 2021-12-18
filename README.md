# OCPP (WIP)

Typescript package implementing the JSON version of the Open Charge Point Protocol (OCPP). Currently OCPP 1.6 (errata v4) is supported.

Open Charge Point Protocol (OCPP, <http://www.openchargealliance.org/>) is a communication protocol between multiple charging stations ("charge points") and a single management software ("central system").

## Installation
```
WIP
```

## Usage

### Central System

```ts
import { Server } from '../src/Server';
import schemas from '../src/schemas';
import { BootNotificationRequest } from '../src/ocpp-1.6-types/BootNotification';
import { BootNotificationResponse } from '../src/ocpp-1.6-types/BootNotificationResponse';
import { ClientBase } from '../src/ClientBase';

const server = new Server({});
server.listen(9220);
server.on('connection', (client: ClientBase) => {
  console.log(`Client ${client.getCpId()} connected`);
  client.on('close', (code: number, reason: Buffer) => {
    console.log(`Client ${client.getCpId()} closed connection`, code, reason.toString());
  });

  client.on(schemas.BootNotification.title, (request: BootNotificationRequest, cb: (response: BootNotificationResponse) => void) => {
    const response: BootNotificationResponse = {
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
import { Client } from '../src/Client';
import { BootNotificationRequest } from '../src/ocpp-1.6-types/BootNotification';
import { BootNotificationResponse } from '../src/ocpp-1.6-types/BootNotificationResponse';
import schemas from '../src/schemas';
import { OcppError } from '../src/OcppError';

const client = new Client('CP1111');

async function init() {
  await client.connect('ws://localhost:9220/webServices/ocpp/');
  const boot: BootNotificationRequest = {
    chargePointVendor: 'eParking',
    chargePointModel: 'NECU-T2',
  };

  try {
    const bootResp: BootNotificationResponse = await client.callRequest(schemas.BootNotification.title, boot);
    if (bootResp.status === 'Accepted') {
      // listen for incoming events
    }
  } catch (e) {
    if (e instanceof Error || e instanceof OcppError) {
      console.error(e.message);
    }
  }
}

init();
```

## License

### Internet Systems Consortium license

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

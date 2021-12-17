import {Client} from '../src/Client';
import {BootNotificationRequest} from "../src/ocpp-1.6-types/BootNotification";
import {BootNotificationResponse} from "../src/ocpp-1.6-types/BootNotificationResponse";
import schemas from "../src/schemas";
import {RemoteStartTransactionRequest} from "../src/ocpp-1.6-types/RemoteStartTransaction";
import {RemoteStartTransactionResponse} from "../src/ocpp-1.6-types/RemoteStartTransactionResponse";
import {OcppError} from "../src/OcppError";

const client = new Client();

async function init() {
  await client.connect('ws://localhost:9220/webServices/ocpp/CP1111');
  const boot: BootNotificationRequest = {
    chargePointVendor: 'eParking',
    chargePointModel: 'NECU-T2'
  }

  client.callRequest(schemas.BootNotification.title, boot)
    .then((response: BootNotificationResponse) => {
            if (response.status === 'Accepted') {
              client.on(schemas.RemoteStartTransaction.title, (
                request: RemoteStartTransactionRequest,
                cb: (response: RemoteStartTransactionResponse) => void) => {
                const response: RemoteStartTransactionResponse = {
                  status: 'Accepted'
                };
                cb(response);
              });
            }
          }
    ).catch((e) => {
    if (e instanceof Error || e instanceof OcppError) {
      console.error(e.message);
    }
  })

}

init();

import { Client } from '../src/Client';
import { BootNotificationRequest } from '../src/ocpp-1.6-types/BootNotification';
import { BootNotificationResponse } from '../src/ocpp-1.6-types/BootNotificationResponse';
import schemas from '../src/schemas';
import { OcppError } from '../src/OcppError';
import { StartTransactionRequest } from '../src/ocpp-1.6-types/StartTransaction';
import { StartTransactionResponse } from '../src/ocpp-1.6-types/StartTransactionResponse';

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
      const transaction: StartTransactionRequest = {
        connectorId: 0,
        idTag: '1234',
        meterStart: 0,
        timestamp: new Date().toISOString(),
      };
      const transactionResp: StartTransactionResponse = await client.callRequest(schemas.StartTransaction.title, transaction);
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

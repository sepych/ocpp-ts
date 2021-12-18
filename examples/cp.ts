import {
 Client, OcppSchema, OcppError, OcppType,
} from '../src';

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

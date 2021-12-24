import {
  OcppError, OcppTypes, ChargingPointRequests as requests, OcppClient,
} from '../src';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const cp = new OcppClient('CP1111');
cp.on('error', (err: Error) => {
  console.log(err.message);
});
cp.on('close', () => {
  console.log('Connection closed');
});
cp.on('connect', async () => {
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
});

cp.connect('wss://example.com:8081/webServices/ocpp/');

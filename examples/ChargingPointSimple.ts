import {
  OcppClient, OcppError, OcppTypes,
} from '../src';

const chargingPointSimple = new OcppClient('CP1111');
chargingPointSimple.on('error', (err: Error) => {
  console.log(err.message);
});
chargingPointSimple.on('close', () => {
  console.log('Connection closed');
});

chargingPointSimple.on('connect', async () => {
  const boot: OcppTypes.BootNotificationRequest = {
    chargePointVendor: 'eParking',
    chargePointModel: 'NECU-T2',
  };

  try {
    const bootResp: OcppTypes.BootNotificationResponse = await chargingPointSimple.callRequest('BootNotification', boot);
    if (bootResp.status === 'Accepted') {
      console.log('Bootnotification accepted');
    }
  } catch (e) {
    if (e instanceof Error || e instanceof OcppError) {
      console.error(e.message);
    }
  }
});
chargingPointSimple.connect('ws://localhost:9220/webServices/ocpp/');

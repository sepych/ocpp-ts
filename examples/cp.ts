import { Client } from '../src/Client';

const client = new Client();

async function init () {
  await client.connect('http://localhost:9220/webServices/ocpp/CP1111');
}

init();

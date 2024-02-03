// the message broker is used to store confidential infomation and then
// the message can store block Message brokers can validate, store, route, and deliver messages to the appropriate destinations. 

import NATSServer from './server';
const PORT = 4222;
const HOST = undefined;
let DEBUG = false;// debug  is false because

//A message broker is a software component that allows application

for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--debug') {
      DEBUG = true;
    }
  }
  const server = new NATSServer(PORT, HOST, DEBUG);

  server.startServer();

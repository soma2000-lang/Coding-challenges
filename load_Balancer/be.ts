import express from 'express';
import { IncomingMessage, Server, ServerResponse } from 'http';

const responseString= 'Hello from backend Server';
export interface IBackendServer {
    port: number;
  
    server: Server<typeof IncomingMessage, typeof ServerResponse>;
  
    /**
     * Returns the HTTP Server corresponding to the Express app.
     *
     * @public
     * @returns {Server<typeof IncomingMessage, typeof ServerResponse>}
     */
    getServer(): Server<typeof IncomingMessage, typeof ServerResponse>;
    
   returns {Server<typeof IncomingMessage, typeof ServerResponse>};
   
  close(): Server<typeof IncomingMessage, typeof ServerResponse>;
}
export class BackendServer implements IBackendServer {
    port;
    server;
  
    constructor(port: number) {
      // Initialize parameters
      this.port = port;
  
      const app = express();
  
      // Attach parsers
      app.use(express.text());
      app.use(express.json());
  
      app.get('/ping', (req, res) => {
        res.sendStatus(200);
      });
  
      app.get('/', (req, res) => {
        res.status(200).send(responseString);
      });
  
      const server = app.listen(port, () => {
        console.log('Backend Server listening on port ' + this.port);
      });
  
      this.server = server;
    }
  
    public getServer(): Server<typeof IncomingMessage, typeof ServerResponse> {
      return this.server;
    }
  
    public close(): Server<typeof IncomingMessage, typeof ServerResponse> {
      const server = this.server.close();
      console.log(`Closed Backend Server with port ${this.port}`);
      return server;
    }
  }
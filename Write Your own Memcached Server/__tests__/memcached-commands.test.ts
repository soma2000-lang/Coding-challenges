import MemCached from 'memcached';

import MemCachedServer from '../memcached';
import sleep from '../../utils/sleep';
import { randomBytes } from 'crypto';
import { server } from 'typescript';

describe('Describe the test and the set command',()=>
{
    let server: MemCachedServer;
    let client: MemCached;
    const host = '127.0.0.1';
    const port = 11211;
    const key = randomBytes(4).toString('hex');
    const value = randomBytes(4).toString('hex');

    beforeAll(() => {
        server = new MemCachedServer(port, host);
      });
      afterAll(async () => {
        client.end();
        await server.stopServer();
      });

})

it('server should start successfully', async () => {
    await server.startServer();
    expect(server.status).toBe('listening');
});


const key = randomBytes(4).toString('hex');
it('Should allow connection with client', (done) => {
        client = new MemCached(`${host}:${port}`, { idle: 10000 });
        client.get('123', () => {
            expect(server.getConnectedClientsCount()).toBe(1);
            done();
        });
    });
    it('set command should work successfully', (done) => {
        client.set(key, value, 0, (err, result) => {
            expect(result).toBe(true);
            done();
        });
    });
    it('get command should work successfully', (done) => {
        client.get(key, (err, data) => {
          expect(data).toBe(value);
          done();
        });
      });
    
      it('should return nothing when no valid key is passed', (done) => {
        client.get('randomKey', (err, data) => {
          expect(data).toBe(undefined);
          done();
        });
      });
      describe('Testing expTime', () => {
        let server: MemCachedServer;
        let client: MemCached;
        const host = '127.0.0.1';
        const port = 11211;

        beforeAll(async () => {
            server = new MemCachedServer(port, host);
            await server.startServer();
          });
          beforeEach(() => {
            client = new MemCached(`${host}:${port}`, { idle: 10000 });
          });
          afterEach(() => {
            client.end();
          });
          afterAll(async () => {
            await server.stopServer();
          });

          it('Should handle expiry time when set to non zero', (done) => {
            const delay = 4;
            const randomKey = randomBytes(4).toString('hex');
            const randomValue = randomBytes(4).toString('hex');

            client.set(randomKey, randomValue, delay, (err, result) => {
                if (result !== undefined) {
                  expect(result).toBe(true);
               // Sleep for (delay / 2) seconds
            sleep((delay / 2) * 1000).then(() => {
                // Get the data
                client.get(randomKey, (err, data) => {
                // Data should be present
                expect(data).toBe(randomValue);
                sleep((delay / 2 + 1) * 1000).then(() => {
                    // Data should be absent
                    client.get(randomKey, (err, data) => {
                      expect(data).toBe(undefined);
                      done();
                    });
                  });
                });
              });
            }
          });
        }, 10000);
          
}
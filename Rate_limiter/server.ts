import express from 'express';
import { TokenBucketRateLimiter } from './algorithms/token-bucket';

import{
    FixedWindowCounterArgs,
  RateLimiter,
  RateLimiterArgs,
  RedisSlidingWindowCounterArgs,
  SlidingWindowCounterArgs,
  SlidingWindowLogArgs,
  TokenBucketArgs

}
import { RateLimiterType } from './enums';
import { FixedWindowCounterRateLimiter } from './algorithms/fixed-window-counter';
import { SlidingWindowLogRateLimiter } from './algorithms/sliding-window-log';
import { SlidingWindowCounterRateLimiter } from './algorithms/sliding-window-counter';
import { RedisSlidingWindowCounterRateLimiter } from './algorithms/redis-sliding-window-counter';
export const createRateLimiterServer = (
    rateLimiterType: RateLimiterType,
    args: RateLimiterArgs,
    port: number = 8080,
    debug: boolean = false
  ) => {
    const app = express();
  
    app.use(express.json());
    app.use(express.text());
  
    const rateLimiter = getRateLimiter(rateLimiterType, args);
    app.use('/limited', (req, res, next) =>
    rateLimiter.handleRequest(req, res, next)
  );
  app.use('/limited', (req, res, next) =>
  rateLimiter.handleRequest(req, res, next)
);
app.get('/unlimited', (req, res) => {
    res.send('Unlimited API endpoint\n');
  });

  const server = app.listen(port, () => {
    if (debug) {
      console.log('Started server on port ' + port);
    }
  });
  server.on('close', () => {
    rateLimiter.cleanup();
  });

  return { server, rateLimiter };
};

function getRateLimiter(
    rateLimiterType: RateLimiterType,
    args: RateLimiterArgs
  ): RateLimiter {
    switch (rateLimiterType) {
      case RateLimiterType.TOKEN_BUCKET:
        return new TokenBucketRateLimiter(args as TokenBucketArgs);
      case RateLimiterType.FIXED_WINDOW_COUNTER:
        return new FixedWindowCounterRateLimiter(args as FixedWindowCounterArgs);
      case RateLimiterType.SLIDING_WINDOW_LOG:
        return new SlidingWindowLogRateLimiter(args as SlidingWindowLogArgs);
      case RateLimiterType.SLIDING_WINDOW_COUNTER:
        return new SlidingWindowCounterRateLimiter(
          args as SlidingWindowCounterArgs
        );
      case RateLimiterType.REDIS_SLIDING_WINDOW_COUNTER:
        return new RedisSlidingWindowCounterRateLimiter(
          args as RedisSlidingWindowCounterArgs
        );
    }
  }
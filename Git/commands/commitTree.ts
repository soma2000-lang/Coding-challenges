import { createHash } from 'crypto';
import { Commit } from '../objects/commit';
import { getSignature, verifyObject } from '../utils';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { RELATIVE_PATH_TO_OBJECT_DIR } from '../constants';
import stream from 'stream';
export interface CommitTreeArgs {
    /**
     * The absolute path to the Git repo.
     *
     * @type {string}
     */
    gitRoot: string;
  
    /**
     * The hash of the tree that will be saved with the Commit object.
     *
     * @type {string}
     */
    treeHash: string;
  
    /**
     * List of parent objects.
     *
     * @type {?string[]}
     */
    parents?: string[];
    */
    message?: string;
  
    /**
     * Optionally read from stdin if no message is provided
     *
     * @type {?stream.Readable}
     */
    stdin?: stream.Readable;
  }
  
  function commitTree({
    gitRoot,
    treeHash,
    parents = [],
    message,
    stdin = process.stdin
  }: CommitTreeArgs):
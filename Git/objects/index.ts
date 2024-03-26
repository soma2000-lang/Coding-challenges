import path from 'path';
import { FileMode, Stage } from '../enums';
import { CachedTree } from './cachedTree';
import fs from 'fs';
import hashObject from '../commands/hashObject';
import {
  PREFIX_SIZE,
  CTIME_OFFSET,
  CTIME_NANO_OFFSET,
  MTIME_OFFSET,
  MTIME_NANO_OFFSET,
  DEV_OFFSET,
  INO_OFFSET,
  MODE_OFFSET,
  UID_OFFSET,
  GID_OFFSET,
  FILES_SIZE_OFFSET,
  HASH_OFFSET,
  FLAGS_OFFSET,
  RELATIVE_PATH_TO_INDEX_FILE
} from '../constants';
import { createHash } from 'crypto';
import { FLAGS_OFFSET, PREFIX_SIZE } from '../constants';

export interface IndexEntry {
    ctimeSec: number;
    ctimeNanoFrac: number;
    mtimeSec: number;
    mtimeNanoFrac: number;
    dev: number;
    ino: number;
    mode: FileMode;
    uid: number;
    gid: number;
    size: number;
    hash: string;
    name: string;
    stage: Stage;
    skipWorkTree: boolean;
    intentToAdd: boolean;
  }
  export function createIndexEntry(gitRoot: string, file: string): IndexEntry {
    const stat = fs.lstatSync(file);
  
    const ctimeSec = Math.floor(stat.ctimeMs / 1000);
  
    const ctimeNanoFrac = Math.floor((stat.ctimeMs - ctimeSec * 1000) * 1000_000);
  
    const mtimeSec = Math.floor(stat.mtimeMs / 1000);
  
    const mtimeNanoFrac = Math.floor((stat.mtimeMs - mtimeSec * 1000) * 1000_000);
  
    const filePath = path.relative(gitRoot, file);
  
    return {
      ctimeSec,
      ctimeNanoFrac,
      mtimeSec,
      mtimeNanoFrac,
      dev: stat.dev,
      ino: stat.ino,
      mode: FileMode.REGULAR,
      uid: stat.uid,
      gid: stat.gid,
      size: stat.size,
      hash: hashObject({ gitRoot, file: path.join(gitRoot, file), write: true }),
      name: filePath,
      stage: Stage.ZERO,
      skipWorkTree: false,
      intentToAdd: false
    };
  }
  export function encodeIndexEntry(e: IndexEntry): Buffer {
    const prefix = Buffer.alloc(PREFIX_SIZE, 0);
  
    prefix.writeUInt32BE(e.ctimeSec, CTIME_OFFSET);
    prefix.writeUInt32BE(e.ctimeNanoFrac, CTIME_NANO_OFFSET);
  
    prefix.writeUInt32BE(e.mtimeSec, MTIME_OFFSET);
    prefix.writeUInt32BE(e.mtimeNanoFrac, MTIME_NANO_OFFSET);
  
    prefix.writeUInt32BE(e.dev, DEV_OFFSET);
  
    prefix.writeUInt32BE(e.ino, INO_OFFSET);
  
    prefix.writeUInt32BE(e.mode, MODE_OFFSET);
  
    prefix.writeUInt32BE(e.uid, UID_OFFSET);
  
    prefix.writeUInt32BE(e.gid, GID_OFFSET);
  
    prefix.writeUInt32BE(e.size, FILES_SIZE_OFFSET);
  
    prefix.set(Buffer.from(e.hash, 'hex'), HASH_OFFSET);
  
    const nameLength = e.name.length < 0xfff ? e.name.length : 0xfff;
    prefix.writeUInt16BE((e.stage << 12) | nameLength, FLAGS_OFFSET);
  
    const pathName = Buffer.from(e.name, 'ascii'); // variable
  
    // Ensure padding size is in between 1 - 8
    const paddingSize = 8 - ((PREFIX_SIZE + pathName.byteLength) % 8);
  
    const padding = Buffer.alloc(paddingSize, '\0');
  
    return Buffer.concat([prefix, pathName, padding]);
  }
  
const nameLength = e.name.length < 0xfff ? e.name.length : 0xfff;
prefix.writeUInt16BE((e.stage << 12) | nameLength, FLAGS_OFFSET);

const pathName = Buffer.from(e.name, 'ascii'); // variable

// Ensure padding size is in between 1 - 8
const paddingSize = 8 - ((PREFIX_SIZE + pathName.byteLength) % 8);

const padding = Buffer.alloc(paddingSize, '\0');

return Buffer.concat([prefix, pathName, padding]);

export interface IndexHeader {
    signature: string;
    version: number;
}
export class Index {
    /**
     * Header information
     *
     * @type {IndexHeader}
     */
    header: IndexHeader;

    /**
     * Entries corresponding to the index.
     *
     * @type {IndexEntry[]}
     */
    entries: IndexEntry[];

    /**
     * The CachedTree Extension
     *
     * @type {?CachedTree}
     */
    cache?: CachedTree;
    constructor(header: IndexHeader, entries: IndexEntry[], cache?: CachedTree) {
        this.header = header;
        this.entries = entries;
        this.cache = cache;
    }
    add(e: IndexEntry) {
        this.entries.push(e);
    }
}

getEntry(path: string): IndexEntry | undefined {
        for (let i = 0; i < this.entries.length; i++) {
                if (this.entries[i]?.name === path) {
                        return this.entries[i];
                }
        }
        return undefined;
}
const entryBuffers: Buffer[] = [];
this.entries.forEach((entry) => {
    if (entry) {
        entryBuffers.push(encodeIndexEntry(entry));
    }
});
const indexContent = Buffer.concat([header, ...entryBuffers, cache]);

const checksum = Buffer.from(
    createHash('sha1').update(indexContent).digest('hex'),
    'hex'
  );
  fs.writeFileSync(
    RELATIVE_PATH_TO_INDEX_FILE,
    Buffer.concat([indexContent, checksum]),
    'hex'
  );
}
}
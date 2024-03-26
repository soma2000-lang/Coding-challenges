import { LF } from '../constants';
import { parseObject } from '../utils';
import { Signature, decodeSignature } from './signature';

export interface CommitArgs {
  author: Signature;
  committer: Signature;
  message: string;
  treeHash: string;
  parentHashes: string[];
}


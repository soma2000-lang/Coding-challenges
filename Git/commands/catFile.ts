import { SPACE, NULL } from '../constants';
import { fileModeString, fileType, parseObject } from '../utils';

interface CatFileArgs {
    /**
     * Absolute path to the root of the Git repo.
     *
     * @type {string}
     */
    gitRoot: string;
  
    /**
     * The hash value corresponding to the object.
     *
     * @type {string}
     */
    object: string;
  
    /**
     * Return the type only.
     *
     * @type {?boolean}
     */
    t?: boolean;
  
    /**
     * Return the content of the given object.
     *
     * @type {?boolean}
     */
    p?: boolean;
  }
  function parseTreeFile(data: Buffer): string {

    const output: string[] = [];
     
    for (let i = 0; i < data.length; ) {

  }
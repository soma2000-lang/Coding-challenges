import path from 'path';
import { getBranchHeadReference, getCurrentBranchName } from '../utils';
import commitTree from './commitTree';
import writeTree from './writeTree';
import { RELATIVE_PATH_TO_REF_HEADS_DIR } from '../constants';
import fs from 'fs';

'the main functions that do the commit command'
@param {string} gitRoot
* @param {string} message
* @returns {string}
*/
function commit(gitRoot: string, message: string): string {
    // Make sure a valid message is provided
    if (message.length === 0) {
      throw new Error('Please provide a valid message');
    }

    const branch=getCurrentBranchName(gitRoot);
    const  ref= getBranchHeadReference(gitRoot,branch);
    // Get current branch name and a ref to the parent hash if present.
    const parents: string[] = [];
    if (ref !== undefined) {
      parents.push(ref);// that become the arent branch then
    }
    const treeHash=writeTree(gitRoot);
    const hash = commitTree({ gitRoot, treeHash, message, parents });

    const pathToRef = path.join(gitRoot, RELATIVE_PATH_TO_REF_HEADS_DIR, branch);
    fs.writeFileSync(pathToRef, hash + '\n');
    if (parents.length === 0) {
        
        str += `[${branch} (root-commit) ${hash.substring(0, 7)} ${message} \r\n`;
      }else {
        str += `[${branch} ${hash.substring(0, 7)}] ${message}\r\n`;
      }
      return str;
    }


export default commit;
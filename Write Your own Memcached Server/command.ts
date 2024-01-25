import { isFunctionOrConstructorTypeNode } from "typescript";

type SupportCommands='set'| 'get' |'add' | 'replace';


export interface IMemCommand{
    name: SupportCommands;
    key: string;
    flags?: number;
    expTime?: number;
    byteCount?: number;
    noReply?: boolean;
}

constructor(
        commandName: SupportCommands,
        key,
        flags?: number,
        expTime?: number,
        byteCount?: number,
        noReply: boolean = false
    )
  // this has been done in this manner because this have no particular defined types
{
    this.name = commandName;
    this.key = key;
    this.flags = flags;
    this.expTime = expTime;
    this.byteCount = byteCount;
    this.noReply = noReply;
}
}
// Function used to parse a valid command.
//  * The commands follow the following format:
//  *
//  * `<command name> <key> <flags> <expTime> <byte count> [noreply]`
//  *
//  * The trailing CRLF is already removed while reading the data from the socket.


 export function parseMemCommand(input: string): IMemCommand {
 const params = input.split(' ');
 const name = params[0] as SupportCommands;

 const key = params[1];
 let flags;
 if (params[2]) {
   flags = parseInt(params[2]);
 }
 let expTime;
 if(params[3] && name=='set' || name=='get' || name=='replace'){
    try{

        expTime=parseInt(params[3]);}
        catch(e)
        {
            expTime=undefined;
        }
    }
let byteCount;
if(params[4] &&  name=='set' || name=='get' || name=='replace')
{
    byteCount=parseInt(params[4]);
}


return new MemCommand(name, key, flags, expTime, byteCount, noreply);
}
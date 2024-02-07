import { EscapeToken, NumberToken, Token } from './tokens';
import { JSONArray, JSONObject, JSONValue } from './types';

const FAILURE_EXIT_CODE = 1;
const SUCCESS_EXIT_CODE = 0;
// whether it has been a successfull process or not

export class JsonParser {
    private pos = 0;
    private input: string;
  
    constructor(input: string) {
      this.input = input;
    }

    
    public parse:JSON value()
    this.consumeWhitespace();
    const value = this.parseValue();
    this.consumeWhitespace();
    if(this.hasNext())
    console.log("An Unexpected value is at this token")
    else:

    console.log('The repo has been parsed successfully');
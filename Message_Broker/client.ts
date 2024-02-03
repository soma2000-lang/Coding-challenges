import { DEFAULT_EXTENSIONS } from '@babel/core';
import net from 'net';

export class Client {
    /**
     * This key is used to uniquely identify the client inside the server.
     *
     * @type {string}
     */
    key: string;

    /**
     * The socket instance corresponding to the connection.
     *
     * @type {net.Socket}
     */
    socket: net.Socket;
    private options: ClientOptions;

    constructor(
        key: string,
        socket: net.Socket,
        options: ClientOptions = DEFAULT_OPTIONS
    ) {
        this.key = key;
        this.socket = socket;
        this.options = options;
    }

    updateOptions(data: Partial<ClientOptions>) {
        this.options = { ...this.options, ...data };
    }

    sendPong() {
        this.socket.write('PONG\r\n');
    }

    sendOk() {
        if (this.options.verbose) {
            this.socket.write('+OK\r\n');
        }
    }
}

export interface ClientOptions {
    verbose: boolean;
    pedantic: boolean;
    tls_required: boolean;
    auth_token?: string;
    user?: string;
    pass?: string;
    name?: string;
    lang: string;
    version: string;
    protocol?: number;
    echo?: boolean;
    sig?: string;
    jwt?: string;
    no_responders?: boolean;
    headers?: boolean;
    nkey?: string;
}

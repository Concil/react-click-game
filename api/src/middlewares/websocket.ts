import * as WebSocket from "ws";
import {eventDispatcher} from "@deepkit/event";
import {onServerMainBootstrapDone} from "@deepkit/framework";


export class WebSocketService {

    wss: WebSocket.Server;

    constructor() {}

    @eventDispatcher.listen(onServerMainBootstrapDone)
    onServerStarted() {
        console.log('serverStarted');

        if ( this.wss === undefined ) {
            this.wss = new WebSocket.Server({noServer: true});
        }
    }

    //Todo: how i can implement webSocket to deepkit HTTP/RPC?
}
import {rpc} from "@deepkit/rpc";
import {t} from "@deepkit/type";


export class GAME {
    constructor() {
        //connect websocket
        // and react on messages
        // can be attached to react components to react on messages
    }
}


@rpc.controller("test")
export class MyClient {
    
    @rpc.action()
    public receiveMessage(message: string): void {
        console.log(`Received message from server: ${message}`);
    }
}
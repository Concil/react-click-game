import {RpcWebSocketClient} from "@deepkit/rpc";
import {UserController} from "../interfaces/controllers/user";
import {InventoryController} from "../interfaces/controllers/inventory";
import {BlackmarketController} from "../interfaces/controllers/blackmarket";
import {IPScannerController} from "../interfaces/controllers/ipscanner";
import {BankController} from "../interfaces/controllers/bank";
import {ItemController} from "../interfaces/controllers/item";
import {RPC} from "../interfaces/rpc";


export class GENERAL {
    static API_URL: string = "http://localhost:8080/";
    static WS_URL: string = "ws://localhost:8080";

    static buildRPC(client: RpcWebSocketClient): RPC {
        return {
            user: client.controller<UserController>('user'),
            inventory: client.controller<InventoryController>("inventory"),
            market: client.controller<BlackmarketController>("blackmarket"),
            ipscan: client.controller<IPScannerController>("ipscanner"),
            bank: client.controller<BankController>("bank"),
            item: client.controller<ItemController>("item"),
        }
    }
}